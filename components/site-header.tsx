import { ChevronLeft, Share2, ShoppingCart } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-card px-3 py-3 shadow-sm">
      <button aria-label="Voltar" className="rounded-full p-1">
        <ChevronLeft className="h-6 w-6" />
      </button>
      <div className="flex items-center gap-4">
        <button aria-label="Compartilhar">
          <Share2 className="h-5 w-5" />
        </button>
        <button aria-label="Carrinho" className="relative">
          <ShoppingCart className="h-5 w-5" />
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            1
          </span>
        </button>
      </div>
    </header>
  )
}
