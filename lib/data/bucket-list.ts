export type BucketDream = {
  readonly id: string;
  readonly title: string;
  readonly note: string;
  readonly image: string;
  readonly alt: string;
};

export type BucketChapter = {
  readonly id: string;
  readonly label: string;
  readonly heading: string;
  readonly image: string;
  readonly alt: string;
  readonly dreams: readonly BucketDream[];
};

/**
 * Personal intentions — short notes, not portfolio copy.
 * Images live under /public/bucketlist and are referenced locally only.
 */
export const bucketChapters: readonly BucketChapter[] = [
  {
    id: 'places',
    label: 'Places',
    heading: 'Places I want to stand in.',
    image: '/bucketlist/japan.webp',
    alt: 'Torii gates climbing a wooded hillside in Japan',
    dreams: [
      {
        id: 'japan',
        title: 'Japan',
        note: 'I really want to see Japan.',
        image: '/bucketlist/japan.webp',
        alt: 'Torii gates climbing a wooded hillside in Japan',
      },
      {
        id: 'italy',
        title: 'Italy',
        note: 'Slow days, good food, beautiful streets.',
        image: '/bucketlist/italy.webp',
        alt: 'Narrow canal and historic buildings in Italy',
      },
      {
        id: 'france',
        title: 'France',
        note: 'Paris, museums, and getting lost.',
        image: '/bucketlist/france.webp',
        alt: 'Paris street looking toward the Eiffel Tower',
      },
      {
        id: 'europe',
        title: 'Travel across Europe',
        note: 'A long trip, no fixed rush.',
        image: '/bucketlist/europe.webp',
        alt: 'Quiet European town square and rooftops',
      },
    ],
  },
  {
    id: 'life',
    label: 'The life I want',
    heading: 'A room of my own.',
    image: '/bucketlist/la-studio.webp',
    alt: 'Music studio mixing desk and monitors',
    dreams: [
      {
        id: 'la-studio',
        title: 'House and music studio in LA',
        note: 'A place of my own, with a proper studio.',
        image: '/bucketlist/la-studio.webp',
        alt: 'Music studio mixing desk and monitors',
      },
      {
        id: 'piano',
        title: 'Grand piano',
        note: 'One day, I want one in my living room.',
        image: '/bucketlist/piano.webp',
        alt: 'Black grand piano in soft light',
      },
    ],
  },
  {
    id: 'music',
    label: 'Music',
    heading: 'Songs, stages, nights.',
    image: '/bucketlist/concert.webp',
    alt: 'Crowd under stage lights at a live concert',
    dreams: [
      {
        id: 'meet-artists',
        title: 'Meet Billie Eilish, Conan Gray, sombr and Radiohead',
        note: 'Would be unreal to meet the people behind these songs.',
        image: '/bucketlist/concert.webp',
        alt: 'Crowd under stage lights at a live concert',
      },
      {
        id: 'festival',
        title: 'Global music festival',
        note: 'Experience a festival somewhere in the world.',
        image: '/bucketlist/festival.webp',
        alt: 'Festival crowd under evening lights',
      },
    ],
  },
  {
    id: 'make',
    label: 'Things to make',
    heading: 'Things I still want to build.',
    image: '/bucketlist/book.webp',
    alt: 'Open book resting on a wooden surface',
    dreams: [
      {
        id: 'second-book',
        title: 'Publish my second book',
        note: 'Another book, another piece of me.',
        image: '/bucketlist/book.webp',
        alt: 'Open book resting on a wooden surface',
      },
      {
        id: 'languages',
        title: 'Speak three languages fluently',
        note: 'I want to think in more than one language.',
        image: '/bucketlist/languages.webp',
        alt: 'Notebook and pen on a desk for studying',
      },
      {
        id: 'robot',
        title: 'Build a companion robot',
        note: 'A little machine with a personality of its own.',
        image: '/bucketlist/robot.webp',
        alt: 'Small white robot looking toward the camera',
      },
      {
        id: 'multiplayer',
        title: 'Create a multiplayer game',
        note: 'Something people can play together.',
        image: '/bucketlist/game.webp',
        alt: 'Hands on a game controller in low light',
      },
    ],
  },
  {
    id: 'experiences',
    label: 'Experiences and ambitions',
    heading: 'Once, and then again.',
    image: '/bucketlist/skydiving.jpg',
    alt: 'Skydiver under an open parachute',
    dreams: [
      {
        id: 'skydiving',
        title: 'Go skydiving someday, as an adult',
        note: 'Just once, for the experience.',
        image: '/bucketlist/skydiving.jpg',
        alt: 'Skydiver under an open parachute',
      },
      {
        id: 'rockets',
        title: 'Watch two rocket launches',
        note: 'I want to see that moment in person.',
        image: '/bucketlist/rocket.webp',
        alt: 'Rocket launching into a clear sky',
      },
      {
        id: 'million',
        title: 'Make my first million in my early 20s',
        note: 'A big personal milestone.',
        image: '/bucketlist/city.webp',
        alt: 'City skyline glass towers at dusk',
      },
    ],
  },
] as const;
