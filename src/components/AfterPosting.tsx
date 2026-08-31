import { useState } from 'react'

const steps = [
  { number: 1, text: '인터넷 커뮤니티에 작성한 글 캡쳐' },
  { number: 2, text: '"글 작성 인증하기" 버튼 눌러서 캡쳐본 업로드' },
]

const exampleImages = [
  { src: '/example.jpg', alt: '글 캡쳐 예시' },
]

export default function AfterPosting() {
  const [showExample, setShowExample] = useState(false)
  const [modalSrc, setModalSrc] = useState<string | null>(null)

  return (
    <section className="bg-blue-50 px-6 py-10">
      {modalSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
          onClick={() => setModalSrc(null)}
        >
          <div className="relative w-full max-w-[390px]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setModalSrc(null)}
              className="absolute -top-10 right-0 text-white text-2xl leading-none"
            >
              ✕
            </button>
            <img src={modalSrc} alt="캡쳐 예시" className="w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-900 mb-3">📸 5,000원 추가 혜택 받는 법</h2>
      <p className="text-sm text-gray-500 mb-3">글을 올린 후 캡쳐본을 보내주시면 5천원을 추가로 드려요!</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {['🥕 당근마켓', '📝 블로그', '🎵 틱톡', '📸 인스타그램', '👩‍👧 맘카페'].map((platform) => (
          <span key={platform} className="bg-white border border-primary/30 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
            {platform}
          </span>
        ))}
      </div>

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

      <div className="mb-6">
        <button
          onClick={() => setShowExample((v) => !v)}
          className="flex items-center gap-2 text-sm font-semibold text-primary mb-3"
        >
          <span>{showExample ? '▲' : '▼'}</span>
          캡쳐 예시 이미지 {showExample ? '닫기' : '보기'}
        </button>
        {showExample && (
          <div className="flex flex-wrap gap-2">
            {exampleImages.map((img) => (
              <button
                key={img.src}
                onClick={() => setModalSrc(img.src)}
                className="w-28 h-28 rounded-xl overflow-hidden border border-gray-200 shadow-sm active:scale-95 transition-transform"
              >
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-primary/10 rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
        <span className="text-primary font-bold text-base mt-0.5">→</span>
        <p className="text-primary font-medium text-sm">담당자가 확인 후 5천원 지급해드려요!</p>
      </div>

      <a
        href="https://reviewevent.typeform.com/to/RcJAvPzi"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-primary text-white font-bold text-lg py-4 rounded-2xl shadow-md active:scale-95 transition-transform text-center"
      >
        글 작성 인증하기 📷
      </a>
    </section>
  )
}
