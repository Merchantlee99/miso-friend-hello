import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { trackEvent } from '../analytics'

function normalisePhone(value: string) {
  return value.replace(/[^0-9]/g, '')
}

export default function ApplyPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const phoneDigits = normalisePhone(phone)

    if (!name.trim()) return setError('성함을 입력해 주세요.')
    if (phoneDigits.length < 10 || phoneDigits.length > 11) return setError('연락처를 다시 확인해 주세요.')
    if (!agreed) return setError('개인정보 수집·이용에 동의해 주세요.')

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phoneDigits, consent: true }),
      })
      const result = await response.json() as { message?: string }

      if (!response.ok) throw new Error(result.message ?? '신청 정보를 저장하지 못했습니다.')

      trackEvent('application_form_complete', { form_fields: 'name_phone', destination_type: 'guide_page' })
      setToast(true)
      window.setTimeout(() => navigate('/guide'), 1300)
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : '신청 정보를 저장하지 못했습니다.')
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-shell flex min-h-dvh flex-col bg-white px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-6 sm:px-7">
      <Link to="/" className="inline-flex py-2 text-sm font-bold text-slate-500">← 처음으로</Link>
      <section className="flex flex-1 flex-col pt-10">
        <h1 className="text-[31px] font-extrabold leading-[1.2] tracking-[-0.045em] text-slate-950">성함과 연락처를<br />남겨주세요!</h1>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-1 flex-col" noValidate>
          <div className="space-y-5">
            <label className="block">
              <input aria-label="성함" value={name} onChange={(event) => { setName(event.target.value); setError('') }} autoComplete="name" placeholder="성함" className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-[16px] font-semibold text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-primary" />
            </label>
            <label className="block">
              <input aria-label="연락처" value={phone} onChange={(event) => { setPhone(event.target.value); setError('') }} inputMode="tel" autoComplete="tel" placeholder="연락처" className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-[16px] font-semibold text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-primary" />
            </label>
          </div>
          <div className="mt-auto space-y-3">
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-slate-50 px-4 py-4">
              <input type="checkbox" checked={agreed} onChange={(event) => { setAgreed(event.target.checked); setError('') }} className="mt-0.5 h-5 w-5 accent-[#0C5BE8]" />
              <span className="text-sm leading-6 text-slate-700"><strong className="font-extrabold text-slate-900">개인정보 수집·이용에 동의합니다.</strong><br />상담 연결을 위해 성함과 연락처를 수집합니다.</span>
            </label>
            {error && <p role="alert" className="text-sm font-bold text-red-600">{error}</p>}
            <button type="submit" disabled={isSubmitting} className="primary-button disabled:cursor-wait disabled:opacity-60">{isSubmitting ? '제출 중...' : '제출하고 다음'}</button>
          </div>
        </form>
      </section>
      {toast && <div role="status" className="fixed bottom-7 left-1/2 z-50 w-[calc(100%-40px)] max-w-[390px] -translate-x-1/2 rounded-2xl bg-slate-950 px-5 py-4 text-center text-sm font-bold leading-6 text-white shadow-2xl">신청이 완료됐어요!<br />다음에서 소개 활동 방법을 확인해 보세요.</div>}
    </main>
  )
}
