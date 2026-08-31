export default function EventSection() {
  return (
    <section className="px-6 py-10">
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
        <div className="bg-yellow-400 px-6 py-3 flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <p className="font-extrabold text-gray-900 text-sm tracking-wide">이번 주 한정 이벤트</p>
        </div>

        <div className="px-6 py-6">
          <p className="text-gray-500 text-xs font-medium mb-4">지금 활동하면 추가 혜택을 드려요!</p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-yellow-50 rounded-2xl px-4 py-3.5">
              <span className="text-xl mt-0.5">🎁</span>
              <div>
                <p className="text-gray-900 font-bold text-sm">오늘 글 작성하면 +5,000원</p>
                <p className="text-gray-500 text-xs mt-0.5">캡쳐본 제출 시 별도 지급돼요</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-blue-50 rounded-2xl px-4 py-3.5">
              <span className="text-xl mt-0.5">💸</span>
              <div>
                <p className="text-gray-900 font-bold text-sm">친구 많이 소개할수록 추가 보너스</p>
                <p className="text-gray-500 text-xs mt-0.5">소개 수가 늘어날수록 더 드려요</p>
              </div>
            </div>
          </div>

          {/* <div className="bg-gray-900 rounded-2xl px-4 py-3.5 flex items-center gap-3">
            <span className="text-2xl">⏰</span>
            <p className="text-white font-bold text-sm">오늘만 5,000원 추가 혜택!</p>
          </div> */}
        </div>
      </div>
    </section>
  )
}
