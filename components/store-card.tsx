import { BadgeCheck } from "lucide-react"

export function StoreCard() {
  return (
    <section className="mt-2 flex items-center gap-3 bg-card px-4 py-3">
      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-brand-yellow">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/cbf-logo-DacjfRIP.jpg" alt="CBF" className="h-full w-full object-cover" />
      </div>
      <div className="flex-1">
        <p className="flex items-center gap-1.5 text-sm font-bold">
          CBF STORE
          <BadgeCheck className="h-4 w-4 text-brand-blue" />
        </p>
        <p className="text-xs text-muted-foreground">79.8K vendido(s)</p>
      </div>
      <button className="rounded-full bg-muted px-4 py-1.5 text-xs font-semibold">Visitar</button>
    </section>
  )
}
