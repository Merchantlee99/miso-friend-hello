import { useEffect, useRef, useState } from 'react'

function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="rounded-2xl overflow-hidden shadow-md relative bg-black">
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <video
        ref={videoRef}
        src={src}
        className="w-full"
        playsInline
        muted
        preload="metadata"
        controls
        onCanPlay={() => setLoaded(true)}
      />
    </div>
  )
}

export default function VideoGuide() {
  const [tab, setTab] = useState<'daangn' | 'blog'>('daangn')

  return (
    <section className="px-6 py-10 bg-white">
      <h2 className="text-xl font-bold text-gray-900 mb-4">📱 이렇게 올리면 돼요</h2>

      <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
        <button
          onClick={() => setTab('daangn')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
            tab === 'daangn' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'
          }`}
        >
          🥕 당근마켓
        </button>
        <button
          onClick={() => setTab('blog')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
            tab === 'blog' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'
          }`}
        >
          📝 블로그·SNS
        </button>
      </div>

      {tab === 'daangn' ? (
        <VideoPlayer src="/write_guide.mp4" />
      ) : (
        <>
          {/* <div className="bg-blue-50 rounded-2xl px-4 py-3 mb-3 flex items-start gap-2">
            <span className="text-base mt-0.5">🔗</span>
            <p className="text-blue-700 text-sm font-medium leading-relaxed">
              블로그, 틱톡, 인스타그램, 맘카페에 글 올리는 법을 영상으로 확인해보세요!
            </p>
          </div> */}
          <VideoPlayer src="/blog_upload_guide.mp4" />
        </>
      )}
    </section>
  )
}
