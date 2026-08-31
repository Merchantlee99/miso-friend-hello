export default function SocialProof() {
  return (
    <section className="bg-gray-50 px-6 py-10">
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        김*아 파트너님과 이*영 파트너님에게
      </h2>
      <h2 className="text-xl font-bold text-primary mb-6">
        전수받은 노하우
      </h2>

      <div className="space-y-3 mb-8">
        <div className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 shadow-sm">
          <span className="text-primary font-bold text-lg mt-0.5">✔</span>
          <p className="text-gray-800 font-medium">인터넷 커뮤니티🥕 에 글 올려서 100명 모집</p>
        </div>
        <div className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 shadow-sm">
          <span className="text-primary font-bold text-lg mt-0.5">✔</span>
          <p className="text-gray-800 font-medium">실제 친구 아니어도 OK</p>
        </div>
        <div className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 shadow-sm">
          <span className="text-primary font-bold text-lg mt-0.5">✔</span>
          <p className="text-gray-800 font-medium">친구소개만으로 수십만원 벌었어요</p>
        </div>
      </div>

      <div className="bg-white border-l-4 border-primary rounded-xl px-5 py-4 shadow-sm">
        <p className="text-gray-500 text-sm mb-2">김*아 파트너님 인터뷰:</p>
        <p className="text-gray-800 font-medium leading-relaxed">
          "퇴근하고 청소 알바 관심 있냐고 당근에 글 올렸더니<br />
          채팅이 계속 와서 친구로 소개만 했어요.<br />
          친구 소개만 해도 수익이 충분했어요."
        </p>
      </div>
    </section>
  )
}
