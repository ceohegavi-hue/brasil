"use client"

import { ShoppingCart, Store, MessageCircle } from "lucide-react"
import { useCart } from "@/components/cart-provider"

export function BottomNav() {
  const { openCart } = useCart()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-stretch gap-2 border-t border-border bg-card px-2 py-2 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
      <button className="flex w-12 flex-col items-center justify-center gap-0.5 text-[10px] text-muted-foreground">
        <Store className="h-5 w-5" />
        Loja
      </button>
      <button className="flex w-12 flex-col items-center justify-center gap-0.5 text-[10px] text-muted-foreground">
        <MessageCircle className="h-5 w-5" />
        Chat
      </button>
      <button
        onClick={openCart}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-foreground/15 bg-card px-3 text-[13px] font-semibold leading-tight text-foreground"
      >
        <ShoppingCart className="h-4 w-4" />
        Adicionar
      </button>
      <button
        onClick={openCart}
        className="flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-[oklch(0.68_0.22_25)] to-[oklch(0.72_0.2_15)] px-4 text-sm font-bold text-white shadow-md"
      >
        Comprar Agora
      </button>
    </nav>
  )
}
