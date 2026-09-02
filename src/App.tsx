import { useEffect, useState } from 'react'
import TopBanner from './components/TopBanner'
import CopyTemplate from './components/CopyTemplate'
import { trackEvent } from './analytics'

const typeformUrl = 'https://reviewevent.typeform.com/to/RcJAvPzi'
const consultationTypeformUrl = 'https://reviewevent.typeform.com/to/rwnHYVFK'
type TemplateChannel = 'daangn' | 'blog' | 'momcafe'

const postingFlows: Record<TemplateChannel, { title: string; description?: string }[]> = {
  daangn: [
    { title: '게시글 올리기', description: '당근 알바 글쓰기에 복사한 글로 게시해요.' },
    { title: '성함과 연락처 받기', description: '채팅으로 지원한 분에게 안내 문구를 보내고 정보를 받아요.' },
    { title: '미소앱 친구 소개에 등록하기' },
    { title: '첫 청소 뒤 소개비 받기', description: '소개한 분이 첫 청소를 완료하면 소개비가 지급돼요.' },
  ],
  blog: [
    { title: '미소앱에서 내 초대 링크 복사하기' },
    { title: '복사한 글에 초대 링크 넣고 등록하기' },
    { title: '초대 링크로 유입된 분 확인하기' },
    { title: '첫 청소 뒤 소개비 받기', description: '링크로 유입된 분이 첫 청소를 완료하면 소개비가 지급돼요.' },
  ],
  momcafe: [
    { title: '카페 규칙을 확인하고 글 올리기', description: '카페마다 허용하는 게시판과 활동규칙을 먼저 확인해요.' },
    { title: '카페 채팅으로 성함과 연락처 받기', description: '당근과 같은 안내 문구를 보내고 정보를 받아요.' },
    { title: '미소앱 친구 소개에 등록하기' },
    { title: '첫 청소 뒤 소개비 받기', description: '소개한 분이 첫 청소를 완료하면 소개비가 지급돼요.' },
  ],
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function VideoCard({ title, src, videoId }: { title: string; src: string; videoId: string }) {
  return (
    <section className="px-5 py-14 sm:px-7">
      <div className="mb-5">
        <h2 className="section-title">{title}</h2>
      </div>
      <div className="overflow-hidden rounded-[24px] bg-slate-950 shadow-[0_16px_40px_rgba(15,52,120,0.18)]">
        <video src={src} className="block w-full" controls playsInline preload="metadata" onEnded={() => trackEvent('guide_video_complete', { video_id: videoId })} />
      </div>
    </section>
  )
}

export default function App() {
  const [postingFlow, setPostingFlow] = useState<TemplateChannel>('daangn')

  useEffect(() => {
    const selectGuideChannel = (event: Event) => {
      const channel = (event as CustomEvent<TemplateChannel>).detail
      if (channel === 'daangn' || channel === 'blog' || channel === 'momcafe') setPostingFlow(channel)
    }
    window.addEventListener('miso:select-guide-channel', selectGuideChannel)
    return () => window.removeEventListener('miso:select-guide-channel', selectGuideChannel)
  }, [])

  useEffect(() => {
    const passedThresholds = new Set<number>()
    const thresholds = [25, 50, 75, 90]

    const trackScrollDepth = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollableHeight <= 0) return
      const progress = (window.scrollY / scrollableHeight) * 100

      thresholds.forEach((threshold) => {
        if (progress >= threshold && !passedThresholds.has(threshold)) {
          passedThresholds.add(threshold)
          trackEvent('scroll_depth', { percent_scrolled: threshold })
        }
      })
    }

    window.addEventListener('scroll', trackScrollDepth, { passive: true })
    trackScrollDepth()
    return () => window.removeEventListener('scroll', trackScrollDepth)
  }, [])

  const selectPostingFlow = (channel: TemplateChannel) => {
    setPostingFlow(channel)
    trackEvent('channel_select', { channel, selection_area: 'guide' })
    window.dispatchEvent(new CustomEvent<TemplateChannel>('miso:select-template-channel', { detail: channel }))
  }

  return (
    <>
      <TopBanner />
      <main className="page-shell">
        <section className="hero-section px-5 pb-14 pt-12 sm:px-7">
          <h1 className="text-[34px] font-extrabold leading-[1.18] tracking-[-0.045em] text-slate-950">
            소개할 친구가 없던<br />김*아 파트너님,
            <br />
            <span className="text-primary">글로 258명을 소개해<br />516만원을 받았어요.</span>
          </h1>
          <p className="mt-5 max-w-[31ch] break-keep text-[16px] leading-7 text-slate-600">
            준비된 글을 채널에 올리고, 연락 온 분을<br />친구 소개로 등록해 활동을 넓혔어요.
          </p>
          <img src="/payout-hero-miso-v1.png" alt="앞치마를 입은 미소 파트너가 휴대폰으로 정산 완료를 확인하는 모습" className="mt-3 block w-full" />
          <a href={consultationTypeformUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('cta_click', { cta_location: 'hero', cta_type: 'consultation', destination_type: 'typeform' })} className="primary-button mt-7 flex items-center justify-center">상담받고 소개 활동 시작하기</a>
          <button onClick={() => { trackEvent('cta_click', { cta_location: 'hero', cta_type: 'scroll_to_template', destination_type: 'internal' }); scrollTo('copy-template') }} className="mt-3 flex w-full items-center justify-center rounded-2xl border border-blue-200 bg-white py-4 text-sm font-extrabold text-primary transition-colors active:bg-blue-50">글 양식 먼저 보기</button>
          <a href={typeformUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('cta_click', { cta_location: 'hero', cta_type: 'first_post_certification', destination_type: 'typeform' })} className="mt-3 flex w-full items-center justify-center rounded-2xl border border-blue-200 bg-white py-4 text-sm font-extrabold text-primary transition-colors active:bg-blue-50">첫 글 인증하고 5,000원 받기</a>
        </section>

        <section className="bg-blue-50 px-5 py-14 sm:px-7">
          <h2 className="section-title">글 인증과 친구 소개로<br />보상이 이어져요.</h2>
          <div className="mt-6 divide-y divide-blue-100 rounded-[22px] bg-white px-5 shadow-sm">
            <div className="py-5"><p className="text-sm font-bold text-primary">내 활동 보상</p><p className="mt-1 text-lg font-bold tracking-[-0.03em] text-slate-900">첫 글 인증 5,000원</p></div>
            <div className="py-5"><p className="text-sm font-bold text-primary">유효 소개 보상</p><p className="mt-1 text-lg font-bold tracking-[-0.03em] text-slate-900">첫 청소 시 수도권 2만원 · 비수도권 1만원</p></div>
            <div className="py-5"><p className="text-sm font-bold text-primary">소개받는 친구의 기회</p><p className="mt-1 text-lg font-bold tracking-[-0.03em] text-slate-900">시급 13,000원 ~ 21,700원</p></div>
          </div>
        </section>

        <CopyTemplate />

        {postingFlow === 'daangn' && <VideoCard title="당근에 글을 올리는 방법" src="/write_guide.mp4" videoId="daangn_posting" />}
        {postingFlow === 'blog' && <>
          <VideoCard title="미소 앱에서 내 초대 링크 복사하기" src="/miso-invite-link-guide.mp4" videoId="blog_invite_link" />
          <VideoCard title="블로그에 글 올리기" src="/blog-post-guide.mp4" videoId="blog_posting" />
        </>}
        {postingFlow === 'momcafe' && <VideoCard title="맘카페에 글 올리기" src="/momcafe-post-guide.mp4" videoId="momcafe_posting" />}

        <section className="bg-blue-50 px-5 py-14 sm:px-7">
          <h2 className="section-title">글을 올린 뒤, 채널별로<br />이렇게 진행해요.</h2>
          <div className="mt-6 grid grid-cols-3 rounded-2xl bg-white p-1 shadow-sm">
            {([['daangn', '당근'], ['blog', '블로그'], ['momcafe', '맘카페']] as [TemplateChannel, string][]).map(([channel, label]) => (
              <button key={channel} onClick={() => selectPostingFlow(channel)} aria-pressed={postingFlow === channel} className={'rounded-xl px-2 py-3 text-sm font-bold transition-colors ' + (postingFlow === channel ? 'bg-primary text-white' : 'text-slate-500')}>{label}</button>
            ))}
          </div>
          <div className="mt-7 space-y-5">
            {postingFlows[postingFlow].map(({ title, description }, index) => (
              <div key={title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{index + 1}</span>
                <div className="pt-0.5"><p className="font-bold text-slate-900">{title}</p>{description && <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>}</div>
              </div>
            ))}
          </div>
        </section>

        {postingFlow === 'daangn' && <VideoCard title="당근에서 채팅이 오면 이렇게" src="/0423_guide.mp4" videoId="daangn_chat" />}

        <section className="bg-white px-5 py-14 sm:px-7">
          <div className="rounded-[28px] bg-[#DAE8F9] px-6 py-8 text-slate-950">
            <h2 className="text-2xl font-extrabold leading-tight tracking-[-0.04em]">게시글 전체를 캡처해 보내면<br /><span className="text-primary">첫 글 보상 5,000원</span></h2>
            <p className="mt-4 break-keep text-[15px] font-semibold leading-6 text-slate-600">제목과 본문이 함께 보이게<br />캡처해 제출해 주세요.</p>
            <img src="/post-proof-full-screen-v1.png" alt="게시글 전체 화면을 캡처해 인증하고 확인받는 과정" className="mx-auto mt-5 block w-full max-w-[290px]" />
            <a href={typeformUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('cta_click', { cta_location: 'post_proof', cta_type: 'first_post_certification', destination_type: 'typeform' })} className="mt-5 flex w-full items-center justify-center rounded-2xl bg-primary py-4 text-sm font-extrabold text-white transition-transform active:scale-[0.98]">게시글 캡처 보내고 인증하기</a>
          </div>
        </section>

        <section className="bg-slate-50 px-5 pb-32 pt-12 sm:px-7">
          <h2 className="section-title">자주 묻는 질문</h2>
          <div className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
            <details className="py-5" onToggle={(event) => { if (event.currentTarget.open) trackEvent('faq_open', { faq_id: 'activity_limit' }) }}><summary className="faq-summary">소개 활동은 몇 번까지 할 수 있나요?</summary><p className="mt-3 text-sm leading-6 text-slate-600">친구 소개 활동 횟수는 제한 없이 이어갈 수 있습니다.</p></details>
            <details className="py-5" onToggle={(event) => { if (event.currentTarget.open) trackEvent('faq_open', { faq_id: 'first_post_proof' }) }}><summary className="faq-summary">첫 글 인증은 무엇을 제출하나요?</summary><p className="mt-3 text-sm leading-6 text-slate-600">처음 올린 게시글이 보이도록 화면을 캡처해 제출해 주세요. 작성한 글 화면이 확인되면 첫 글 인증이 완료됩니다.</p></details>
            <details className="py-5" onToggle={(event) => { if (event.currentTarget.open) trackEvent('faq_open', { faq_id: 'referral_reward' }) }}><summary className="faq-summary">소개비는 얼마인가요?</summary><p className="mt-3 text-sm leading-6 text-slate-600">소개한 분이 미소에서 유효 첫 청소를 완료하면 수도권은 2만원, 비수도권은 1만원을 받아요.</p></details>
            <details className="py-5" onToggle={(event) => { if (event.currentTarget.open) trackEvent('faq_open', { faq_id: 'blog_invite_link' }) }}><summary className="faq-summary">블로그 글에는 내 초대 링크를 꼭 넣어야 하나요?</summary><p className="mt-3 text-sm leading-6 text-slate-600">네. 블로그에서 들어온 분을 확인할 수 있도록 미소 앱에서 복사한 내 초대 링크를 글에 넣어주세요.</p></details>
            <details className="py-5" onToggle={(event) => { if (event.currentTarget.open) trackEvent('faq_open', { faq_id: 'incoming_contact' }) }}><summary className="faq-summary">당근이나 맘카페에서 연락이 오면 어떻게 하나요?</summary><p className="mt-3 text-sm leading-6 text-slate-600">안내 문구를 보내 성함과 연락처를 받은 뒤, 미소 앱의 친구 소개에 등록해 주세요.</p></details>
            <details className="py-5" onToggle={(event) => { if (event.currentTarget.open) trackEvent('faq_open', { faq_id: 'momcafe_rules' }) }}><summary className="faq-summary">맘카페에 올릴 때 주의할 점이 있나요?</summary><p className="mt-3 text-sm leading-6 text-slate-600">카페마다 활동 규칙과 허용 게시판이 다르니, 글을 올리기 전에 먼저 확인해 주세요.</p></details>
          </div>
        </section>
      </main>
    </>
  )
}
