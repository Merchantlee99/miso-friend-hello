export default function EligibilitySection() {
  return (
    <section className="px-6 py-10 bg-blue-50">
      <h2 className="text-xl font-bold text-gray-900 mb-2">👥 누구를 친구로 소개할 수 있나요?</h2>
      <p className="text-sm text-gray-500 mb-6">아래 조건에 맞는 분이면 누구든지 소개 가능해요!</p>

      <div className="space-y-3">
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">
          <span className="text-3xl">👩</span>
          <div>
            <p className="text-gray-900 font-bold">30세 ~ 70세 여성</p>
            <p className="text-gray-500 text-sm mt-0.5">나이 상관없이 해당 연령대면 가능해요</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">
          <span className="text-3xl">🌏</span>
          <div>
            <p className="text-gray-900 font-bold">외국인도 가능</p>
            <p className="text-gray-500 text-sm mt-0.5">국적 상관없이 지원 가능합니다</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">
          <span className="text-3xl">💬</span>
          <div>
            <p className="text-gray-900 font-bold">진짜 친구가 아니어도 OK</p>
            <p className="text-gray-500 text-sm mt-0.5">인터넷 커뮤니티에서 채팅 온 분을 친구로 소개해요.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
