import { useEffect, useRef } from 'react'

const steps = [
  { number: 1, text: '지원자에게서 채팅이 와요' },
  { number: 2, text: '성함과 연락처를 여쭈어봐요' },
  { number: 3, text: '미소에 친구로 등록해요' },
  { number: 4, text: '미소에서 상담을 진행한 후 소개비 지급!' },
]

export default function ApplicantGuide() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="px-6 py-10 bg-gray-50">
      <h2 className="text-xl font-bold text-gray-900 mb-2">💬 지원자가 오면 이렇게 하세요</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 mb-5 flex items-start gap-2">
        <span className="text-base mt-0.5">✅</span>
        <div>
          <p className="text-blue-800 font-bold text-sm">블로그·SNS 링크로 온 경우</p>
          <p className="text-blue-600 text-sm mt-0.5">링크를 클릭해서 미소에 가입한 사람은 <span className="font-bold">자동으로 내 친구로 등록</span>돼요! 별도 조치 필요 없어요.</p>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">🥕 당근마켓에서 채팅이 온 경우에는 아래 방법으로 등록해주세요.</p>

      <div className="space-y-3 mb-6">
        {steps.map((step) => (
          <div key={step.number} className="flex items-center gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
              {step.number}
            </div>
            <p className="text-gray-800 font-medium">{step.text}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden bg-black shadow-md">
        <video
          ref={videoRef}
          src="/0423_guide.mp4"
          className="w-full"
          playsInline
          muted
          preload="metadata"
          controls
        />
      </div>
    </section>
  )
}
