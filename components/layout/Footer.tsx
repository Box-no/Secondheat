import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="mb-6">
              <Image
                src="/images/logos/secondheat-logo.png"
                alt="SecondHeat"
                width={60}
                height={60}
                className="h-16 w-auto"
              />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Bygget av dansere for dansere. Ekte plagg, ekte priser, ekte fellesskap.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-gray-900 mb-6 text-base">Utforsk</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/how-it-works" className="hover:text-heat-orange-600 transition-colors font-medium">
                  Slik fungerer det
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-heat-orange-600 transition-colors font-medium">
                  Om oss
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-heat-orange-600 transition-colors font-medium">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-gray-900 mb-6 text-base">Juridisk</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="#" className="hover:text-heat-orange-600 transition-colors font-medium">
                  Personvernpolicy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-heat-orange-600 transition-colors font-medium">
                  Kjøps- og salgsvilkår
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold text-gray-900 mb-6 text-base">Støtte</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/how-it-works" className="hover:text-heat-orange-600 transition-colors font-medium">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="mailto:support@secondheat.no" className="hover:text-heat-orange-600 transition-colors font-medium">
                  support@secondheat.no
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500 text-center font-medium">
            © 2025 SecondHeat. Laget for dansere. 💃
          </p>
        </div>
      </div>
    </footer>
  )
}
