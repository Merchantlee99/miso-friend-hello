export default function TopBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="w-full max-w-[430px] px-4 pt-3 pointer-events-auto">
        <a
          href="https://reviewevent.typeform.com/to/RcJAvPzi"
          target="_blank"
          rel="noopener noreferrer"
          className="banner-animate block text-gray-900 text-center py-3 px-4 rounded-2xl font-bold text-sm leading-snug shadow-lg active:scale-95 transition-transform"
        >
          🎁 오늘 글 올리면 5,000원 추가로 드려요!<br />
          <span className="font-normal text-xs">자유롭게 인증하고 5천원 받아가세요.</span>
        </a>
      </div>
    </div>
  )
}
