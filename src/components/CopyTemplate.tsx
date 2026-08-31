import { useState } from 'react'
import { postTemplates as daangnTemplates } from '../template_daangn'
import { postTemplates as blogTemplates } from '../template_blog'

function randomIndex(length: number, current: number) {
  if (length <= 1) return 0
  let next = current
  while (next === current) next = Math.floor(Math.random() * length)
  return next
}

export default function CopyTemplate() {
  const [tab, setTab] = useState<'daangn' | 'blog'>('daangn')
  const [daangnIdx, setDaangnIdx] = useState(() => Math.floor(Math.random() * daangnTemplates.length))
  const [blogIdx, setBlogIdx] = useState(() => Math.floor(Math.random() * blogTemplates.length))
  const [titleCopied, setTitleCopied] = useState(false)
  const [bodyCopied, setBodyCopied] = useState(false)

  const template = tab === 'daangn' ? daangnTemplates[daangnIdx] : blogTemplates[blogIdx]

  const shuffle = () => {
    if (tab === 'daangn') setDaangnIdx((i) => randomIndex(daangnTemplates.length, i))
    else setBlogIdx((i) => randomIndex(blogTemplates.length, i))
    setTitleCopied(false)
    setBodyCopied(false)
  }

  const copy = async (text: string, type: 'title' | 'body') => {
    await navigator.clipboard.writeText(text)
    if (type === 'title') {
      setTitleCopied(true)
      setTimeout(() => setTitleCopied(false), 2000)
    } else {
      setBodyCopied(true)
      setTimeout(() => setBodyCopied(false), 2000)
    }
  }

  return (
    <section id="copy-template" className="px-6 py-10">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-bold text-white">✍️ 이런 식으로 글쓰면 돼요</h2>
        <button
          onClick={shuffle}
          className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <span className="text-white text-[10px] font-semibold">양식 바꾸기</span>
        </button>
      </div>
      <p className="text-sm text-blue-200 mb-4">복사해서 그대로 사용하세요!</p>

      <div className="flex bg-white/20 rounded-xl p-1 mb-5">
        <button
          onClick={() => setTab('daangn')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
            tab === 'daangn' ? 'bg-white text-primary' : 'text-white'
          }`}
        >
          🥕 당근마켓
        </button>
        <button
          onClick={() => setTab('blog')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
            tab === 'blog' ? 'bg-white text-primary' : 'text-white'
          }`}
        >
          📝 블로그·SNS
        </button>
      </div>

      {tab === 'blog' && (
        <div className="bg-blue-900/40 border border-blue-300/30 rounded-2xl px-4 py-3 mb-4">
          <p className="text-white text-sm leading-relaxed">
            💡 본문의 <span className="font-bold text-yellow-300">[여기에 추천 링크 넣기]</span> 부분에 내 전용 링크를 꼭 넣어주세요!
          </p>
        </div>
      )}

      <div className="space-y-3">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">제목</p>
            <button
              onClick={() => copy(template.title, 'title')}
              className={`px-3 py-1 rounded-lg font-semibold text-xs transition-colors ${
                titleCopied ? 'bg-green-500 text-white' : 'bg-primary/10 text-primary'
              }`}
            >
              {titleCopied ? '✓ 복사됨' : '복사하기'}
            </button>
          </div>
          <div className="px-4 py-3">
            <p className="text-gray-800 font-medium text-sm">{template.title}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">본문</p>
            <button
              onClick={() => copy(template.body, 'body')}
              className={`px-3 py-1 rounded-lg font-semibold text-xs transition-colors ${
                bodyCopied ? 'bg-green-500 text-white' : 'bg-primary/10 text-primary'
              }`}
            >
              {bodyCopied ? '✓ 복사됨' : '복사하기'}
            </button>
          </div>
          <div className="px-4 py-3">
            <p className="text-gray-800 font-medium text-sm leading-relaxed whitespace-pre-line">{template.body}</p>
          </div>
        </div>
      </div>

      <a
        href="https://reviewevent.typeform.com/to/RcJAvPzi"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-white/20 text-white font-semibold text-base py-4 rounded-2xl mt-5 active:scale-95 transition-transform text-center"
      >
        바로 내가 쓴 글 인증하러 가기 →
      </a>
    </section>
  )
}
