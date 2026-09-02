import { trackEvent } from '../analytics'

const consultationTypeformUrl = 'https://reviewevent.typeform.com/to/rwnHYVFK'

export default function TopBanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
      <a href={consultationTypeformUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('cta_click', { cta_location: 'sticky_bottom', cta_type: 'consultation', destination_type: 'typeform' })} aria-label="상담받고 수익 참여하기" className="reward-cta flex w-full max-w-[430px] items-center justify-center rounded-2xl bg-[#FFC928] px-5 py-3.5 text-center text-slate-950 transition-transform active:scale-[0.98]">
        <span><span className="block text-[15px] font-extrabold tracking-[-0.03em]">지금 상담받고 수익 참여하기</span><span className="mt-0.5 block text-xs font-semibold text-slate-700">첫 글만 올려도 5,000원</span></span>
      </a>
    </div>
  )
}
