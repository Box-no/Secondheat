import { Button } from '@/components/ui/button'
import { ProductGrid } from '@/components/products/ProductGrid'
import { getProducts } from '@/lib/data/products'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default async function Home() {
  const products = await getProducts()
  const featuredProducts = products.slice(0, 6)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="space-y-6">
            <div>
              <p className="text-heat-orange-600 font-semibold text-sm uppercase tracking-wide mb-3">
                🔥 Dansefellesskapets markedsplass
              </p>
              <h1 className="text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-tight mb-4">
                Dine favorittplagg,<br />en ny runde
              </h1>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed max-w-lg">
              SecondHeat er stedet hvor dansere kjøper, selger og oppdager kvalitetsdansetøy fra
              andre dansere. Ekte plagg. Ekte priser. Ekte fellesskap.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/shop">
                <Button className="bg-gradient-to-r from-heat-orange-500 to-heat-red-600 hover:from-heat-orange-600 hover:to-heat-red-700 text-white px-8 py-3 text-base font-semibold rounded-lg">
                  Begynn å handle
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button
                  variant="outline"
                  className="px-8 py-3 text-base font-semibold border-2 border-gray-300 hover:border-heat-orange-400 rounded-lg"
                >
                  Slik fungerer det
                </Button>
              </Link>
            </div>

            <div className="pt-4 space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <span className="text-lg">✓</span>
                <span>Kuratert av dansere, for dansere</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">✓</span>
                <span>Rettferdige priser og sikker frakt</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">✓</span>
                <span>Hold kvalitetsplagg i omløp</span>
              </div>
            </div>
          </div>

          <div className="relative lg:h-96 bg-gradient-to-br from-heat-orange-100 via-heat-red-50 to-heat-purple-100 rounded-3xl flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            <div className="text-center z-10">
              <div className="text-8xl mb-4">💃</div>
              <p className="text-gray-700 font-serif text-xl">
                Dansetøy går aldri<br />av moten
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 bg-gray-50 rounded-3xl my-16">
        <div className="max-w-2xl">
          <p className="text-heat-orange-600 font-semibold text-sm uppercase tracking-wide mb-3">
            Kom i gang
          </p>
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-8">
            Fra ditt skap til deres
          </h2>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-heat-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  1
                </div>
              </div>
              <div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                Bli med i fellesskapet
              </h3>
              <p className="text-gray-700">
                En rask og gratis registrering og du er inne. Kjøp, selg og knytt kontakt med
                andre dansere som forstår det.
              </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-heat-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                  Finn eller legg ut plagg
                </h3>
                <p className="text-gray-700">
                  Handle plagg fra dansere som faktisk kan faget. Eller legg ut noe du har vokst
                  fra. Hvert plagg forteller en historie.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-heat-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                  Send med trygghet
                </h3>
                <p className="text-gray-700">
                  Vi tar oss av etiketter, sporing og returer. Bare pakk det og lever det. Det er alt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <p className="text-heat-orange-600 font-semibold text-sm uppercase tracking-wide mb-3">
            Hva som er varmt nå
          </p>
          <div className="flex justify-between items-end">
            <h2 className="text-4xl font-serif font-bold text-gray-900">Handle det som er nytt</h2>
            <Link
              href="/shop"
              className="text-heat-orange-600 font-medium hover:text-heat-orange-700 hidden sm:flex items-center gap-2"
            >
              Se alle <ArrowRight size={20} />
            </Link>
          </div>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-gradient-to-br from-heat-orange-500 via-heat-red-500 to-heat-purple-600 rounded-3xl py-16 px-8 sm:py-20 sm:px-12 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4">
              Klar til å bli med?
            </h2>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              Tusenvis av dansere kjøper, selger og knytter kontakter allerede. Ditt neste
              favoritteplagg — eller ditt plaggets neste favoritidanser — venter.
            </p>
            <Link href="/join">
              <Button className="bg-gray-900 hover:bg-black text-white font-bold px-8 py-3 shadow-lg hover:shadow-xl text-base">
                Bli med – det er gratis
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
