import { useRef, useState } from 'react'

function LinkGuideModal({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleClose = () => {
    videoRef.current?.pause()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-[390px] bg-black rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
          <p className="text-white font-bold text-sm">🔗 내 전용 링크 발급 방법</p>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white text-xl leading-none"
          >
            ✕
          </button>
        </div>
        <video
          ref={videoRef}
          src="/link_guide.mp4"
          className="w-full"
          playsInline
          muted
          autoPlay
          controls
          preload="auto"
        />
      </div>
    </div>
  )
}

export default function HeroSection() {
  const [showLinkGuide, setShowLinkGuide] = useState(false)

  return (
    <section className="bg-primary px-6 pt-12 pb-10 text-white">
      {showLinkGuide && <LinkGuideModal onClose={() => setShowLinkGuide(false)} />}

      <div className="mb-6">
        <h1 className="text-3xl font-bold leading-tight mb-3">
          친구 소개로<br />수익 올리세요! 💰
        </h1>
        <p className="text-lg font-medium text-blue-100">
          인터넷 커뮤니티에 글 하나 올리고<br />최대 수십만원 벌어보세요.
        </p>
        <p className="text-sm text-blue-200 mt-1">예: <span className="font-bold text-white">당근마켓</span>, 네이버 블로그, 맘카페 등</p>
      </div>

      <div className="bg-white/15 rounded-2xl p-5 mb-8 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-xl">✅</span>
          <p className="text-white font-semibold">오늘 글 하나 올리면 5천원</p>
        </div>
        {/* <div className="flex items-center gap-3">
          <span className="text-xl">✅</span>
          <p className="text-white font-semibold">친구 1명당 상담만 받아도 1만원</p>
        </div> */}
        <div className="flex items-center gap-3">
          <span className="text-xl">✅</span>
          <p className="text-white font-semibold">친구 1명당 첫 청소하면 2만원 (수도권 지역)</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xl">✅</span>
          <p className="text-white font-semibold">많이 소개할수록 보너스 더 드려요!</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-blue-100 leading-snug">
            김*아 파트너님은 벌써 100명,<br />이*영 파트너님은 67명 소개했어요
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="bg-yellow-400/20 border border-yellow-300/40 rounded-2xl px-4 py-3.5">
          <p className="text-white font-bold text-sm mb-1">🥕 당근마켓에서 글 올리면</p>
          <p className="text-white font-medium text-sm leading-relaxed">
            평균 <span className="font-bold text-orange-400">10명 넘게</span> 지원해요.<br />
            채팅으로 성함·연락처 받아서 친구로 등록!
          </p>
        </div>
        <div className="bg-blue-400/20 border border-blue-300/40 rounded-2xl px-4 py-3.5">
          <p className="text-white font-bold text-sm mb-1">📝 블로그·틱톡·인스타·맘카페에서도 OK!</p>
          <p className="text-white font-medium text-sm leading-relaxed mb-2.5">
            내 <span className="font-bold text-blue-200">전용 링크</span>를 글에 넣으면<br />
            링크 클릭한 사람이 <span className="font-bold text-blue-200">자동으로 내 친구</span>가 돼요!
          </p>
          <button
            onClick={() => setShowLinkGuide(true)}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 active:scale-95 transition-all text-white font-semibold text-xs px-3 py-2 rounded-xl"
          >
            <span>🎬</span>
            내 전용 링크 발급 방법
          </button>
        </div>
      </div>

      {/* <a
        href="https://get.miso.kr/ZIWsw4rez2b"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-white text-primary font-bold text-lg py-4 rounded-2xl shadow-md active:scale-95 transition-transform text-center"
      >
        바로 친구 추천하러 가기 →
      </a> */}
      <button
        onClick={() => document.getElementById('copy-template')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
        className="block w-full bg-white text-primary font-bold text-lg py-4 rounded-2xl shadow-md active:scale-95 transition-transform text-center"
      >
        어떻게 글쓰면 되나요? ✍️
      </button>
      <a
        href="https://reviewevent.typeform.com/to/RcJAvPzi"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-white/20 text-white font-semibold text-base py-4 rounded-2xl mt-3 active:scale-95 transition-transform text-center"
      >
        바로 내가 쓴 글 인증하러 가기 →
      </a>
    </section>
  )
}
