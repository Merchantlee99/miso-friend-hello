type ApplicationPayload = {
  name?: unknown
  phone?: unknown
  consent?: unknown
}

const phoneDigits = (value: string) => value.replace(/[^0-9]/g, '')
export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') {
      return Response.json({ message: 'Method not allowed' }, { status: 405, headers: { Allow: 'POST' } })
    }

    let payload: ApplicationPayload
    try {
      payload = await request.json()
    } catch {
      return Response.json({ message: '잘못된 요청입니다.' }, { status: 400 })
    }

    const name = typeof payload.name === 'string' ? payload.name.trim() : ''
    const phone = typeof payload.phone === 'string' ? phoneDigits(payload.phone) : ''

    if (!name || phone.length < 10 || phone.length > 11 || payload.consent !== true) {
      return Response.json({ message: '입력 정보를 다시 확인해 주세요.' }, { status: 400 })
    }

    const endpoint = process.env.APPS_SCRIPT_URL
    const token = process.env.APPS_SCRIPT_TOKEN

    if (!endpoint || !token) {
      return Response.json({ message: '신청 저장 연결이 아직 설정되지 않았습니다.' }, { status: 503 })
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ name, phone, consent: true, token }),
        redirect: 'follow',
        signal: AbortSignal.timeout(10_000),
      })
      const result = await response.json().catch(() => null) as { ok?: boolean } | null

      if (!response.ok || result?.ok !== true) throw new Error('Webhook rejected the submission')

      return Response.json({ ok: true })
    } catch {
      return Response.json({ message: '신청 정보를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.' }, { status: 502 })
    }
  },
}
