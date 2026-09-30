import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { trackEvent } from '../analytics'
import templates from '../data/guide-templates.json'
import { makeRotation, nextRotation, restoreRotation, ROTATION_KEY } from '../lib/guideRotation'
import './guide.css'

const phone = import.meta.env.VITE_CORPORATE_PHONE?.trim() || '010-7914-8311'
const sms = `sms:${phone.replace(/[^0-9]/g, '')}`
const applicantReply = '안녕하세요 연락처 알려주시면 가정집 청소 일자리 소개해주는 미소회사에서 연락이 갈꺼에요! 따로 면접이나 교육없고 원하는 장소에 원하는 시간대 만큼 바로 일할 수 있고, 당일 근무한 것은 당일 지급된다는 장점도 있어요! 상담 원하시면 전화번호 남겨주세요! 미소 담당자 측에서 곧바로 연락 드릴거에요~^^'
type Rect = [number, number, number, number]
type Picture = { src: string; size: [number, number]; screen: Rect; highlight?: Rect }
type Step = { instruction: string; picture: Picture; copy?: 'title' | 'body'; sms?: boolean }
type Chapter = 'post' | 'proof' | 'chat'
const screen = (file: string, size: [number, number], bounds: Rect): Picture => ({ src: `/guide/${file}.png`, size, screen: bounds })
// These bounds isolate COMPLETE phone screenshots from old review sheets.
// No app content is cropped or zoomed. Only the external sheet captions are excluded.
const proofPhoto = (n: number) => screen('proof', [1536, 1024], [[18, 31, 365, 899], [398, 31, 365, 899], [776, 31, 364, 899], [1154, 31, 364, 901]][n] as Rect)
const chatPhoto = (n: number) => screen('chat', [1448, 1086], [[20, 142, 340, 799], [373, 142, 338, 799], [725, 142, 350, 799], [1090, 142, 336, 799]][n] as Rect)
const postingPhoto = (file: string, highlight: Rect): Picture => ({ ...screen(`new-${file}`, [720, 1558], [0, 0, 720, 1558]), highlight })
const postingSteps: Step[] = [
  { instruction: '당근 홈에서 오른쪽 아래\n+ 글쓰기를 누르세요.', picture: postingPhoto('home', [500, 1277, 190, 96]) },
  { instruction: '알바/과외/레슨을\n누르세요.', picture: postingPhoto('menu', [359, 565, 326, 87]) },
  { instruction: '도와주실 분을 선택하고\n도와주실 분 구하기를 누르세요.', picture: postingPhoto('type', [28, 529, 665, 155]) },
  { instruction: '아래에서 제목을 복사해\n당근 제목 칸에 붙여넣으세요.', picture: postingPhoto('title', [26, 378, 669, 100]), copy: 'title' },
  { instruction: '가사·청소·정리를 선택하고\n당근의 다음을 누르세요.', picture: postingPhoto('category', [27, 430, 667, 142]) },
  { instruction: '아래에서 본문을 복사해\n당근 내용 칸에 붙여넣으세요.', picture: postingPhoto('body', [28, 478, 668, 176]), copy: 'body' },
  { instruction: '기간은 정기적으로를\n누르세요.', picture: postingPhoto('period', [27, 501, 667, 101]) },
  { instruction: '월~일 모든 요일을 선택하고\n하루 2시간으로 맞추세요.', picture: postingPhoto('hours', [27, 378, 667, 407]) },
  { instruction: '실제로 지급할 시급을 입력하세요.\n사진 속 15,000원은 예시예요.', picture: postingPhoto('pay', [27, 478, 667, 100]) },
  { instruction: '장소는 동네 인증한 곳으로\n선택하고 다음을 누르세요.', picture: { ...screen('new-location', [853, 1844], [0, 0, 853, 1844]), highlight: [33, 448, 787, 116] } },
  { instruction: '입력한 내용을 확인하고\n작성 완료를 누르면 게시돼요.', picture: postingPhoto('review', [265, 1381, 430, 105]) },
]
const proofSteps: Step[] = [
  { instruction: '나의 당근 → 진행중인 구인에서\n내가 올린 공고를 누르세요.', picture: screen('my-karrot-clean', [802, 1962], [0, 0, 802, 1962]) },
  { instruction: '오른쪽 위에서\n표시된 공유 버튼을 누르세요.', picture: proofPhoto(1) },
  { instruction: '링크 복사를 누르세요.', picture: proofPhoto(2) },
  { instruction: '아래에서 담당자 문자창을 열고\n게시글 링크만 붙여넣어 보내세요.', picture: proofPhoto(3), sms: true },
]
const chatSteps: Step[] = [
  { instruction: '나의 당근 → 진행중인 구인에서\n내가 올린 공고를 누르세요.', picture: screen('my-karrot-clean', [802, 1962], [0, 0, 802, 1962]) },
  { instruction: '공고 아래의\n지원자 보기를 누르세요.', picture: { ...screen('view-applicants', [1080, 2640], [0, 0, 1080, 2640]), highlight: [310, 2348, 737, 145] } },
  { instruction: '대화할 지원자를 누르세요.', picture: screen('applicants-clean', [802, 1961], [0, 0, 802, 1961]) },
  { instruction: '외국인 지원자는\n취업비자를 확인하세요.', picture: screen('visa', [821, 1915], [0, 0, 821, 1915]) },
  { instruction: '아래의 채팅하기를 누르세요.', picture: screen('profile-clean', [802, 1961], [0, 0, 802, 1961]) },
  { instruction: '아래에서 응대 문구를 복사해\n지원자 채팅창에 붙여넣으세요.', picture: chatPhoto(3) },
]
const chapters: { id: Chapter; label: string; steps: Step[] }[] = [
  { id: 'post', label: '글 올리기', steps: postingSteps },
  { id: 'proof', label: '링크 보내기', steps: proofSteps },
  { id: 'chat', label: '지원자 응대', steps: chatSteps },
]
const inviteSteps: Step[] = [
  { instruction: '미소 앱의 내 정보에서\n친구 추천을 누르세요.', picture: screen('invite-full', [1055, 1491], [1, 106, 524, 1276]) },
  { instruction: '아래로 내려 검은색\n내 초대 링크 복사하기를 누르세요.', picture: screen('invite-full', [1055, 1491], [530, 106, 524, 1159]) },
]
const faqs = [
  ['activity_limit', '소개 활동은 몇 번까지 할 수 있나요?', '친구 소개 활동은 횟수 제한 없이 참여하실 수 있어요.'],
  ['first_post_proof', '첫 글 인증은 어떻게 하나요?', '당근에 올린 게시글의 링크(URL)를 복사해 담당자에게 문자로 보내주세요. 게시글 링크만 보내주시면 됩니다. 확인 후 첫 글 보상 5,000원을 드려요.'],
  ['referral_reward', '소개비는 얼마인가요?', '소개한 분이 첫 청소를 완료하면 수도권은 3만원, 비수도권은 1만원의 소개비를 받으실 수 있어요.'],
  ['invite_link', '초대링크는 어떻게 활용하는 걸까요?', '내 초대링크는 당근 모임, 카페, 블로그, 맘카페, 카카오톡 오픈채팅 등 평소 활동하시는 다양한 채널에서 활용하실 수 있어요. 각 채널의 특성과 운영 규칙에 맞게 게시글이나 대화에 링크를 공유해보세요.'],
  ['foreign_applicant_visa', '외국인 지원자의 비자는 어떻게 확인하나요?', '당근에서 내 공고 → 지원자 보기로 들어가세요. 지원자 목록에 표시된 비자를 보거나, 지원자를 눌러 상세 화면의 취업비자를 확인하면 돼요.\n\n이번 모집은 F-2, F-4, F-5, F-6 비자 소지자만 지원할 수 있어요. 학생 비자(D 비자)는 지원 대상이 아니에요.\n\n비자가 표시되지 않거나 확인이 어려우면 담당자에게 문의해 주세요.'],
  ['incoming_contact', '지원자에게 연락이 오면 어떻게 해야 하나요?', '지원자 응대 탭 아래의 응대 문구 복사 버튼을 누르고, 지원자와의 대화방에 붙여넣어 보내주세요. 자주 쓰는 문구는 따로 저장해두거나 복사·붙여넣기로 편하게 활용하실 수 있어요.'],
  ['community_rules', '맘카페, 커뮤니티 채널에 올릴 때 주의할 점이 있나요?', '맘카페, 당근 모임, 카페, 카카오톡 오픈채팅 등은 채널마다 운영 규칙이 달라요. 구인·홍보 글과 외부 링크 공유가 가능한지 먼저 확인하고, 허용된 게시판과 채널 분위기에 맞게 올려주세요. 같은 글을 반복해서 올리는 것은 피해주세요.'],
]
function restorePosition(key: string, max: number) {
  try { const value = Number(sessionStorage.getItem(key)); return Number.isInteger(value) && value >= 0 && value < max ? value : 0 } catch { return 0 }
}
function savePosition(key: string, value: number) {
  try { sessionStorage.setItem(key, String(value)) } catch { /* Browser storage is optional. */ }
}
function PictureView({ picture, title }: { picture: Picture; title: string }) {
  const [x, y, width, height] = picture.screen
  const ratio = width / height
  const stageRatio = 9 / 22
  const fit: CSSProperties = ratio > stageRatio
    ? { width: '100%', height: `${stageRatio / ratio * 100}%` }
    : { width: `${ratio / stageRatio * 100}%`, height: '100%' }
  return <span className="senior-photo-fit"><span className="senior-phone" style={fit}>
    <img src={picture.src} alt={title} decoding="async" style={{ width: `${picture.size[0] / width * 100}%`, maxWidth: 'none', left: `${-x / width * 100}%`, top: `${-y / height * 100}%` }} />
    {picture.highlight && <span className="senior-highlight" aria-hidden="true" style={{ left: `${(picture.highlight[0] - x) / width * 100}%`, top: `${(picture.highlight[1] - y) / height * 100}%`, width: `${picture.highlight[2] / width * 100}%`, height: `${picture.highlight[3] / height * 100}%` }} />}
  </span></span>
}

