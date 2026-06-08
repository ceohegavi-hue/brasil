"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, MapPin, ShieldCheck, Minus, Plus, Clock, Copy, Check } from "lucide-react"

const UNIT_PRICE = 89.75
const OLD_PRICE = 432.87

const fretes = [
  { id: "gratis", label: "Frete Grátis", desc: "até 8 dias úteis", price: 0 },
  { id: "sedex", label: "Frete SEDEX", desc: "até 5 dias úteis", price: 11.75 },
  { id: "full", label: "Frete FULL", desc: "até 1 dia corrido", price: 15.75 },
]

function brl(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

type Step = "summary" | "personal" | "address" | "review" | "pix"

type PersonalData = {
  name: string
  email: string
  noEmail: boolean
  phone: string
  cpf: string
}

type AddressData = {
  cep: string
  street: string
  number: string
  sn: boolean
  district: string
  complement: string
  city: string
  state: string
  country: string
  freteId: string | null
  otherRecipient: boolean
  recipientName: string
}

export function CheckoutFlow({
  open,
  onClose,
  quantity: initialQty = 1,
}: {
  open: boolean
  onClose: () => void
  quantity?: number
}) {
  const [step, setStep] = useState<Step>("summary")
  const [qty, setQty] = useState(initialQty)
  const [personal, setPersonal] = useState<PersonalData>({
    name: "",
    email: "",
    noEmail: false,
    phone: "",
    cpf: "",
  })
  const [address, setAddress] = useState<AddressData>({
    cep: "",
    street: "",
    number: "",
    sn: false,
    district: "",
    complement: "",
    city: "",
    state: "",
    country: "Brasil",
    freteId: null,
    otherRecipient: false,
    recipientName: "",
  })
  const [cepLoading, setCepLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(7 * 60 + 20)
  const [nameError, setNameError] = useState(false)
  const [pixCode, setPixCode] = useState("")
  const [pixId, setPixId] = useState("")
  const [pixLoading, setPixLoading] = useState(false)
  const [pixError, setPixError] = useState("")
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      setStep("summary")
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  // Countdown on PIX step
  useEffect(() => {
    if (step !== "pix") return
    const t = setInterval(() => setTimeLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [step])

  // Poll payment status on PIX step
  useEffect(() => {
    if (step !== "pix" || !pixId || paid) return
    const t = setInterval(async () => {
      try {
        const res = await fetch(`/api/pix/${pixId}`, { cache: "no-store" })
        const data = await res.json()
        if (data.status === "PAID") {
          setPaid(true)
          clearInterval(t)
        }
      } catch {
        // tenta novamente no próximo ciclo
      }
    }, 5000)
    return () => clearInterval(t)
  }, [step, pixId, paid])

  if (!open) return null

  const subtotal = UNIT_PRICE * qty
  const selectedFrete = fretes.find((f) => f.id === address.freteId)
  const freteValue = selectedFrete?.price ?? 0
  const total = subtotal + freteValue

  async function lookupCep(rawCep: string) {
    const digits = rawCep.replace(/\D/g, "")
    if (digits.length !== 8) return
    setCepLoading(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setAddress((a) => ({
          ...a,
          street: data.logradouro || a.street,
          district: data.bairro || a.district,
          city: data.localidade || a.city,
          state: data.uf || a.state,
        }))
      }
    } catch {
      // silent fail – usuário pode preencher manualmente
    } finally {
      setCepLoading(false)
    }
  }

  function formatCep(v: string) {
    const d = v.replace(/\D/g, "").slice(0, 8)
    return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
  }

  function formatCpf(v: string) {
    const d = v.replace(/\D/g, "").slice(0, 11)
    return d
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  }

  function goToPersonal() {
    setStep("personal")
  }

  function submitPersonal() {
    if (personal.name.trim().split(" ").length < 2) {
      setNameError(true)
      return
    }
    setNameError(false)
    setStep("address")
  }

  function submitAddress() {
    setStep("review")
  }

  function mm(s: number) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
  }

  function copyPix() {
    if (!pixCode) return
    navigator.clipboard?.writeText(pixCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  async function generatePix() {
    setPixLoading(true)
    setPixError("")
    try {
      const res = await fetch("/api/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          delivery: {
            fee: freteValue,
            state: address.state,
            city: address.city,
            district: address.district,
            street: address.street,
            number: address.sn ? "S/N" : address.number,
            complement: address.complement,
            zipCode: address.cep,
          },
          description: `Camisa Brasil x${qty}`,
          payer: {
            name: personal.name,
            email: personal.noEmail ? undefined : personal.email,
            phone: personal.phone,
            cpf: personal.cpf,
          },
          items: [{ name: "Camisa Brasil", quantity: qty, price: UNIT_PRICE }],
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPixError(data?.error || "Não foi possível gerar o Pix. Tente novamente.")
        return
      }
      setPixCode(data.copypaste || "")
      setPixId(data.id || "")
      setPaid(data.status === "PAID")
      setTimeLeft(7 * 60 + 20)
      setStep("pix")
    } catch {
      setPixError("Erro de conexão. Tente novamente.")
    } finally {
      setPixLoading(false)
    }
  }

  const showBack = step !== "summary"

  function handleBack() {
    if (step === "personal") setStep("summary")
    else if (step === "address") setStep("personal")
    else if (step === "review") setStep("address")
    else if (step === "pix") setStep("review")
    else onClose()
  }

  const headerTitle =
    step === "summary" || step === "review"
      ? "Resumo do pedido"
      : step === "pix"
        ? "Código do pagamento"
        : "Preencha seus dados"

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-card">
      <div className={`flex w-full max-w-md flex-col ${step === "pix" ? "bg-[oklch(0.95_0.03_15)]" : "bg-card"}`}>
        {/* Header */}
        <div className="relative flex items-center justify-center border-b border-border px-4 py-3">
          {showBack ? (
            <button onClick={handleBack} aria-label="Voltar" className="absolute left-3 text-foreground">
              <ChevronLeft className="h-6 w-6" />
            </button>
          ) : (
            <button onClick={onClose} aria-label="Voltar" className="absolute left-3 text-foreground">
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          <div className="text-center">
            <h2 className="text-base font-bold text-foreground">{headerTitle}</h2>
            {(step === "summary" || step === "review") && (
              <p className="flex items-center justify-center gap-1 text-xs text-green-600">
                <ShieldCheck className="h-3.5 w-3.5" />
                Seus dados estão seguros conosco
              </p>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {(step === "summary" || step === "review") && (
            <SummaryStep
              step={step}
              qty={qty}
              setQty={setQty}
              subtotal={subtotal}
              freteValue={freteValue}
              total={total}
              onFillData={goToPersonal}
              selectedFreteLabel={selectedFrete?.label}
            />
          )}

          {step === "personal" && (
            <PersonalStep
              data={personal}
              setData={setPersonal}
              nameError={nameError}
              formatCpf={formatCpf}
              onSubmit={submitPersonal}
            />
          )}

          {step === "address" && (
            <AddressStep
              data={address}
              setData={setAddress}
              cepLoading={cepLoading}
              formatCep={formatCep}
              onCepBlur={lookupCep}
              onSubmit={submitAddress}
            />
          )}

          {step === "pix" && (
            <PixStep
              total={total}
              timeLeft={timeLeft}
              mm={mm}
              copied={copied}
              onCopy={copyPix}
              pixCode={pixCode}
              paid={paid}
            />
          )}
        </div>

        {/* Footers */}
        {(step === "summary" || step === "review") && (
          <div className="border-t border-border bg-card px-4 py-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Total <span className="text-xs">({qty} item)</span>
              </span>
              <span className="text-lg font-extrabold text-red-600">{brl(total)}</span>
            </div>
            {step === "review" && pixError && (
              <p className="mb-2 text-center text-xs font-medium text-red-600">{pixError}</p>
            )}
            <button
              onClick={() => (step === "summary" ? goToPersonal() : generatePix())}
              disabled={step === "review" && pixLoading}
              className="w-full rounded-full bg-red-600 py-3.5 text-base font-bold text-white shadow-md disabled:opacity-60"
            >
              {step === "summary" ? "Comprar" : pixLoading ? "Gerando Pix..." : "Gerar Pix"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryStep({
  step,
  qty,
  setQty,
  subtotal,
  freteValue,
  total,
  onFillData,
  selectedFreteLabel,
}: {
  step: Step
  qty: number
  setQty: (n: number) => void
  subtotal: number
  freteValue: number
  total: number
  onFillData: () => void
  selectedFreteLabel?: string
}) {
  return (
    <div>
      {/* Fill data card */}
      <button
        onClick={onFillData}
        className="flex w-full items-center gap-3 px-4 py-4 text-left"
      >
        <MapPin className="h-6 w-6 shrink-0 text-foreground" />
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">Preencha seus dados</p>
          <p className="text-xs text-muted-foreground">Identificação e endereço de entrega</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </button>

      {/* Dashed divider */}
      <div className="h-1.5 w-full bg-[repeating-linear-gradient(90deg,oklch(0.68_0.22_25)_0_12px,oklch(0.78_0.13_200)_12px_24px)]" />

      {/* Store + product */}
      <div className="px-4 py-4">
        <p className="text-sm font-bold text-foreground">TikTok Shop</p>
        <div className="mt-3 flex gap-3">
          <img
            src="/images/banner-convocado-OGFc4TFh.png"
            alt="Camisa do Brasil"
            className="h-20 w-20 shrink-0 rounded-lg object-cover"
          />
          <div className="flex flex-1 flex-col">
            <p className="text-sm font-medium leading-snug text-foreground">
              (Compre 1 e leve 2) Camisa do Brasil Copa 2026
            </p>
            <div className="mt-1 flex items-end justify-between">
              <span className="text-lg font-extrabold text-red-600">{brl(UNIT_PRICE)}</span>
              <div className="flex items-center gap-3 rounded-full border border-border px-3 py-1">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  aria-label="Diminuir"
                  className="text-muted-foreground"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-sm font-semibold text-foreground">{qty}</span>
                <button onClick={() => setQty(qty + 1)} aria-label="Aumentar" className="text-muted-foreground">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Order summary */}
      <div className="px-4 py-4">
        <p className="text-sm font-bold text-foreground">Resumo do pedido</p>
        <div className="mt-3 flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal do produto</span>
          <span className="text-foreground">{brl(subtotal)}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-muted-foreground">Frete{selectedFreteLabel ? ` (${selectedFreteLabel})` : ""}</span>
          <span className="text-foreground">{brl(freteValue)}</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-base font-bold text-foreground">Total</span>
          <span className="text-lg font-extrabold text-red-600">{brl(total)}</span>
        </div>
      </div>

      <div className="h-2 w-full bg-muted" />

      {/* Payment method */}
      <div className="px-4 py-4">
        <p className="text-sm font-bold text-foreground">Forma de pagamento</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[oklch(0.92_0.06_200)]">
            <PixGlyph />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Pix</p>
            <p className="text-xs text-muted-foreground">Pague e obtenha confirmação instantânea.</p>
          </div>
          <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-red-600">
            <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
          </span>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  )
}

const inputClass =
  "w-full rounded-xl bg-muted px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-red-500/40"

function PersonalStep({
  data,
  setData,
  nameError,
  formatCpf,
  onSubmit,
}: {
  data: PersonalData
  setData: React.Dispatch<React.SetStateAction<PersonalData>>
  nameError: boolean
  formatCpf: (v: string) => string
  onSubmit: () => void
}) {
  return (
    <div className="flex flex-col gap-5 px-4 py-5">
      <Field label="Nome completo">
        <input
          value={data.name}
          onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
          placeholder="Nome e sobrenome"
          className={`${inputClass} ${nameError ? "ring-2 ring-red-500" : ""}`}
        />
        {nameError && <span className="text-xs text-red-600">Informe o nome completo</span>}
      </Field>

      <Field label="E-mail">
        <input
          type="email"
          value={data.email}
          disabled={data.noEmail}
          onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
          placeholder="seuemail@hotmail.com"
          className={`${inputClass} ${data.noEmail ? "opacity-50" : ""}`}
        />
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={data.noEmail}
            onChange={(e) => setData((d) => ({ ...d, noEmail: e.target.checked }))}
            className="h-4 w-4 rounded border-border accent-red-600"
          />
          Não tenho e-mail
        </label>
      </Field>

      <div className="flex gap-3">
        <div className="flex-1">
          <Field label="Telefone">
            <input
              inputMode="numeric"
              value={data.phone}
              onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))}
              placeholder="DDD + número"
              className={inputClass}
            />
          </Field>
        </div>
        <div className="flex-1">
          <Field label="CPF">
            <input
              inputMode="numeric"
              value={data.cpf}
              onChange={(e) => setData((d) => ({ ...d, cpf: formatCpf(e.target.value) }))}
              placeholder="123.456.789-12"
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <button
        onClick={onSubmit}
        className="mt-1 w-full rounded-full bg-red-600 py-3.5 text-base font-bold text-white shadow-md"
      >
        Ir para a entrega
      </button>
    </div>
  )
}

function AddressStep({
  data,
  setData,
  cepLoading,
  formatCep,
  onCepBlur,
  onSubmit,
}: {
  data: AddressData
  setData: React.Dispatch<React.SetStateAction<AddressData>>
  cepLoading: boolean
  formatCep: (v: string) => string
  onCepBlur: (cep: string) => void
  onSubmit: () => void
}) {
  return (
    <div className="flex flex-col gap-5 px-4 py-5">
      <p className="text-sm text-muted-foreground">
        Outra pessoa irá receber o pedido? <span className="font-semibold text-brand-blue">Clique aqui</span>
      </p>

      <Field label="CEP">
        <div className="relative">
          <input
            inputMode="numeric"
            value={data.cep}
            onChange={(e) => {
              const v = formatCep(e.target.value)
              setData((d) => ({ ...d, cep: v }))
              if (v.replace(/\D/g, "").length === 8) onCepBlur(v)
            }}
            onBlur={(e) => onCepBlur(e.target.value)}
            placeholder="00000-000"
            className={inputClass}
          />
          {cepLoading && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              buscando...
            </span>
          )}
        </div>
      </Field>

      <Field label="Endereço">
        <input
          value={data.street}
          onChange={(e) => setData((d) => ({ ...d, street: e.target.value }))}
          placeholder="Rua / Avenida"
          className={inputClass}
        />
      </Field>

      <div className="flex gap-3">
        <div className="flex-1">
          <Field label="Número">
            <input
              value={data.sn ? "" : data.number}
              disabled={data.sn}
              onChange={(e) => setData((d) => ({ ...d, number: e.target.value }))}
              placeholder="1234"
              className={`${inputClass} ${data.sn ? "opacity-50" : ""}`}
            />
          </Field>
          <label className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={data.sn}
              onChange={(e) => setData((d) => ({ ...d, sn: e.target.checked }))}
              className="h-4 w-4 rounded border-border accent-red-600"
            />
            S/N
          </label>
        </div>
        <div className="flex-1">
          <Field label="Bairro">
            <input
              value={data.district}
              onChange={(e) => setData((d) => ({ ...d, district: e.target.value }))}
              placeholder="Centro"
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <Field label="Complemento">
        <input
          value={data.complement}
          onChange={(e) => setData((d) => ({ ...d, complement: e.target.value }))}
          placeholder="Apartamento e bloco"
          className={inputClass}
        />
      </Field>

      <Field label="Cidade">
        <input
          value={data.city}
          onChange={(e) => setData((d) => ({ ...d, city: e.target.value }))}
          placeholder="Cidade"
          className={inputClass}
        />
      </Field>

      <Field label="Estado">
        <input
          value={data.state}
          onChange={(e) => setData((d) => ({ ...d, state: e.target.value }))}
          placeholder="Estado"
          className={inputClass}
        />
      </Field>

      <Field label="País">
        <input
          value={data.country}
          onChange={(e) => setData((d) => ({ ...d, country: e.target.value }))}
          placeholder="País"
          className={inputClass}
        />
      </Field>

      <div>
        <p className="text-sm font-bold text-foreground">Escolha o melhor frete para você</p>
        <div className="mt-3 flex flex-col gap-3">
          {fretes.map((f) => {
            const active = data.freteId === f.id
            return (
              <button
                key={f.id}
                onClick={() => setData((d) => ({ ...d, freteId: f.id }))}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                  active ? "border-red-600 bg-red-50" : "border-border bg-card"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    active ? "border-red-600" : "border-muted-foreground/40"
                  }`}
                >
                  {active && <span className="h-2.5 w-2.5 rounded-full bg-red-600" />}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-foreground">{f.label}</span>
                  <span className="block text-xs text-muted-foreground">{f.desc}</span>
                </span>
                {f.price === 0 ? (
                  <span className="text-sm font-bold text-green-600">Grátis</span>
                ) : (
                  <span className="text-sm font-bold text-foreground">{brl(f.price)}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={!data.freteId}
        className="mt-1 w-full rounded-full bg-red-600 py-3.5 text-base font-bold text-white shadow-md disabled:opacity-50"
      >
        Continuar
      </button>
    </div>
  )
}

function PixStep({
  total,
  timeLeft,
  mm,
  copied,
  onCopy,
  pixCode,
  paid,
}: {
  total: number
  timeLeft: number
  mm: (s: number) => string
  copied: boolean
  onCopy: () => void
  pixCode: string
  paid: boolean
}) {
  if (paid) {
    return (
      <div className="flex flex-col items-center px-5 py-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white">
          <Check className="h-8 w-8" />
        </span>
        <h3 className="mt-4 text-2xl font-extrabold text-foreground">Pagamento confirmado!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Recebemos seu pagamento de {brl(total)}. Seu pedido já está sendo preparado.
        </p>
      </div>
    )
  }

  return (
    <div className="px-5 py-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-extrabold leading-tight text-foreground">
            Aguardando o<br />
            pagamento
            <br />
            {brl(total)}
          </h3>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-white">
          <Clock className="h-6 w-6" />
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Vence em</span>
        <span className="flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
          <Clock className="h-3.5 w-3.5" />
          {mm(timeLeft)}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Após o pagamento, a confirmação é <span className="font-semibold text-foreground">automática</span>.
      </p>

      <div className="mt-5 rounded-2xl bg-card p-4 shadow-lg">
        <div className="flex items-center gap-2">
          <PixGlyph />
          <span className="text-sm font-bold text-foreground">PIX</span>
        </div>
        <p className="mt-3 truncate text-lg font-bold text-foreground">{pixCode || "Gerando código..."}</p>
        <button
          onClick={onCopy}
          disabled={!pixCode}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-red-600 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copiado!" : "Copiar"}
        </button>
      </div>

      <div className="mt-6">
        <p className="text-base font-bold text-foreground">Como fazer pagamentos com PIX?</p>
        <ol className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
          <li>1. Abra o app do seu banco ou instituição de pagamento.</li>
          <li>2. Selecione a opção PIX e escolha &quot;Pix Copia e Cola&quot;.</li>
          <li>3. Cole o código acima e confirme o pagamento.</li>
        </ol>
      </div>
    </div>
  )
}

function PixGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path
        d="M12 2.5 16.5 7 12 11.5 7.5 7 12 2.5ZM7 7.5 11.5 12 7 16.5 2.5 12 7 7.5ZM17 7.5 21.5 12 17 16.5 12.5 12 17 7.5ZM12 12.5 16.5 17 12 21.5 7.5 17 12 12.5Z"
        fill="oklch(0.6 0.13 175)"
      />
    </svg>
  )
}
