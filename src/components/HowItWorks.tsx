import { useState } from 'react'

type Step = { number: number; text: string; emoji: string; sub?: string }

const daangnSteps: Step[] = [
  { number: 1, text: '당근마켓에 청소 알바 홍보 글 작성', emoji: '✍️' },
  { number: 2, text: '관심 있는 사람이 채팅', emoji: '💬' },
  { number: 3, text: '성함과 연락처 물어보기', emoji: '📝' },
  { number: 4, text: '미소 앱에 친구로 등록하기', emoji: '👥' },
  { number: 5, text: '친구 소개비 지급!', emoji: '💸' },
]

const blogSteps: Step[] = [
  { number: 1, text: '미소 앱에서 내 전용 추천 링크 복사', emoji: '🔗', sub: '미소 앱 > 친구추천 > 링크 복사' },
  { number: 2, text: '블로그 / 틱톡 / 인스타 / 맘카페에 글 작성', emoji: '✍️', sub: '글 안에 내 전용 링크 삽입' },
  { number: 3, text: '관심 있는 사람이 링크 클릭', emoji: '👆' },
  { number: 4, text: '미소로 들어오면 자동으로 내 친구가 돼요!', emoji: '✅' },
  { number: 5, text: '친구 소개비 지급!', emoji: '💸' },
]

export default function HowItWorks() {
  const [tab, setTab] = useState<'daangn' | 'blog'>('daangn')

  const steps = tab === 'daangn' ? daangnSteps : blogSteps

  return (
    <section className="px-6 py-10">
      <h2 className="text-xl font-bold text-white mb-6">
        이렇게 하면 됩니다 👇
      </h2>

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
          <p className="text-white text-sm font-medium leading-relaxed">
            💡 내 <span className="font-bold text-yellow-300">전용 링크</span>를 글에 넣으면, 링크로 들어온 사람이 <span className="font-bold text-yellow-300">자동으로 내 친구</span>가 돼요!
          </p>
        </div>
      )}

      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.number} className="flex items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-base">
              {step.number}
            </div>
            <div className="flex-1 bg-blue-50 rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="text-2xl">{step.emoji}</span>
              <div>
                <p className="text-gray-800 font-medium">{step.text}</p>
                {'sub' in step && step.sub && (
                  <p className="text-gray-400 text-xs mt-0.5">{step.sub}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
