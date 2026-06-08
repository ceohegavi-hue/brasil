"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

function format(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":")
}

export function PriceBar() {
  const [seconds, setSeconds] = useState(9 * 60 + 36)

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bg-gradient-to-r from-[oklch(0.68_0.22_22)] via-[oklch(0.72_0.21_30)] to-[oklch(0.78_0.18_55)] px-4 py-3 text-white">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-bold text-red-600">87%</span>
            <span className="text-2xl font-extrabold leading-none">R$ 89,75</span>
          </div>
          <div className="mt-1 text-[11px] text-white/90 line-through">R$ 432,87</div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 text-[12px] font-semibold">
            <Clock className="h-3.5 w-3.5" />
            Oferta Relâmpago
          </div>
          <div className="mt-0.5 text-[13px]">
            Termina em <span className="font-bold">{format(seconds)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
