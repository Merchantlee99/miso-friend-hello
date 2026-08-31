import TopBanner from './components/TopBanner'
import HeroSection from './components/HeroSection'
import HowItWorks from './components/HowItWorks'
import EligibilitySection from './components/EligibilitySection'
import SocialProof from './components/SocialProof'
import CopyTemplate from './components/CopyTemplate'
import VideoGuide from './components/VideoGuide'
import ApplicantGuide from './components/ApplicantGuide'
import AfterPosting from './components/AfterPosting'
import EventSection from './components/EventSection'
import FAQ from './components/FAQ'

export default function App() {
  return (
    <>
      <TopBanner />
      <div className="w-full max-w-[430px] bg-primary min-h-screen pt-[72px]">
        <HeroSection />
        <HowItWorks />
        <EligibilitySection />
        <SocialProof />
        <CopyTemplate />
        <VideoGuide />
        <ApplicantGuide />
        <AfterPosting />
        <EventSection />
        <FAQ />
      </div>
    </>
  )
}
