"use client"

import { useState } from "react"
import { CheckoutDrawer } from "@/components/checkout-drawer"

export function BottomNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-stretch gap-2 border-t border-border bg-card px-2 py-2 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <button className="flex w-12 flex-col items-center justify-center text-[10px] text-muted-foreground">
          Loja
        </button>
        <button className="flex w-12 flex-col items-center justify-center text-[10px] text-muted-foreground">
          Chat
        </button>
        <button className="flex flex-1 items-center justify-center rounded-full border border-foreground/15 bg-card px-3 text-[13px] font-semibold leading-tight text-foreground">
          Adicionar ao
          <br />
          carrinho
        </button>
        <button
          onClick={() => setOpen(true)}
          className="flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-[oklch(0.68_0.22_25)] to-[oklch(0.72_0.2_15)] px-4 text-sm font-bold text-white shadow-md"
        >
          Comprar Agora
        </button>
      </nav>

      <CheckoutDrawer open={open} onClose={() => setOpen(false)} />
    </>
  )
}
