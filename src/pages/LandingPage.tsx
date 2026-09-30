import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { trackEvent } from '../analytics'

export default function LandingPage() {
  const ctaRef = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    if (!ctaRef.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        trackEvent('cta_impression', { cta_location: 'landing_hero', cta_type: 'consultation' })
        observer.disconnect()
      }
    })
    observer.observe(ctaRef.current)
    return () => observer.disconnect()
  }, [])
  return (
    <main className="page-shell flex min-h-dvh bg-white px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-10 sm:px-7">
      <section className="hero-section flex min-h-[calc(100dvh-64px)] w-full flex-col">
        <h1 className="text-[34px] font-extrabold leading-[1.18] tracking-[-0.045em] text-slate-950">
          <span className="text-primary">글로 258명을 소개해<br />516만원을 받았어요.</span>
        </h1>
        <img src="/illustrations/referral-v1/payout-hero-miso-v1.png" alt="앞치마를 입은 미소 파트너가 휴대폰으로 정산 완료를 확인하는 모습" className="mt-6 block w-full" />
        <Link ref={ctaRef} to="/apply" onClick={() => trackEvent('cta_click', { cta_location: 'landing_hero', cta_type: 'consultation', destination_type: 'apply_page' })} className="primary-button mt-auto flex items-center justify-center">
          지금 상담받고 돈벌기
        </Link>
      </section>
    </main>
  )
}
