import { type NextRequest, NextResponse } from "next/server"

const MAGICPAY_URL = "https://api.sistema-magicpay.com/v1/payment"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const apiKey = process.env.MAGICPAY_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "MAGICPAY_API_KEY não configurada." }, { status: 500 })
  }

  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: "ID do pagamento ausente." }, { status: 400 })
  }

  try {
    const res = await fetch(`${MAGICPAY_URL}/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        accept: "application/json",
      },
      cache: "no-store",
    })

    const data = await res.json()

    if (!res.ok) {
      console.log("[v0] MagicPay erro ao consultar pagamento:", res.status, JSON.stringify(data))
      return NextResponse.json({ error: "Falha ao consultar pagamento." }, { status: res.status })
    }

    return NextResponse.json({ id: data.id, status: data.status })
  } catch (err) {
    console.log("[v0] Erro de rede MagicPay (status):", err)
    return NextResponse.json({ error: "Erro ao conectar com o provedor de pagamento." }, { status: 502 })
  }
}
