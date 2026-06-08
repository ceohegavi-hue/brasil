"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

const sizes = ["PP", "P", "M", "G", "GG", "XL", "XXL"]
const models = ["Masculino", "Feminino"]
const colors = ["Amarelo", "Azul"]

type ShirtSelection = {
  size: string | null
  model: string | null
  color: string | null
  personalize: "Sim" | "Não" | null
  customName: string
  customNumber: string
}

const emptySelection: ShirtSelection = {
  size: null,
  model: null,
  color: null,
  personalize: null,
  customName: "",
  customNumber: "",
}

function OptionPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-brand-blue bg-brand-blue/10 text-brand-blue"
          : "border-border bg-card text-foreground hover:border-foreground/30"
      }`}
    >
      {label}
    </button>
  )
}

function ShirtCard({
  index,
  selection,
  onChange,
}: {
  index: number
  selection: ShirtSelection
  onChange: (next: ShirtSelection) => void
}) {
  return (
    <div className="rounded-2xl border border-border p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">
          {index}
        </span>
        <span className="text-base font-bold text-foreground">Camiseta {index}</span>
      </div>

      <div className="mt-4">
        <p className="text-sm font-bold text-foreground">
          Tamanho: <span className="font-normal text-muted-foreground">{selection.size ?? "Selecione"}</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {sizes.map((s) => (
            <OptionPill
              key={s}
              label={s}
              active={selection.size === s}
              onClick={() => onChange({ ...selection, size: s })}
            />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-bold text-foreground">
          Modelo: <span className="font-normal text-muted-foreground">{selection.model ?? "Selecione"}</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {models.map((m) => (
            <OptionPill
              key={m}
              label={m}
              active={selection.model === m}
              onClick={() => onChange({ ...selection, model: m })}
            />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-bold text-foreground">
          Cor: <span className="font-normal text-muted-foreground">{selection.color ?? "Selecione"}</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {colors.map((c) => (
            <OptionPill
              key={c}
              label={c}
              active={selection.color === c}
              onClick={() => onChange({ ...selection, color: c })}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <p className="text-sm font-bold text-foreground">Deseja personalizar sua camisa?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["Sim", "Não"] as const).map((p) => (
            <OptionPill
              key={p}
              label={p}
              active={selection.personalize === p}
              onClick={() => onChange({ ...selection, personalize: p })}
            />
          ))}
        </div>

        {selection.personalize === "Sim" && (
          <div className="mt-4 flex flex-col gap-3">
            <div>
              <label className="text-sm font-bold text-foreground">Nome na camisa</label>
              <input
                type="text"
                value={selection.customName}
                onChange={(e) => onChange({ ...selection, customName: e.target.value.toUpperCase().slice(0, 12) })}
                placeholder="Ex: NEYMAR"
                maxLength={12}
                className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium uppercase text-foreground outline-none focus:border-brand-blue"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-foreground">Número (0 a 99)</label>
              <input
                type="text"
                inputMode="numeric"
                value={selection.customNumber}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 2)
                  const num = Number(digits)
                  if (digits === "" || num <= 99) {
                    onChange({ ...selection, customNumber: digits })
                  }
                }}
                placeholder="Ex: 10"
                maxLength={2}
                className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground outline-none focus:border-brand-blue"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function CheckoutDrawer({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [shirts, setShirts] = useState<ShirtSelection[]>([{ ...emptySelection }, { ...emptySelection }])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  if (!open) return null

  const updateShirt = (i: number, next: ShirtSelection) => {
    setShirts((prev) => prev.map((s, idx) => (idx === i ? next : s)))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      {/* Sheet */}
      <div className="relative flex max-h-[92vh] w-full max-w-md flex-col rounded-t-2xl bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <img
              src="/images/banner-convocado-OGFc4TFh.png"
              alt="Camisa do Brasil"
              className="h-12 w-12 rounded-lg object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-red-600">R$ 89,75</span>
                <span className="text-xs text-muted-foreground line-through">R$ 432,87</span>
                <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">87%</span>
              </div>
              <span className="text-xs font-semibold text-green-600">Frete grátis</span>
            </div>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="rounded p-1 text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <p className="text-base font-bold text-foreground">
            Escolha suas camisetas <span className="font-normal text-muted-foreground">(2 unidades)</span>
          </p>
          <div className="mt-3 flex flex-col gap-4">
            {shirts.map((s, i) => (
              <ShirtCard key={i} index={i + 1} selection={s} onChange={(next) => updateShirt(i, next)} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-card px-4 py-3">
          <button className="w-full rounded-full bg-gradient-to-r from-[oklch(0.68_0.22_25)] to-[oklch(0.72_0.2_15)] py-3.5 text-base font-bold text-white shadow-md">
            Comprar Agora
          </button>
        </div>
      </div>
    </div>
  )
}
