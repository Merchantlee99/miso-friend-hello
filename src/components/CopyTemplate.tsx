import { useEffect, useState } from 'react'
import { postTemplates as daangnTemplates } from '../template_daangn'
import { postTemplates as blogTemplates } from '../template_blog'
import { postTemplates as momcafeTemplates } from '../template_momcafe'
import { trackEvent } from '../analytics'

type Channel = 'daangn' | 'blog' | 'momcafe'

function randomIndex(length: number, current: number) {
  if (length <= 1) return 0
  let next = current
  while (next === current) next = Math.floor(Math.random() * length)
  return next
}

export default function CopyTemplate() {
  const [tab, setTab] = useState<Channel>('daangn')
  const [daangnIdx, setDaangnIdx] = useState(0)
  const [blogIdx, setBlogIdx] = useState(0)
  const [momcafeIdx, setMomcafeIdx] = useState(0)
  const [copied, setCopied] = useState<'title' | 'body' | 'all' | null>(null)
  const template = tab === 'daangn' ? daangnTemplates[daangnIdx] : tab === 'blog' ? blogTemplates[blogIdx] : momcafeTemplates[momcafeIdx]

  useEffect(() => {
    const selectChannel = (event: Event) => {
      const channel = (event as CustomEvent<Channel>).detail
      if (channel === 'daangn' || channel === 'blog' || channel === 'momcafe') {
        setTab(channel)
        setCopied(null)
      }
    }
    window.addEventListener('miso:select-template-channel', selectChannel)
    return () => window.removeEventListener('miso:select-template-channel', selectChannel)
  }, [])

  const shuffle = () => {
    if (tab === 'daangn') setDaangnIdx((index) => randomIndex(daangnTemplates.length, index))
    if (tab === 'blog') setBlogIdx((index) => randomIndex(blogTemplates.length, index))
    if (tab === 'momcafe') setMomcafeIdx((index) => randomIndex(momcafeTemplates.length, index))
    setCopied(null)
  }

  const selectTab = (channel: Channel) => {
    setTab(channel)
    setCopied(null)
    trackEvent('channel_select', { channel, selection_area: 'template' })
    window.dispatchEvent(new CustomEvent<Channel>('miso:select-guide-channel', { detail: channel }))
  }

  const copy = async (text: string, type: 'title' | 'body' | 'all') => {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    trackEvent('template_copy', { channel: tab, copy_scope: type })
    window.setTimeout(() => setCopied(null), 1800)
  }

  return (
    <section id="copy-template" className="bg-[#0C5BE8] px-5 py-14 text-white sm:px-7">
      <div className="flex items-start justify-between gap-4">
        <div><h2 className="text-[25px] font-extrabold leading-tight tracking-[-0.04em]">채널에 맞는 글을<br />바로 복사하세요.</h2><p className="mt-3 break-keep text-sm leading-6 text-blue-100">마음에 드는 문안으로 바꿔 사용할 수 있어요.</p></div>
        <button onClick={shuffle} className="shrink-0 rounded-xl border border-white/25 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-white/10">다른 양식</button>
      </div>
      <div className="mt-7 grid grid-cols-3 rounded-2xl bg-white/15 p-1">
        {([['daangn', '당근'], ['blog', '블로그'], ['momcafe', '맘카페']] as [Channel, string][]).map(([value, label]) => (
          <button key={value} onClick={() => selectTab(value)} className={'rounded-xl px-2 py-3 text-sm font-bold transition-colors ' + (tab === value ? 'bg-white text-primary' : 'text-blue-100')}>{label}</button>
        ))}
      </div>
      {tab === 'blog' && <p className="mt-4 rounded-xl bg-white/10 px-4 py-3 text-xs leading-5 text-blue-50">본문의 추천 링크 자리에는 내 전용 링크를 넣어주세요.</p>}
      {tab === 'momcafe' && <p className="mt-4 rounded-xl bg-white/10 px-4 py-3 text-xs leading-5 text-blue-50">정보 공유 톤으로 작성하고, 본문 마지막의 활동 안내 문구를 유지해 주세요.</p>}
      <div className="mt-4 overflow-hidden rounded-[22px] bg-white text-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3"><p className="text-xs font-bold text-slate-400">제목</p><button onClick={() => copy(template.title, 'title')} className="text-xs font-extrabold text-primary">{copied === 'title' ? '복사됨' : '제목 복사'}</button></div>
        <p className="px-5 py-4 text-[15px] font-bold leading-6">{template.title}</p>
      </div>
      <div className="mt-3 overflow-hidden rounded-[22px] bg-white text-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3"><p className="text-xs font-bold text-slate-400">본문</p><button onClick={() => copy(template.body, 'body')} className="text-xs font-extrabold text-primary">{copied === 'body' ? '복사됨' : '본문 복사'}</button></div>
        <p className="whitespace-pre-line px-5 py-4 text-sm leading-6 text-slate-700">{template.body}</p>
      </div>
      <button onClick={() => copy(template.title + '\n\n' + template.body, 'all')} className="mt-4 w-full rounded-2xl bg-white py-4 text-sm font-extrabold text-primary transition-transform active:scale-[0.98]">{copied === 'all' ? '제목과 본문을 복사했어요' : '제목과 본문 한 번에 복사'}</button>
    </section>
  )
}
