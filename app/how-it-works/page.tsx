import { getHowItWorks } from '@/lib/content'

export const metadata = {
  title: 'Slik fungerer det — SecondHeat',
}

export default async function HowItWorksPage() {
  const content = await getHowItWorks()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-serif font-bold text-gray-900 mb-8">
          {content?.title}
        </h1>

        <div className="prose prose-lg max-w-none text-gray-600">
          {content?.sections?.map((section, idx) => (
            <div key={idx} className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                {section.heading}
              </h2>
              <p className="text-lg leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-12 border-t border-gray-200">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">
            Ofte stilte spørsmål
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                Hva koster det å bli medlem?
              </h3>
              <p className="text-gray-600">
                Det er helt gratis å registrere seg og bruke SecondHeat. Du betaler kun for varene du kjøper.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                Hvordan godkjennes varer?
              </h3>
              <p className="text-gray-600">
                Teamet vårt gjennomgår hver annonse for kvalitet og ekthet. Vi vil sikre at alle
                varer oppfyller standardene våre. De fleste varer godkjennes innen 24 timer.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                Hvordan får jeg betalt for salget mitt?
              </h3>
              <p className="text-gray-600">
                Vi håndterer betalinger og fraktkoordinering. Etter at varen din er solgt og
                levert, overføres betalingen til kontoen din innen 5–7 virkedager.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                Hva med fraktkostnader?
              </h3>
              <p className="text-gray-600">
                Fraktkostnader er inkludert i prisen. Standard norsk frakt koster 49–99 kr
                avhengig av vekt og bestemmelsessted.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                Kan jeg returnere en vare?
              </h3>
              <p className="text-gray-600">
                Ja. Du har 14 dagers angrerett fra mottak av varen, i henhold til angrerettloven.
                Selger dekker returfrakten dersom varen ikke samsvarer med beskrivelsen.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                Hvordan kontakter jeg andre medlemmer?
              </h3>
              <p className="text-gray-600">
                Du kan sende meldinger til kjøpere eller selgere gjennom vårt sikre
                meldingssystem. Meldinger er knyttet til spesifikke kjøp for trygghet og sporbarhet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
