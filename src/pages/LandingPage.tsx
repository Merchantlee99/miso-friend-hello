import { Link } from 'react-router-dom'
import { trackEvent } from '../analytics'

export default function LandingPage() {
  return (
    <main className="page-shell min-h-dvh bg-white px-5 pb-10 pt-12 sm:px-7">
      <section className="hero-section">
        <h1 className="text-[34px] font-extrabold leading-[1.18] tracking-[-0.045em] text-slate-950">
          <span className="text-primary">글로 258명을 소개해<br />516만원을 받았어요.</span>
        </h1>
        <img src="https://miso-friend-hello-hrj4cxv4l-sanginns-projects.vercel.app/illustrations/referral-v1/payout-hero-miso-v1.png" alt="앞치마를 입은 미소 파트너가 휴대폰으로 정산 완료를 확인하는 모습" className="mt-3 block w-full" />
        <Link to="/apply" onClick={() => trackEvent('cta_click', { cta_location: 'landing_hero', cta_type: 'consultation', destination_type: 'apply_page' })} className="primary-button mt-7 flex items-center justify-center">
          지금 상담받고 돈벌기
        </Link>
      </section>
    </main>
  )
}
