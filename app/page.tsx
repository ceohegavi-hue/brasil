import { SiteHeader } from "@/components/site-header"
import { ProductGallery } from "@/components/product-gallery"
import { ProductInfo } from "@/components/product-info"
import { Reviews } from "@/components/reviews"
import { StoreCard } from "@/components/store-card"
import { AboutProduct } from "@/components/about-product"
import { BottomNav } from "@/components/bottom-nav"
import { CartProvider } from "@/components/cart-provider"

export default function Home() {
  return (
    <CartProvider>
      <main className="min-h-screen bg-background pb-24">
        <SiteHeader />
        <ProductGallery />
        <ProductInfo />
        <Reviews />
        <StoreCard />
        <AboutProduct />
        <BottomNav />
      </main>
    </CartProvider>
  )
}
