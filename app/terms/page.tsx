import Link from 'next/link'

export const metadata = {
  title: 'Kjøps- og salgsbetingelser — SecondHeat',
  robots: {
    index: false,
    follow: false,
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <Link
            href="/join"
            className="text-heat-orange-600 hover:text-heat-orange-700 text-sm font-medium"
          >
            ← Tilbake
          </Link>
        </div>

        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
          Kjøps- og salgsbetingelser for secondheat.no
        </h1>
        <p className="text-gray-500 text-sm mb-12">Sist oppdatert: april 2025</p>

        <div className="space-y-12 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">1. Selger / Plattform</h2>
            <p>secondheat.no drives av:</p>
            <div className="mt-3 pl-4 border-l-2 border-gray-200 space-y-1 text-gray-700">
              <p className="font-semibold">Folvell Group</p>
              <p>Org.nr: 936561853</p>
              <p>
                E-post:{' '}
                <a href="mailto:hei@secondheat.no" className="text-heat-orange-600 hover:underline">
                  hei@secondheat.no
                </a>
              </p>
            </div>
            <p className="mt-4">
              secondheat.no er en markedsplass hvor privatpersoner kan kjøpe og selge brukte dansedrakter.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">2. Plattformens rolle</h2>
            <p>secondheat.no fungerer kun som en formidler mellom kjøper og selger.</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>Avtalen om kjøp inngås direkte mellom kjøper og selger (privatpersoner)</li>
              <li>secondheat.no er ikke part i kjøpsavtalen</li>
              <li>secondheat.no er ikke ansvarlig for varens tilstand, beskrivelse eller levering</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">3. Medlemskap</h2>
            <p>For å bruke plattformen må du være medlem.</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li><strong>Pris:</strong> 99 NOK per år</li>
              <li>Medlemskapet fornyes ikke automatisk</li>
              <li>Medlemsavgiften refunderes ikke</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">4. Priser og provisjon</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Selger fastsetter selv prisen på varen</li>
              <li>secondheat.no tar en provisjon av salgsprisen</li>
              <li>Provisjonen trekkes automatisk ved gjennomført salg</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">5. Betaling (Klarna)</h2>
            <p>Betaling skjer via Klarna. Med Klarna kan kjøper velge:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>Betale med en gang</li>
              <li>Faktura</li>
              <li>Delbetaling</li>
            </ul>
            <p className="mt-4">
              Ved bruk av Klarna inngår kunden en egen avtale med Klarna.{' '}
              <a
                href="https://www.klarna.com/no/vilkar/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-heat-orange-600 hover:underline"
              >
                Se Klarnas vilkår
              </a>
              .
            </p>
            <p className="mt-2">secondheat.no håndterer ikke betaling direkte.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">6. Levering</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Levering avtales mellom kjøper og selger</li>
              <li>secondheat.no er ikke ansvarlig for frakt, forsinkelser eller tap</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">7. Angrerett</h2>
            <p>
              Angrerettloven gjelder normalt ikke ved kjøp mellom privatpersoner. Eventuell retur
              må avtales direkte mellom kjøper og selger.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">8. Reklamasjon og tvister</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Eventuelle klager må rettes direkte til selger</li>
              <li>secondheat.no er ikke ansvarlig for feil eller mangler ved varen</li>
              <li>Plattformen kan bistå i tvister, men har ingen juridisk forpliktelse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">9. Brukeransvar</h2>
            <p>Brukere forplikter seg til å:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>Gi korrekt og ærlig informasjon om varer</li>
              <li>Ikke selge ulovlige eller falske produkter</li>
              <li>Overholde norsk lov</li>
            </ul>
            <p className="mt-4">
              secondheat.no forbeholder seg retten til å fjerne annonser og brukere.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">10. Personvern</h2>
            <p>
              Personopplysninger behandles i henhold til gjeldende regelverk. Se egen{' '}
              <Link href="/privacy" className="text-heat-orange-600 hover:underline">
                personvernerklæring
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">11. Endringer</h2>
            <p>
              secondheat.no kan oppdatere vilkårene. Endringer publiseres på nettsiden.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
