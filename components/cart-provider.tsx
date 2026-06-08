"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { CartDrawer } from "@/components/cart-drawer"
import { CheckoutFlow } from "@/components/checkout-flow"

type CartContextValue = {
  openCart: () => void
  openCheckout: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider")
  return ctx
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  return (
    <CartContext.Provider
      value={{
        openCart: () => setCartOpen(true),
        openCheckout: () => setCheckoutOpen(true),
      }}
    >
      {children}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false)
          setCheckoutOpen(true)
        }}
      />

      <CheckoutFlow open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </CartContext.Provider>
  )
}
