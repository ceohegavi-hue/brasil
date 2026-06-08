"use client"

import { useEffect } from "react"
import { X } from "lucide-react"

export function CartDrawer({
  open,
  onClose,
  onCheckout,
}: {
  open: boolean
  onClose: () => void
  onCheckout: () => void
}) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      {/* Sheet */}
      <div className="relative flex w-full max-w-md flex-col rounded-t-2xl bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4">
          <h2 className="text-base font-bold text-foreground">Meu Carrinho (1)</h2>
          <button onClick={onClose} aria-label="Fechar" className="rounded p-1 text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="h-px bg-border" />

        {/* Item */}
        <div className="flex gap-3 px-4 py-4">
          <img
            src="/images/home-front-KTyznEKn.webp"
            alt="Camisa Seleção Brasileira 2026"
            className="h-16 w-16 shrink-0 rounded-lg object-cover"
          />
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-bold text-foreground">Camisa Seleção Brasileira 2026</p>
            <p className="text-xs text-muted-foreground">Promoção: Compre 1, Leve 2</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-base font-extrabold text-red-600">R$ 89,75</span>
              <span className="text-xs text-muted-foreground line-through">R$ 432,87</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Total */}
        <div className="flex items-center justify-between px-4 py-4">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-lg font-extrabold text-foreground">R$ 89,75</span>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4">
          <button
            onClick={onCheckout}
            className="w-full rounded-full bg-red-600 py-3.5 text-base font-bold text-white shadow-md"
          >
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  )
}
