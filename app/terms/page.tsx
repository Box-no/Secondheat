import Link from 'next/link'

export const metadata = {
  title: 'Kjøps- og salgsvilkår — SecondHeat',
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

        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
          Kjøps- og salgsvilkår
        </h1>
        <p className="text-gray-500 text-sm mb-12">Sist oppdatert: januar 2025</p>

        <div className="prose prose-gray max-w-none space-y-12 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">1. Om SecondHeat</h2>
            <p>
              SecondHeat er en nettbasert markedsplass for kjøp og salg av brukte danseklær og -utstyr
              mellom privatpersoner. Plattformen drives av SecondHeat AS, og er forbeholdt registrerte
              medlemmer av dansefellesskapet.
            </p>
            <p className="mt-3">
              Ved å registrere deg som medlem og benytte tjenesten godtar du disse vilkårene i sin helhet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">2. Medlemskap</h2>
            <p>
              Det er <strong>gratis</strong> å registrere seg og bruke SecondHeat.
              Medlemskapet gir deg rett til å kjøpe og selge varer på plattformen, samt delta i
              fellesskapet. Du betaler kun for varene du kjøper.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>Medlemskapet er personlig og kan ikke overdras.</li>
              <li>Registrering er gratis og gir umiddelbar tilgang til plattformen.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">3. Kjøpsvilkår</h2>
            <p>
              Når du kjøper en vare på SecondHeat, inngår du en avtale direkte med selger.
              SecondHeat fungerer som teknisk tilrettelegger og betalingsformidler, men er ikke part
              i selve kjøpsavtalen.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>
                <strong>Betaling:</strong> Alle betalinger behandles sikkert via godkjent
                betalingsløsning (Klarna, Vipps eller kort). Betalingen holdes i depot til varen
                er bekreftet levert.
              </li>
              <li>
                <strong>Frakt:</strong> Fraktkostnader er inkludert i prisen, med mindre annet
                er oppgitt. Estimert leveringstid er 2–5 virkedager i Norge.
              </li>
              <li>
                <strong>Varestand:</strong> Alle varer selges i den stand de er beskrevet.
                Bilder og beskrivelse er selgers ansvar. Kjøper oppfordres til å lese beskrivelsen
                nøye før kjøp.
              </li>
              <li>
                <strong>Angrefrist:</strong> I henhold til angrerettloven har kjøper 14 dagers
                angrerett fra mottak av varen. Angreretten gjelder ikke ved klart feilbeskrivelse
                fra kjøpers side.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">4. Salgsvilkår</h2>
            <p>
              Som selger på SecondHeat forplikter du deg til å selge varer som er ærlig og nøyaktig
              beskrevet, og som er i lovlig eie.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>
                <strong>Godkjenning:</strong> Alle annonser gjennomgås av SecondHeat-teamet
                før publisering. Vi forbeholder oss retten til å avvise annonser som ikke
                oppfyller våre kvalitetsstandarder.
              </li>
              <li>
                <strong>Prising:</strong> Du setter prisen selv. Prisen skal inkludere frakt
                eller frakt skal tydelig oppgis som tillegg.
              </li>
              <li>
                <strong>Utbetaling:</strong> Etter bekreftet levering utbetales salgssummen
                til din registrerte konto innen 5–7 virkedager, fratrukket plattformavgift.
              </li>
              <li>
                <strong>Plattformavgift:</strong> SecondHeat tar 8% av salgssummen som
                transaksjonsgebyr.
              </li>
              <li>
                <strong>Frakt:</strong> Du er ansvarlig for å pakke varen forsvarlig og
                levere den innen 3 virkedager etter salg.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">5. Reklamasjon og retur</h2>
            <p>
              Kjøper kan reklamere på en vare hvis den ikke er i samsvar med beskrivelsen i annonsen.
              Reklamasjon må meldes innen 14 dager etter mottak.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>Send reklamasjon via meldingssystemet knyttet til ordren.</li>
              <li>
                Ved godkjent reklamasjon dekker selger returfrakten og refunderer kjøpesummen.
              </li>
              <li>SecondHeat kan bistå som megler ved uenighet mellom kjøper og selger.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">6. Forbudt innhold</h2>
            <p>Følgende er ikke tillatt på plattformen:</p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>Salg av falske eller plagierende varer</li>
              <li>Salg av varer du ikke eier</li>
              <li>Villedende eller uriktig produktbeskrivelse</li>
              <li>Trakassering, diskriminering eller uvennlig opptreden overfor andre medlemmer</li>
            </ul>
            <p className="mt-3">
              Brudd på disse reglene kan føre til permanent utestengelse fra plattformen uten refusjon.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">7. Personvern</h2>
            <p>
              Vi behandler dine personopplysninger i henhold til vår{' '}
              <Link href="/privacy" className="text-heat-orange-600 hover:underline">
                personvernpolicy
              </Link>
              . Vi selger aldri dine opplysninger til tredjeparter.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">8. Ansvarsbegrensning</h2>
            <p>
              SecondHeat er ikke ansvarlig for tap som følge av transaksjoner mellom brukere, forsinkelser
              i frakt, eller tekniske feil utenfor vår kontroll. Vi anbefaler alle brukere å kommunisere
              via plattformens meldingssystem for dokumentasjon.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">9. Endringer i vilkårene</h2>
            <p>
              SecondHeat forbeholder seg retten til å endre disse vilkårene. Vesentlige endringer varsles
              via e-post minst 14 dager før de trer i kraft. Fortsatt bruk av tjenesten etter varsel
              anses som aksept av de nye vilkårene.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">10. Kontakt</h2>
            <p>
              Har du spørsmål om disse vilkårene, ta kontakt med oss på{' '}
              <a href="mailto:support@secondheat.no" className="text-heat-orange-600 hover:underline">
                support@secondheat.no
              </a>
              .
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
