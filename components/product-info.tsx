import { Bookmark, Star, Truck, ChevronLeft } from "lucide-react"

export function ProductInfo() {
  return (
    <>
      {/* Limited offer banner */}
      <section className="bg-card px-4 pt-3">
        <button className="flex w-full items-center justify-between rounded-lg border border-red-300 bg-red-50/60 px-3 py-2.5 text-sm font-semibold text-red-600">
          <span className="flex items-center gap-2">
            <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-red-600 text-[9px] font-bold text-white">
              %
            </span>
            Oferta por tempo limitado - 18/05
          </span>
          <ChevronLeft className="h-4 w-4 rotate-180" />
        </button>
      </section>

      {/* Title + rating */}
      <section className="bg-card px-4 pt-3">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-base font-semibold leading-snug text-foreground">
            (Compre 1 e leve 2) Camisa do Brasil Copa 2026
          </h1>
          <button aria-label="Salvar" className="rounded p-1 text-muted-foreground">
            <Bookmark className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          <span className="font-semibold">4.8</span>
          <span className="text-brand-blue underline">(45611)</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">57432 vendidos</span>
        </div>
      </section>

      {/* Shipping */}
      <section className="bg-card px-4 pt-3">
        <div className="flex items-center gap-3 border-t border-border pt-3">
          <Truck className="h-5 w-5 text-green-600" />
          <span className="rounded bg-green-50 px-2 py-0.5 text-sm font-semibold text-green-700">Frete grátis</span>
          <span className="text-xs text-foreground">Receba de 10 de jun até 13 de jun</span>
          <ChevronLeft className="ml-auto h-4 w-4 rotate-180 text-muted-foreground" />
        </div>
        <p className="mt-1 pl-8 text-[12px] text-muted-foreground">
          Taxa de envio: <span className="line-through">R$ 9,60</span>
        </p>
      </section>
    </>
  )
}
