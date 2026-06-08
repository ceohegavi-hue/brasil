"use client"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import { galleryImages } from "@/lib/product-data"
import { PriceBar } from "./price-bar"

export function ProductGallery() {
  const [index, setIndex] = useState(0)
  const total = galleryImages.length

  const prev = () => setIndex((i) => (i - 1 + total) % total)
  const next = () => setIndex((i) => (i + 1) % total)

  return (
    <section className="bg-card">
      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={galleryImages[index] || "/placeholder.svg"}
          alt="Camisa Brasil 2026"
          className="aspect-square w-full select-none object-cover"
          draggable={false}
        />
        <button
          onClick={prev}
          aria-label="Anterior"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          aria-label="Próximo"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white"
        >
          <ChevronLeft className="h-5 w-5 rotate-180" />
        </button>
        <div className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2 py-0.5 text-[11px] text-white">
          {index + 1}/{total}
        </div>
      </div>

      <PriceBar />

      {/* Thumbnails */}
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="flex flex-1 gap-1.5 overflow-x-auto">
          {galleryImages.map((src, i) => (
            <button
              key={src}
              onClick={() => setIndex(i)}
              aria-label={`Imagem ${i + 1}`}
              className={`h-10 w-10 shrink-0 overflow-hidden rounded-md border-2 ${
                i === index ? "border-red-500" : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src || "/placeholder.svg"} className="h-full w-full object-cover" alt="" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
