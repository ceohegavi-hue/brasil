import { type NextRequest, NextResponse } from "next/server"

const MAGICPAY_URL = "https://api.sistema-magicpay.com/v1/payment"

type PayerInput = {
  name?: string
  email?: string
  phone?: string
  cpf?: string
}

type ItemInput = {
  name: string
  quantity: number
  price: number // em reais
}

type DeliveryInput = {
  fee?: number // em reais
  state?: string
  city?: string
  district?: string
  street?: string
  number?: string
  complement?: string
  zipCode?: string
}

function onlyDigits(value = "") {
  return value.replace(/\D/g, "")
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.MAGICPAY_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "MAGICPAY_API_KEY não configurada." }, { status: 500 })
  }

  let body: {
    amount?: number // total em reais
    description?: string
    payer?: PayerInput
    items?: ItemInput[]
    delivery?: DeliveryInput
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 })
  }

  const { amount, description, payer, items, delivery } = body

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Valor inválido." }, { status: 400 })
  }
  if (!payer?.name || !payer.cpf) {
    return NextResponse.json({ error: "Dados do pagador incompletos." }, { status: 400 })
  }

  const cpfDigits = onlyDigits(payer.cpf)
  const phoneDigits = onlyDigits(payer.phone)

  const payload = {
    amount: Math.round(amount * 100), // centavos
    currency: "BRL",
    method: "PIX",
    description: description || "Pedido Camisa Brasil",
    externalRef: `order_${Date.now()}`,
    payer: {
      name: payer.name,
      taxId: cpfDigits,
      email: payer.email || "sememail@checkout.com",
      phone: phoneDigits || "11999999999",
    },
    items:
      items && items.length > 0
        ? items.map((it) => ({
            quantity: it.quantity,
            name: it.name,
            price: Math.round(it.price * 100),
            type: "PHYSICAL" as const,
          }))
        : [{ quantity: 1, name: "Camisa Brasil", price: Math.round(amount * 100), type: "PHYSICAL" as const }],
    ...(delivery
      ? {
          delivery: {
            fee: Math.round((delivery.fee ?? 0) * 100),
            address: {
              country: "BR",
              state: delivery.state || "",
              city: delivery.city || "",
              district: delivery.district || "",
              street: delivery.street || "",
              number: delivery.number || "S/N",
              ...(delivery.complement ? { complement: delivery.complement } : {}),
              zipCode: (delivery.zipCode || "").replace(/\D/g, ""),
            },
          },
        }
      : {}),
  }

  try {
    const res = await fetch(MAGICPAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
      console.log("[v0] MagicPay erro ao criar pagamento:", res.status, JSON.stringify(data))
      return NextResponse.json(
        { error: data?.message || "Falha ao gerar pagamento PIX." },
        { status: res.status },
      )
    }

    return NextResponse.json({
      id: data.id,
      status: data.status,
      copypaste: data?.data?.copypaste ?? null,
      amount: data.amount,
    })
  } catch (err) {
    console.log("[v0] Erro de rede MagicPay:", err)
    return NextResponse.json({ error: "Erro ao conectar com o provedor de pagamento." }, { status: 502 })
  }
}
