import { useEffect, useRef, useState } from 'react'

const faqs = [
  {
    q: '진짜 친구 아니어도 되나요?',
    a: '네, 청소 알바에 관심 있다고 채팅으로 연락이 온 분이면 가능합니다!',
  },
  {
    q: '내가 직접 설명해야 하나요?',
    a: '아니요, 친구 소개만 해주시면 이후 상담은 미소에서 진행합니다!',
  },
  {
    q: '몇 명까지 가능해요?',
    a: '친구 추천은 무제한 가능합니다!',
  },
  {
    q: '당근 계정이 정지되지는 않을까요?',
    a: '동네인증 후 글을 작성하시면 안전해요! 아래의 가이드를 따라 10초만에 동네인증 가능해요.',
    video: '/location_guide.mp4',
  },
]

function LocationVideoFAQ({ a, video }: { a: string; video: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div className="flex items-start gap-2 mb-3">
        <span className="text-primary font-bold mt-0.5">→</span>
        <p className="text-gray-600 font-medium">{a}</p>
      </div>
      <div className="rounded-xl overflow-hidden shadow-sm relative bg-black">
        {!loaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <video
          ref={videoRef}
          src={video}
          className="w-full"
          playsInline
          muted
          preload="metadata"
          controls
          onCanPlay={() => setLoaded(true)}
        />
      </div>
    </>
  )
}

export default function FAQ() {
  return (
    <section className="bg-gray-50 px-6 py-10 pb-16">
      <h2 className="text-xl font-bold text-gray-900 mb-6">자주 묻는 질문</h2>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-2xl px-5 py-4 shadow-sm">
            <p className="text-gray-900 font-semibold mb-2">Q. {faq.q}</p>
            {'video' in faq ? (
              <LocationVideoFAQ a={faq.a} video={faq.video!} />
            ) : (
              <div className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">→</span>
                <p className="text-gray-600 font-medium">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10">
        <a
          href="https://get.miso.kr/ZIWsw4rez2b"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-primary text-white font-bold text-lg py-4 rounded-2xl shadow-md active:scale-95 transition-transform text-center"
        >
          바로 친구 추천하러 가기 →
        </a>
      </div>
    </section>
  )
}
