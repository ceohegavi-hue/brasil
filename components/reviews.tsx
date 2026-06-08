import { Star } from "lucide-react"
import { reviewPhotos, reviews } from "@/lib/product-data"

function Stars({ count = 5, filled = 5, size = 16 }: { count?: number; filled?: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={i < filled ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground"}
        />
      ))}
    </div>
  )
}

export function Reviews() {
  return (
    <>
      <section className="mt-2 bg-card px-4 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">
            Avaliações dos clientes <span className="font-normal text-muted-foreground">(45611)</span>
          </h2>
          <button className="text-xs text-muted-foreground">Ver mais ›</button>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm">
            <b>4.8</b> <span className="text-muted-foreground">/ 5</span>
          </span>
          <Stars filled={4} />
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Fotos dos clientes (6)</p>
            <button className="text-xs text-brand-blue">Ver todas as mídias →</button>
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto">
            {reviewPhotos.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src || "/placeholder.svg"} className="h-20 w-20 shrink-0 rounded object-cover" alt="" />
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {reviews.map((review) => (
            <div key={review.name} className="border-t border-border pt-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-bold">
                  {review.initials}
                </div>
                <span className="text-sm font-medium">{review.name}</span>
              </div>
              <div className="mt-1">
                <Stars filled={5} size={14} />
              </div>
              <p className="mt-1 text-sm text-foreground">{review.text}</p>
              <div className="mt-2 flex gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={review.image || "/placeholder.svg"} className="h-20 w-20 rounded object-cover" alt="" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-2 bg-card px-4 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">
            Avaliações da loja <span className="font-normal text-muted-foreground">(9,7 mil)</span>
          </h2>
        </div>
        <div className="mt-3 flex gap-2">
          <span className="rounded-full bg-muted px-3 py-1 text-xs">Inclui imagens ou vídeos (967)</span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs">5★ (9,5 mil)</span>
        </div>
      </section>
    </>
  )
}