export default function GuidePage() {
  const [tab, setTab] = useState<'daangn' | 'invite'>(() => { try { return sessionStorage.getItem('guide-tab') === 'invite' ? 'invite' : 'daangn' } catch { return 'daangn' } })
  const [chapterIndex, setChapterIndex] = useState(() => restorePosition('senior-chapter', chapters.length))
  const [positions, setPositions] = useState(() => chapters.map(c => restorePosition(`senior-${c.id}`, c.steps.length)))
  const [inviteIndex, setInviteIndex] = useState(() => restorePosition('senior-invite', inviteSteps.length))
  const [rotation, setRotation] = useState(() => { try { return restoreRotation(localStorage.getItem(ROTATION_KEY), templates.length) } catch { return makeRotation(templates.length) } })
  const [copied, setCopied] = useState<'title' | 'body' | 'reply' | null>(null)
  const [feedback, setFeedback] = useState('')
  const viewer = useRef<HTMLElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const templateSection = useRef<HTMLElement>(null)
  const replySection = useRef<HTMLElement>(null)
  const copySequence = useRef(0)
  const template = templates[rotation.order[rotation.cursor]]
  const chapter = chapters[chapterIndex]
  const steps = tab === 'invite' ? inviteSteps : chapter.steps
  const index = tab === 'invite' ? inviteIndex : positions[chapterIndex]
  const step = steps[index]
  const isLast = index === steps.length - 1

  useEffect(() => {
    const old = document.title
    document.title = '친구소개 가이드 | 미소'
    return () => { document.title = old }
  }, [])
  useEffect(() => { try { localStorage.setItem(ROTATION_KEY, JSON.stringify(rotation)) } catch { /* Optional persistence. */ } }, [rotation])
  useEffect(() => { try { sessionStorage.setItem('guide-tab', tab) } catch { /* Optional persistence. */ } }, [tab])
  useEffect(() => {
    trackEvent('guide_step_view', { section_id: tab === 'invite' ? 'invite' : chapter.id, step: index + 1 })
  }, [tab, chapter.id, index])
  useEffect(() => {
    if (!feedback) return
    const timer = window.setTimeout(() => setFeedback(''), 6000)
    return () => window.clearTimeout(timer)
  }, [feedback])

  const focusInstruction = () => requestAnimationFrame(() => {
    viewer.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
    heading.current?.focus({ preventScroll: true })
  })
  const selectChapter = (next: number) => {
    copySequence.current++; setChapterIndex(next); savePosition('senior-chapter', next); setFeedback(''); focusInstruction()
  }
  const move = (delta: number) => {
    setFeedback('')
    if (tab === 'invite') {
      const next = Math.max(0, Math.min(steps.length - 1, index + delta))
      setInviteIndex(next); savePosition('senior-invite', next)
    } else if (index + delta >= 0 && index + delta < steps.length) {
      const next = index + delta
      setPositions(current => current.map((value, i) => i === chapterIndex ? next : value)); savePosition(`senior-${chapter.id}`, next)
    }
    focusInstruction()
  }
  const selectTab = (next: 'daangn' | 'invite') => { copySequence.current++; setTab(next); setFeedback(''); trackEvent('guide_channel_view', { channel: next }) }
  const copy = async (type: 'title' | 'body' | 'reply') => {
    const sequence = ++copySequence.current
    try {
      await navigator.clipboard.writeText(type === 'reply' ? applicantReply : template[type])
      if (sequence !== copySequence.current) return
      setCopied(type); setFeedback(type === 'reply' ? '응대 문구를 복사했어요. 지원자 채팅창에 붙여넣으세요.' : `${type === 'title' ? '제목' : '본문'}을 복사했어요. 당근에 붙여넣으세요.`)
      if (type === 'reply') trackEvent('applicant_response_copy', { channel: 'daangn' })
      else trackEvent('template_copy', { channel: 'daangn', copy_scope: type, template_id: template.id })
    } catch {
      if (sequence === copySequence.current) {
        setCopied(null); setFeedback('글을 길게 눌러 직접 복사해 주세요.')
        const section = type === 'reply' ? replySection.current : templateSection.current
        section?.scrollIntoView({ block: 'start', behavior: 'instant' })
        section?.focus({ preventScroll: true })
      }
    }
  }
  const shuffle = () => {
    copySequence.current++; setRotation(nextRotation); setCopied(null); setFeedback('새 공고로 바꿨어요. 제목과 본문을 다시 복사하세요.')
    trackEvent('template_refresh', { channel: 'daangn' })
  }
  const showTemplates = () => {
    templateSection.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
    templateSection.current?.focus({ preventScroll: true })
  }
  const continueGuide = () => {
    if (tab === 'daangn' && chapterIndex < chapters.length - 1) {
      const nextChapter = chapterIndex + 1
      setPositions(current => current.map((value, i) => i === nextChapter ? 0 : value))
      savePosition(`senior-${chapters[nextChapter].id}`, 0)
      selectChapter(nextChapter)
    }
  }
  const continueLabel = chapterIndex === 0 ? '게시글 링크 보내는 방법 보기' : '지원자 응대 방법 보기'


  return <main className="page-shell senior-guide">
    <header className="senior-header"><h1>친구소개 가이드</h1></header>
    <nav className="senior-tabs" aria-label="가이드 선택">
      <button aria-pressed={tab === 'daangn'} onClick={() => selectTab('daangn')}>당근 글 올리기</button>
      <button aria-pressed={tab === 'invite'} onClick={() => selectTab('invite')}>초대링크 복사</button>
    </nav>
    {tab === 'daangn' && <nav className="senior-chapters" aria-label="필요한 안내 선택">{chapters.map((item, i) => <button key={item.id} aria-pressed={chapterIndex === i} onClick={() => selectChapter(i)}>{item.label}</button>)}</nav>}
    <section ref={viewer} className="senior-viewer" aria-label="사진 안내" id="post">
      <h2 ref={heading} tabIndex={-1} className="senior-instruction">{step.instruction}</h2>
      {step.copy && <div className="senior-copy-actions"><button className="senior-action" onClick={() => copy(step.copy!)}>{copied === step.copy ? `${step.copy === 'title' ? '제목' : '본문'} 복사 완료` : `${step.copy === 'title' ? '제목' : '본문'} 복사`}</button><button className="senior-text-button" onClick={showTemplates}>공고 문구 보기</button></div>}
      {step.sms && <a className="senior-action" href={sms} onClick={() => trackEvent('cta_click', { cta_location: 'post_proof', destination_type: 'sms' })}>담당자 문자창 열기</a>}
      <div className="senior-photo-card">
        <div className="senior-photo-meta"><span aria-live="polite">사진 {index + 1} / {steps.length}</span></div>
        <div className="senior-photo-image">
          <span className="senior-photo-stage" data-testid="guide-photo"><PictureView picture={step.picture} title={step.instruction.replace('\n', ' ')} /></span>
        </div>
        <nav className="senior-navigation" aria-label="사진 넘기기">
          <button className="senior-previous" disabled={index === 0} onClick={() => move(-1)}>이전 사진</button>
          <button className="senior-next" disabled={isLast} onClick={() => move(1)}>다음 사진</button>
        </nav>
      </div>
      {isLast && tab === 'daangn' && chapterIndex < chapters.length - 1 && <button className="senior-continue" onClick={continueGuide}>{continueLabel}</button>}
    </section>
    {tab === 'daangn' && chapter.id === 'post' && <section ref={templateSection} id="templates" className="senior-templates" aria-labelledby="templates-heading" tabIndex={-1}>
      <h2 id="templates-heading">당근 공고 템플릿</h2>
      <button className="senior-shuffle" onClick={shuffle}>다른 공고로 바꾸기</button>
      {(['title', 'body'] as const).map(type => <div className={`senior-template senior-template-${type}`} key={type}><p data-testid={`template-${type}`}>{template[type]}</p><button onClick={() => copy(type)}>{copied === type ? `${type === 'title' ? '제목' : '본문'} 복사 완료` : `${type === 'title' ? '제목' : '본문'} 복사`}</button></div>)}
      <p className="senior-template-feedback" role="status" aria-live="polite">{feedback}</p>
    </section>}
    {tab === 'daangn' && chapter.id === 'chat' && <section ref={replySection} id="applicant-reply" className="senior-templates" aria-labelledby="reply-heading" tabIndex={-1}>
      <h2 id="reply-heading">지원자에게 보낼 문구</h2>
      <div className="senior-template"><p data-testid="applicant-reply">{applicantReply}</p><button onClick={() => copy('reply')}>{copied === 'reply' ? '응대 문구 복사 완료' : '응대 문구 복사'}</button></div>
      <p className="senior-template-feedback" role="status" aria-live="polite">{feedback}</p>
    </section>}
    <section id="faq" className="senior-faq"><h2>자주 묻는 질문</h2>{faqs.map(([id, question, answer]) => <details key={id} onToggle={event => { if (event.currentTarget.open) trackEvent('faq_open', { faq_id: id }) }}><summary>{question}</summary><p>{answer}</p></details>)}</section>


  </main>
}
