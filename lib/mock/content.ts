export interface PageContent {
  title: string
  slug: string
  content: string
  sections?: Section[]
}

export interface Section {
  heading: string
  body: string
}

export interface FAQ {
  question: string
  answer: string
}

export const mockPages: Record<string, PageContent> = {
  'how-it-works': {
    title: 'Slik fungerer SecondHeat',
    slug: 'how-it-works',
    content: 'Lær hvordan du kjøper og selger dansetøy på SecondHeat',
    sections: [
      {
        heading: 'For kjøpere',
        body: 'Bla gjennom vår samling av kvalitets brukt dansetøy. Filtrer etter størrelse, stand og pris. Når du finner noe du elsker, kjøper du gjennom vår sikre kasse og vi ordner frakt.',
      },
      {
        heading: 'For selgere',
        body: 'Legg ut dansetøyet ditt med bilder og beskrivelse. Når teamet vårt har godkjent det, dukker varen opp i butikken. Når noen kjøper, genererer vi en fraktetikett og tar oss av resten.',
      },
      {
        heading: 'Medlemsfellesskap',
        body: 'SecondHeat er en plattform kun for medlemmer, bygget for dansere. Dette holder fellesskapet vårt trygt og sikrer at alle er seriøse om kvalitet.',
      },
    ],
  },
}

export const mockFAQ: FAQ[] = [
  {
    question: 'Hva koster det å bli medlem?',
    answer: 'Det er gratis å registrere seg og bruke SecondHeat. Du betaler kun for varene du kjøper.',
  },
  {
    question: 'Hvordan godkjennes varer?',
    answer: 'Teamet vårt gjennomgår hver annonse for kvalitet og stand. Vi vil sikre at alle varer oppfyller standardene våre. De fleste varer godkjennes innen 24 timer.',
  },
  {
    question: 'Hvordan får jeg betalt for salget mitt?',
    answer: 'Vi håndterer betalinger og fraktkoordinering. Etter at varen din er solgt og levert, overføres betalingen til kontoen din innen 5–7 virkedager.',
  },
  {
    question: 'Kan jeg returnere varer?',
    answer: 'Varer kan returneres innen 14 dager hvis de ikke samsvarer med beskrivelsen. Selger dekker returfrakten ved selgers feil.',
  },
  {
    question: 'Hva med fraktkostnader?',
    answer: 'Fraktkostnader beregnes basert på varevekt og bestemmelsessted. Standard norsk frakt koster 49–99 kr avhengig av vekt.',
  },
  {
    question: 'Hvordan kontakter jeg andre medlemmer?',
    answer: 'Du kan sende meldinger til kjøpere eller selgere gjennom vårt sikre meldingssystem. Meldinger er knyttet til spesifikke kjøp for sikkerhet.',
  },
]
