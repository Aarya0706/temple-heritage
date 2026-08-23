export type Temple = {
  slug: string;
  name: string;
  deity: string;
  city: string;
  state: string;
  region: string;
  image: string;
  highlightImages: string[];
  highlightDescriptions: string[];
  highlightDetails: string[];
  shortDescription: string;
  description: string;
  timing: string;
  bestTime: string;
  type: string;
  highlights: string[];
  // Coordinates for the temple's actual site (Wikipedia-verified), used by
  // YatraRouteMap to plot multi-stop pilgrimage routes. Not the same as a
  // city-center lookup — several of these temples sit well outside their
  // listed city (e.g. Nageshwar is ~15km from Dwarka).
  lat: number;
  lng: number;
  // Concrete, numeric logistics facts for temples that are hard to reach.
  // Optional — most temples in a city with an airport/station don't need
  // this. Populated for remote/high-altitude shrines where an AI planner
  // (or a human) is likely to underestimate travel time if left to guess.
  // Keep this to hard facts (distances, hours, "no road access", nearest
  // transport hub) — not itinerary advice, which belongs in the prompt.
  accessNotes?: string;
};

export const temples: Temple[] = [
  {
    slug: "meenakshi-amman",
    lat: 9.9195,
    lng: 78.1191,
    name: "Meenakshi Amman Temple",
    deity: "Goddess Meenakshi",
    city: "Madurai",
    state: "Tamil Nadu",
    region: "South India",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Meenakshi%20Amman%20Temple%2C%20Madurai.JPG?width=1400",
    highlightDetails: [
      "Look up at the South Gopuram to see its dense layers of painted figures and narrative sculpture. The tower is one of the clearest visual expressions of the temple's Dravidian style and the scale of the Madurai complex.",
      "The Hall of Thousand Pillars is known for its repeating stone columns, carved details and strong sense of symmetry. Spend a few minutes looking down the rows of pillars to appreciate how the architecture creates depth.",
      "The Meenakshi Shrine is the devotional heart of the complex and is dedicated to Goddess Meenakshi. Visitors experience it as an active place of worship rather than only as a heritage monument.",
      "Evening rituals create a different atmosphere from the daytime architecture. Lamps, chants and movement around the sacred spaces make this a good time to experience the temple as a living tradition.",
    ],
    highlightDescriptions: [
      "South Tower: the temple complex’s famous southern gopuram, richly covered with colourful sculptural figures.",
      "Hall of Thousand Pillars: an ornate pillared hall known for its carved columns and monumental Dravidian design.",
      "Meenakshi Shrine: the principal shrine dedicated to Goddess Meenakshi, the presiding deity of Madurai.",
      "Evening ceremonies: devotional rituals and the evening temple atmosphere that bring the living tradition to life.",
    ],
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Madurai%20Meenakshi%20Amman%20South%20Gopuram%20View.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/A%20view%20of%20the%20Thousand-Pillared%20Hall%2C%20Meenakshi%20Temple%20at%20Madurai.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Amman%20sannathi.jpg?width=1400",
      "/temples/meenakshi-amman-evening-ceremonies.png",
    ],
    shortDescription: "Historic temple complex celebrated for its towering gopurams and vibrant sculpture.",
    description: "The Meenakshi Amman Temple is one of the most iconic temple complexes in Tamil Nadu. Its enormous gopurams, sculptural details and living traditions make Madurai a memorable heritage destination.",
    timing: "5:00 AM – 12:30 PM, 4:00 PM – 10:00 PM",
    bestTime: "October – March",
    type: "Historic Temple",
    highlights: ["South Tower", "Hall of Thousand Pillars", "Meenakshi Shrine", "Evening ceremonies"]
  },
  {
    slug: "dwarkadhish",
    lat: 22.2379,
    lng: 68.9676,
    name: "Dwarkadhish Temple",
    deity: "Lord Krishna",
    city: "Dwarka",
    state: "Gujarat",
    region: "West India",
    image: "/images/dwarkadhish.png",
    highlightDetails: [
      "The main shrine is dedicated to Lord Krishna and forms the spiritual centre of Dwarka's pilgrimage circuit. Its tall temple profile is one of the city's most recognizable landmarks.",
      "Gomti Ghat sits beside the temple and connects the shrine with the sacred riverfront. The steps, pilgrims and riverside activity make it an important part of the visit rather than simply a viewpoint.",
      "A heritage walk around Dwarka reveals smaller shrines, market lanes, old facades and everyday pilgrimage activity. It helps connect the monumental temple with the living city around it.",
      "The coastal setting changes noticeably toward evening, with open views across the Arabian Sea. A sunset stop works well as a quieter end to a busy temple day.",
    ],
    highlightDescriptions: [
      "Main shrine: the principal Dwarkadhish sanctuary dedicated to Lord Krishna in the historic Dwarka temple complex.",
      "Gomti Ghat: the sacred riverside ghat beside the temple, associated with pilgrimage rituals and views across the Gomti.",
      "Dwarka heritage walk: a chance to explore the old pilgrimage streets, lanes, markets and temple surroundings of Dwarka.",
      "Sunset by the coast: the Arabian Sea coastline around Dwarka offers a peaceful end to a pilgrimage day.",
    ],
    highlightImages: [
      "/temples/main-shrine-dwarka.png",
      "/temples/gomti-ghat.png",
      "https://commons.wikimedia.org/wiki/Special:FilePath/IndianStreetMarket.jpg?width=1400",
      "https://upload.wikimedia.org/wikipedia/commons/0/02/Dwarkadhish_Temple_-_Jagat_Mandir_-_Dwarakadheesh_and_surroundings_during_Dwaraka_DWARASPDB_2015_%28105%29.jpg",
    ],
    shortDescription: "Ancient Krishna temple overlooking the sacred coastal city of Dwarka.",
    description: "Dwarkadhish Temple, also known as Jagat Mandir, is a major pilgrimage centre associated with Krishna and the ancient city of Dwarka.",
    timing: "6:30 AM – 1:00 PM, 5:00 PM – 9:30 PM",
    bestTime: "November – February",
    type: "Vaishnav Temple",
    highlights: ["Main shrine", "Gomti Ghat", "Dwarka heritage walk", "Sunset by the coast"]
  },
  {
    slug: "jagannath-puri",
    lat: 19.8047,
    lng: 85.8183,
    name: "Jagannath Temple",
    deity: "Lord Jagannath",
    city: "Puri",
    state: "Odisha",
    region: "East India",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Shri%20Jagannath%20Temple%2CPuri.jpg?width=1400",
    highlightDetails: [
      "The main Jagannath Temple is the centre of Puri's religious life and pilgrimage traditions. Its temple precinct is especially associated with Lord Jagannath, Balabhadra and Subhadra.",
      "Rath Yatra is the best-known festival tradition associated with Puri, when the deities are taken out in ceremonial chariots. The festival connects the temple with the city streets on a huge public scale.",
      "Grand Road, or Bada Danda, is the broad ceremonial avenue leading toward the temple. It becomes especially important during processions and festival activity.",
      "Puri Beach gives the pilgrimage town a strong coastal identity alongside its temple heritage. The sea is nearby enough to make it an easy addition to a temple-focused day.",
    ],
    highlightDescriptions: [
      "Main temple: the sacred Jagannath Temple complex, the spiritual centre of Puri and its pilgrimage traditions.",
      "Rath Yatra traditions: Puri’s famous chariot festival tradition, with the deities journeying in ceremonial chariots.",
      "Grand Road: the broad pilgrimage avenue in front of the temple, central to processions and the city’s festive life.",
      "Puri beach: the nearby Bay of Bengal coast, a natural complement to a visit to the temple town.",
    ],
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Shri%20Jagannath%20Temple%2CPuri.jpg?width=1400",
      "/temples/rath-yatra-card.png",
      "/temples/grand-road.png",
      "/temples/puri-beach-card.png",
    ],
    shortDescription: "Sacred coastal pilgrimage centre famous for the Rath Yatra tradition.",
    description: "The Jagannath Temple in Puri is one of India's most important pilgrimage destinations and the spiritual heart of the city.",
    timing: "5:00 AM – 11:00 PM (varies by ritual)",
    bestTime: "October – February",
    type: "Vaishnav Temple",
    highlights: ["Main temple", "Rath Yatra traditions", "Grand Road", "Puri beach"]
  },
  {
    slug: "kashi-vishwanath",
    lat: 25.3108,
    lng: 83.0106,
    name: "Kashi Vishwanath Temple",
    deity: "Lord Shiva",
    city: "Varanasi",
    state: "Uttar Pradesh",
    region: "North India",
    image: "/images/kashi-vishwanath.png",
    accessNotes:
      "Varanasi (Lal Bahadur Shastri Airport, VNS) has NO direct flight to " +
      "Indore, Ujjain's nearest airport - there is no non-stop Varanasi-Indore " +
      "route. Any itinerary leaving Varanasi for Ujjain/Indore must route " +
      "through a connecting hub (commonly Delhi, Mumbai, Bengaluru or " +
      "Hyderabad) and realistically takes 6-10 hours door-to-door including " +
      "the layover - NOT a quick same-evening hop. Do not describe this leg " +
      "as a short direct flight, and do not schedule sightseeing at the " +
      "destination the same evening the flight departs.",
    highlightDetails: [
      "The Vishwanath shrine is dedicated to Lord Shiva and is one of Varanasi's most important pilgrimage sites. Its location in the old city places it within a dense network of lanes, shrines and sacred spaces.",
      "Ganga Aarti is an evening river ritual featuring lamps, chants and coordinated ceremony. It is one of the most atmospheric ways to experience Varanasi's living relationship with the Ganga.",
      "Dashashwamedh Ghat is a major riverfront gathering place and one of the best-known ghats in Varanasi. It is strongly associated with the evening Aarti and the movement of pilgrims along the river.",
      "Old Kashi's lanes are part of the experience: shops, small shrines, homes and pilgrimage traffic sit close together. Walking them gives context to the temple beyond the main shrine itself.",
    ],
    highlightDescriptions: [
      "Vishwanath shrine: the sacred Jyotirlinga shrine dedicated to Lord Shiva in the heart of Varanasi.",
      "Ganga Aarti: the evening river ritual on the Ganga, known for lamps, chants and a deeply devotional atmosphere.",
      "Dashashwamedh Ghat: one of Varanasi’s best-known ghats and a major setting for the Ganga Aarti.",
      "Old Kashi lanes: narrow historic streets around the temple, filled with shrines, shops and everyday pilgrimage life.",
    ],
    highlightImages: [
      "/images/kashi-vishwanath.png",
      "/temples/ganga-aarti.png",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Dashashwamedh%20Ghat%20%2854352%29.jpg?width=1400",
      "/temples/old-lanes.png",
    ],
    shortDescription: "One of the most revered Shiva temples on the banks of the Ganga.",
    description: "Kashi Vishwanath is a major Shiva pilgrimage site in Varanasi. A visit can be paired with the ghats, Ganga Aarti and the city's living cultural traditions.",
    timing: "3:00 AM – 11:00 PM",
    bestTime: "November – February",
    type: "Jyotirlinga",
    highlights: ["Vishwanath shrine", "Ganga Aarti", "Dashashwamedh Ghat", "Old Kashi lanes"]
  },
  {
    slug: "kedarnath",
    lat: 30.7352,
    lng: 79.0669,
    name: "Kedarnath Temple",
    deity: "Lord Shiva",
    city: "Kedarnath",
    state: "Uttarakhand",
    region: "North India",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/The%20temple%20of%20Kedernath.jpg?width=1400",
    accessNotes:
      "No road access to the shrine itself. Road ends at Gaurikund/Sonprayag; " +
      "from there it is a 16-18 km trek (5-8 hours each way) gaining roughly " +
      "1,400 m of altitude to reach 3,583 m. Rishikesh/Haridwar to Gaurikund " +
      "by road is ~210 km and takes 7-10 hours on its own. The drive to " +
      "Gaurikund and the trek must NOT be scheduled on the same day - treat " +
      "them as two separate dedicated days at minimum, in each direction.",
    highlightDetails: [
      "The Kedarnath shrine is a historic Shiva temple surrounded by high Himalayan peaks. The setting makes the temple experience as much about landscape and pilgrimage as architecture.",
      "The mountain approach is a major part of the Kedarnath journey, with a long route through steep Himalayan terrain. The physical journey is an important part of the pilgrimage experience.",
      "The Mandakini valley gives the area its distinctive river-and-mountain character. The river, slopes and settlement create a dramatic setting around the shrine.",
      "Clear views of the Himalayan peaks are one of Kedarnath's defining visual experiences. Weather can change quickly, so the scenery can look very different across the same day.",
    ],
    highlightDescriptions: [
      "Kedarnath shrine: the historic Himalayan Shiva temple set against the mountains of Uttarakhand.",
      "Mountain trek: the pilgrimage approach itself is a major part of the experience, crossing a dramatic Himalayan landscape.",
      "Mandakini valley: the valley around Kedarnath follows the Mandakini River through a high-altitude mountain setting.",
      "Himalayan scenery: towering peaks and changing mountain weather create the distinctive atmosphere around the shrine.",
    ],
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/The%20temple%20of%20Kedernath.jpg?width=1400",
      "/temples/kedarnath-treak.png",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Mandakini%20River%20uttarakhand.jpg?width=1400",
      "/temples/himalayan-scenery.png",
    ],
    shortDescription: "A Himalayan Shiva shrine surrounded by dramatic mountain landscapes.",
    description: "Kedarnath is one of the most revered Himalayan pilgrimage destinations and one of the twelve Jyotirlingas. The journey combines devotion with a challenging mountain trek.",
    timing: "4:00 AM – 9:00 PM (seasonal)",
    bestTime: "May – October",
    type: "Jyotirlinga",
    highlights: ["Kedarnath shrine", "Mountain trek", "Mandakini valley", "Himalayan scenery"]
  },
  {
    slug: "somnath",
    lat: 20.888,
    lng: 70.4014,
    name: "Somnath Temple",
    deity: "Lord Shiva",
    city: "Somnath",
    state: "Gujarat",
    region: "West India",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Moonset%20at%20Somnath%20Temple.jpg?width=1400",
    highlightDetails: [
      "The main Somnath shrine stands beside the Arabian Sea and is traditionally associated with one of the twelve Jyotirlingas. Its coastal position makes the temple especially striking from the sea-facing side.",
      "The sea-facing promenade gives open views toward the Arabian Sea and creates a natural space for a slow walk after darshan. The coastal setting is an important part of Somnath's character.",
      "The evening sound-and-light show adds historical storytelling to the pilgrimage visit. It is best treated as a separate cultural experience after the main temple visit.",
      "Prabhas Patan is a wider sacred landscape rather than a single building. Nearby religious and heritage sites make it worth exploring beyond the main Somnath shrine.",
    ],
    highlightDescriptions: [
      "Main shrine: the prominent Shiva temple standing on the Arabian Sea coast at Prabhas Patan.",
      "Sea-facing promenade: the coastal edge beside the temple gives expansive views of the Arabian Sea.",
      "Evening sound-and-light show: an evening presentation that adds a cultural storytelling layer to the temple visit.",
      "Nearby Prabhas Patan: surrounding sacred sites and the wider heritage landscape connected with Somnath.",
    ],
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Moonset%20at%20Somnath%20Temple.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Guj21%20Somnath%20Temple%20view%20through%20side%20arch.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Somnath%20seashore.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Gita%20Mandir%20on%20Triveni%20Ghat%20near%20Somnath%20Temple%20Gujrat.jpg?width=1400",
    ],
    shortDescription: "A celebrated Shiva temple on the Arabian Sea coast.",
    description: "Somnath is traditionally regarded as the first of the twelve Jyotirlingas. Its coastal setting makes it especially striking at sunrise and sunset.",
    timing: "6:00 AM – 10:00 PM",
    bestTime: "October – February",
    type: "Jyotirlinga",
    highlights: ["Main shrine", "Sea-facing promenade", "Evening sound-and-light show", "Nearby Prabhas Patan"]
  },
  {
    slug: "tirupati",
    lat: 13.6809,
    lng: 79.3506,
    name: "Tirumala Venkateswara Temple",
    deity: "Lord Venkateswara",
    city: "Tirupati",
    state: "Andhra Pradesh",
    region: "South India",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/A%20View%20of%20Tirumala%20Venkateswara%20Temple.JPG?width=1400",
    highlightDetails: [
      "The Tirumala hills shape the entire setting of the Venkateswara pilgrimage. The climb and hill roads gradually transition from ordinary travel into a strongly pilgrimage-oriented landscape.",
      "Darshan at Tirumala is organized around different visitor and seva arrangements. Checking your booking and the day's schedule before arriving can make the experience smoother.",
      "Temple traditions include offerings, devotional practices and carefully organized movement through the complex. The visit is best understood as an active place of worship rather than only a sightseeing stop.",
      "The Tirumala area includes natural spots and waterfalls that complement the temple visit. They can add a quieter nature-focused part to a pilgrimage itinerary.",
    ],
    highlightDescriptions: [
      "Tirumala hills: the temple sits in the Tirumala hill range, giving the pilgrimage a distinctive hill setting.",
      "Darshan: the organised temple visit and darshan experience at the Venkateswara shrine.",
      "Temple traditions: long-standing devotional customs, offerings and pilgrimage practices associated with the temple.",
      "Nearby waterfalls: natural spots around the Tirumala region that can complement the temple visit.",
    ],
    highlightImages: [
      "/temples/tirumala-hills.png",
      "/temples/darshan.png",
      "/temples/temple-traditions.png",
      "https://commons.wikimedia.org/wiki/Special:FilePath/A%20view%20of%20Kapila%20Theertham%20waterfalls%20in%20Tirupathi.jpg?width=1400",
    ],
    shortDescription: "Major Vaishnav pilgrimage centre in the Tirumala hills.",
    description: "The Tirumala Venkateswara Temple is one of the most visited pilgrimage destinations in India, known for its traditions, hill setting and elaborate visitor arrangements.",
    timing: "Varies by sewa and darshan",
    bestTime: "September – February",
    type: "Vaishnav Temple",
    highlights: ["Tirumala hills", "Darshan", "Temple traditions", "Nearby waterfalls"]
  },
  {
    slug: "mahakaleshwar",
    lat: 23.1828,
    lng: 75.7683,
    name: "Mahakaleshwar Temple",
    deity: "Lord Shiva",
    city: "Ujjain",
    state: "Madhya Pradesh",
    region: "Central India",
    image: "/images/mahakaleshwar.png",
    accessNotes:
      "Ujjain has no airport of its own; the nearest is Devi Ahilyabai Holkar " +
      "Airport in Indore (IDR), about 1 hour by road. Indore has NO direct " +
      "flight from Varanasi - travelers coming from Varanasi must connect " +
      "through a hub such as Delhi, Mumbai, Bengaluru or Hyderabad, which " +
      "takes 6-10 hours door-to-door including the layover, not a short " +
      "same-day hop. Do not schedule relaxed same-evening activity in Ujjain " +
      "on a day that also includes a Varanasi departure.",
    highlightDetails: [
      "Bhasma Aarti is the best-known early-morning ritual associated with Mahakaleshwar. Because it is a special worship experience, visitors should check the current booking and entry rules before planning around it.",
      "Mahakal Lok is a large public-facing heritage and pilgrimage area designed around the Mahakaleshwar precinct. Its sculpture, pathways and open spaces give visitors more context around the main shrine.",
      "The Shipra ghats connect Mahakaleshwar with Ujjain's wider sacred geography. Riverfront visits can be combined with the temple and other important religious sites in the city.",
      "Ujjain has a dense network of temples, ghats and historic sacred places. Exploring beyond Mahakaleshwar turns a single temple visit into a broader city pilgrimage.",
    ],
    highlightDescriptions: [
      "Bhasma Aarti: the renowned early-morning ritual associated with the Mahakaleshwar shrine.",
      "Mahakal Lok: the large pilgrim-oriented cultural and heritage development created around the Mahakal precinct.",
      "Shipra ghats: sacred riverfront spaces along the Shipra, important to Ujjain’s broader pilgrimage landscape.",
      "Ujjain heritage: temples, ghats and historic sacred spaces spread across one of India’s major pilgrimage cities.",
    ],
    highlightImages: [
      "/images/mahakaleshwar.png",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Mahakal%20lok.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Mahakal%20Temple%20Ujjain.JPG?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Mahakaleshwar%20ujjain.jpg?width=1400",
    ],
    shortDescription: "Famous Ujjain Jyotirlinga temple with the renowned Bhasma Aarti.",
    description: "Mahakaleshwar is a prominent Shiva temple in Ujjain. The city itself is a major sacred centre with the Shipra river and a rich festival calendar.",
    timing: "3:00 AM – 11:00 PM",
    bestTime: "October – March",
    type: "Jyotirlinga",
    highlights: ["Bhasma Aarti", "Mahakal Lok", "Shipra ghats", "Ujjain heritage"]
  },
  {
    slug: "badrinath",
    lat: 30.7447,
    lng: 79.4912,
    name: "Badrinath Temple",
    deity: "Lord Vishnu",
    city: "Badrinath",
    state: "Uttarakhand",
    region: "North India",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Badrinath%20Temple.JPG?width=1400",
    accessNotes:
      "Badrinath has NO airport and NO railway station. The nearest airport " +
      "(Dehradun/Jolly Grant) and nearest railhead (Rishikesh/Haridwar) are " +
      "both roughly 300 km / 8-10 hours away by mountain road. Any itinerary " +
      "leaving Badrinath by flight or train needs a full dedicated transfer " +
      "day back to Rishikesh/Haridwar/Dehradun BEFORE that flight or train, " +
      "never on the same day. Badrinath to/from Kedarnath (via Sonprayag, " +
      "Rudraprayag, Chamoli, Joshimath) is ~215-225 km and takes 7-10 hours " +
      "by road - it is its own dedicated travel day, not a same-day hop.",
    highlightDetails: [
      "The main Badrinath shrine is dedicated to Lord Vishnu and is one of the Char Dham pilgrimage destinations. Its Himalayan location is central to the character of the visit.",
      "Tapt Kund is a natural hot-water spring near the temple and is traditionally associated with pilgrimage bathing. It adds a distinct ritual and geothermal element to the Badrinath experience.",
      "The Alaknanda valley frames the temple town with river and mountain scenery. The valley setting is especially noticeable from viewpoints around the settlement.",
      "Routes to Badrinath pass through dramatic Himalayan terrain and mountain settlements. Travel time and conditions can vary significantly by season, so the journey itself needs planning.",
    ],
    highlightDescriptions: [
      "Main shrine: the revered Vishnu temple of Badrinath, one of the Char Dham pilgrimage destinations.",
      "Tapt Kund: the natural hot-water spring near the temple traditionally used by pilgrims before darshan.",
      "Alaknanda valley: the river valley setting around Badrinath, framed by high Himalayan terrain.",
      "Himalayan routes: mountain roads, trails and pilgrimage approaches connecting Badrinath with the wider Garhwal region.",
    ],
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Badrinath%20shrine.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Temple%20%28center%29%20and%20Tapt%20Kund%20%28above%20the%20river%20bank%29.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Badrinath%20on%20banks%20of%20Alaknanda%20during%20a%20snowy%20morning.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Badrinath%20Temple%20Path%2C%20Uttarakhand.JPG?width=1400",
    ],
    shortDescription: "A revered Vishnu temple in the high Himalayas.",
    description: "Badrinath is one of the Char Dham pilgrimage sites and is set against the spectacular Himalayan landscape.",
    timing: "4:30 AM – 9:00 PM (seasonal)",
    bestTime: "May – October",
    type: "Char Dham",
    highlights: ["Main shrine", "Tapt Kund", "Alaknanda valley", "Himalayan routes"]
  },
  {
    slug: "akshardham-delhi",
    lat: 28.6125,
    lng: 77.2772,
    name: "Swaminarayan Akshardham",
    deity: "Lord Swaminarayan",
    city: "New Delhi",
    state: "Delhi",
    region: "North India",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Delhi%20Akshardham%20Temple.JPG?width=1400",
    highlightDetails: [
      "The central monument is the visual and architectural focus of the Akshardham complex. Its carved stone surfaces make it a strong example of modern temple craftsmanship inspired by Indian architectural traditions.",
      "The musical fountain show combines water, light, sound and storytelling into an evening presentation. It provides a more staged cultural experience after the quieter monument visit.",
      "The exhibition halls extend the visit beyond the shrine and present themes around Indian history, values and cultural traditions. Allow extra time if you want to see the complex beyond the main monument.",
      "Yagnapurush Kund is a large geometric stepwell-style feature that acts as both architecture and gathering space. Its repeated steps and symmetry make it one of the most distinctive areas of the complex.",
    ],
    highlightDescriptions: [
      "Main monument: the grand central temple structure, known for detailed stone carving and monumental craftsmanship.",
      "Musical fountain show: an evening multimedia presentation combining water, light, sound and storytelling.",
      "Exhibition halls: cultural exhibitions presenting Indian history, values, traditions and achievements.",
      "Yagnapurush Kund: the geometric stepwell-style water feature and architectural focal point within the complex.",
    ],
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Delhi%20Akshardham%20Temple.JPG?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Akshardham%20fountain.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Temple%20india.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Akshardham%20temple%20gardens%2Cdelhi%20-%20panoramio.jpg?width=1400",
    ],
    shortDescription: "A vast modern temple complex famed for its craftsmanship and cultural exhibitions.",
    description: "Swaminarayan Akshardham is a sprawling temple complex in Delhi built with intricate stone carving, showcasing Indian art, architecture and spirituality through its exhibitions and gardens.",
    timing: "9:30 AM – 6:30 PM (closed Mondays)",
    bestTime: "October – March",
    type: "Modern Temple",
    highlights: ["Main monument", "Musical fountain show", "Exhibition halls", "Yagnapurush Kund"]
  },
  {
    slug: "konark-sun-temple",
    lat: 19.8875,
    lng: 86.0947,
    name: "Konark Sun Temple",
    deity: "Surya (Sun God)",
    city: "Konark",
    state: "Odisha",
    region: "East India",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/KONARK%20SUN%20TEMPLE.jpg?width=1400",
    highlightDetails: [
      "The stone wheels are among the most recognizable elements of the Konark Sun Temple. Their carved spokes and surrounding sculpture show how practical architectural forms were turned into visual storytelling.",
      "Konark's stone carvings cover architectural surfaces with figures, motifs and scenes. Looking closely at smaller panels is as rewarding as viewing the monument from a distance.",
      "Chandrabhaga Beach lies near the temple and makes a natural coastal extension to the heritage visit. The sea and open landscape also help explain the region's strong cultural identity.",
      "The Konark Dance Festival connects classical Indian dance with the monument's heritage setting. It is a cultural event rather than part of the temple itself, so dates should be checked separately.",
    ],
    highlightDescriptions: [
      "Chariot wheels: the famous carved stone wheels that form part of Konark’s monumental chariot design.",
      "Stone carvings: detailed sculptures and architectural ornament covering the surviving temple structures.",
      "Chandrabhaga beach: the nearby coast that pairs naturally with a visit to the historic Sun Temple.",
      "Konark Dance Festival: a cultural celebration that connects classical Indian dance with the monument’s heritage setting.",
    ],
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/KONARK%20SUN%20TEMPLE.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/One%20of%20the%2024%20wheels%20of%20Konark%20Sun%20Temple.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Chandrabhaga%20Sea%20Beach%2C%20Konark.jpg?width=1400",
      "/temples/konark-dance.png",
    ],
    shortDescription: "A UNESCO World Heritage chariot-shaped temple dedicated to the Sun God.",
    description: "Konark Sun Temple is a 13th-century marvel built in the shape of a colossal stone chariot with intricately carved wheels, dedicated to the Hindu Sun God Surya.",
    timing: "6:00 AM – 8:00 PM",
    bestTime: "October – February",
    type: "Historic Temple",
    highlights: ["Chariot wheels", "Stone carvings", "Nearby Chandrabhaga beach", "Konark Dance Festival"]
  },
  {
    slug: "brihadeeswarar",
    lat: 10.7828,
    lng: 79.1317,
    name: "Brihadeeswarar Temple",
    deity: "Lord Shiva",
    city: "Thanjavur",
    state: "Tamil Nadu",
    region: "South India",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Brihadeeswarar%20Temple%20front%20view.JPG?width=1400",
    highlightDetails: [
      "The vimana is the dominant architectural feature of Brihadeeswarar and rises dramatically above the temple courtyard. Its scale reflects the engineering and artistic ambition of Chola-era architecture.",
      "The Nandi statue sits prominently opposite the main shrine and provides a strong focal point in the courtyard. Its placement also helps visitors understand the temple's Shaiva layout.",
      "Chola frescoes preserve traces of historic mural traditions within the temple complex. Where accessible, they add a different layer of storytelling beyond the stone architecture.",
      "The temple's water features form part of the wider sacred environment around the complex. They help connect ritual practice with the spatial planning of the historic temple.",
    ],
    highlightDescriptions: [
      "Vimana tower: the towering pyramidal superstructure that dominates the temple’s monumental Dravidian composition.",
      "Nandi statue: the large sacred bull figure placed in front of the main shrine.",
      "Chola frescoes: historic mural traditions associated with the Chola-era temple complex.",
      "Temple tank: the sacred water feature associated with temple rituals and the surrounding complex.",
    ],
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Brihadeeswarar%20Temple%20full.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Brihadeeswara%20Temple%20main%20shrine.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Brihad%20Sikharam.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/1-Brihadeeswara%20Temple-%20court%20-Thanjavur-Tamilnadu%2008.jpg?width=1400",
    ],
    shortDescription: "A UNESCO World Heritage Chola-era temple famed for its towering vimana.",
    description: "Built by Raja Raja Chola I in the 11th century, Brihadeeswarar Temple is a masterpiece of Dravidian architecture, renowned for its massive vimana tower and intricate Chola-era sculpture.",
    timing: "6:00 AM – 12:30 PM, 4:00 PM – 8:30 PM",
    bestTime: "October – March",
    type: "Historic Temple",
    highlights: ["Vimana tower", "Nandi statue", "Chola frescoes", "Temple tank"]
  }
  ,{
    slug: "mallikarjuna",
    lat: 16.0742,
    lng: 78.8681,
    name: "Mallikarjuna Swamy Temple",
    deity: "Lord Shiva",
    city: "Srisailam",
    state: "Andhra Pradesh",
    region: "South India",
    image: "/images/mallikarjuna.png",
    highlightDetails: [
      "The Mallikarjuna shrine is the principal Shiva temple at Srisailam and is traditionally counted among the twelve Jyotirlingas. It anchors a much larger sacred landscape around the hill town.",
      "The Bhramaramba Temple is dedicated to the goddess Bhramaramba and is closely associated with the Mallikarjuna pilgrimage. Visiting both shrines gives a fuller picture of Srisailam's devotional traditions.",
      "The Srisailam hills surround the pilgrimage town with forested Nallamala landscapes. The setting makes the journey feel distinctly different from temple visits in dense urban centres.",
      "The Krishna River is an important natural feature of the Srisailam region. River viewpoints and nearby landscapes can be combined with the temple visit for a broader itinerary.",
    ],
    highlightDescriptions: [
      "Mallikarjuna shrine: the principal Shiva shrine and one of the twelve Jyotirlinga pilgrimage destinations.",
      "Bhramaramba Temple: the nearby shrine dedicated to Goddess Bhramaramba within the Srisailam sacred complex.",
      "Srisailam hills: the forested Nallamala hill setting that surrounds the pilgrimage town.",
      "Krishna River: the river landscape around Srisailam, an important part of the region’s natural setting.",
    ],
    highlightImages: [
      "/temples/mallikarjuna-shrine.png",
      "https://commons.wikimedia.org/wiki/Special:FilePath/2025%20West%20Gopuram%20and%20Bhramaramba%20Devi%20temple%20view%20in%20Srisailam.jpg?width=1400",
      "/temples/srisailam-hills.png",
      "/temples/krishna-river.png",
    ],
      
    shortDescription:
      "A revered Shiva temple at Srisailam, set amid the scenic Nallamala hills.",
    description:
      "Mallikarjuna Swamy Temple at Srisailam is one of the twelve Jyotirlinga shrines and an important pilgrimage centre in Andhra Pradesh.",
    timing: "Varies by darshan and seva",
    bestTime: "October – March",
    type: "Jyotirlinga",
    highlights: [
      "Mallikarjuna shrine",
      "Bhramaramba Temple",
      "Srisailam hills",
      "Krishna River",
    ],
  },

  {
    slug: "omkareshwar",
    lat: 22.2456,
    lng: 76.1511,
    name: "Omkareshwar Temple",
    deity: "Lord Shiva",
    city: "Khandwa",
    state: "Madhya Pradesh",
    region: "Central India",
    image: "/images/omkareshwar.png",
    highlightDetails: [
      "The main Omkareshwar shrine stands on Mandhata Island and is one of the twelve Jyotirlinga destinations. The island setting gives the temple a distinctive relationship with the river around it.",
      "Mandhata Island is itself part of the sacred experience, with temples, ghats and paths spread across the island. Walking through it reveals more than the main shrine alone.",
      "The Narmada River flows around the island and is central to Omkareshwar's religious landscape. Riverfront walks and views help explain why the temple town developed where it did.",
      "Mamleshwar is an important companion shrine across the river. Including both temples gives visitors a fuller understanding of the local pilgrimage circuit.",
    ],
    highlightDescriptions: [
      "Main shrine: the Omkareshwar Jyotirlinga temple on the sacred Mandhata Island.",
      "Mandhata Island: the island setting in the Narmada River that shapes the geography of the pilgrimage.",
      "Narmada River: the sacred river flowing around the island and forming a major part of the visit.",
      "Mamleshwar Temple: the important companion shrine located across the river from Omkareshwar.",
    ],
    highlightImages: [
      "/images/omkareshwar.png",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Omkareshwar%20Temple%2006.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/View%20at%20narmada%20riverside.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Omkareshwar%20Temple.jpg?width=1400",
    ],
    shortDescription:
      "A sacred Jyotirlinga temple on Mandhata Island in the Narmada River.",
    description:
      "Omkareshwar Temple is one of the twelve Jyotirlingas and stands on Mandhata Island in the Narmada River in Madhya Pradesh.",
    timing: "Varies by darshan and seva",
    bestTime: "October – March",
    type: "Jyotirlinga",
    highlights: [
      "Main shrine",
      "Mandhata Island",
      "Narmada River",
      "Mamleshwar Temple",
    ],
  },

  {
    slug: "bhimashankar",
    lat: 19.072,
    lng: 73.536,
    name: "Bhimashankar Temple",
    deity: "Lord Shiva",
    city: "Bhimashankar",
    state: "Maharashtra",
    region: "West India",
    image: "/images/bhimashankar.png",
    highlightDetails: [
      "The Bhimashankar shrine is one of the twelve Jyotirlingas and sits within a forested mountain setting. The relatively smaller scale and surrounding greenery give it a different character from major urban temples.",
      "The Sahyadri hills surround the temple with steep, forested terrain. The approach and weather can make the journey feel as important as the arrival.",
      "Stone construction and regional detailing give the temple its historic architectural character. Look closely at the entrance, carved elements and proportions rather than only the exterior silhouette.",
      "The surrounding wildlife sanctuary adds a strong nature dimension to the pilgrimage. Forest trails and biodiversity make the area particularly interesting for visitors who want a temple-and-nature itinerary.",
    ],
    highlightDescriptions: [
      "Bhimashankar shrine: the historic Shiva shrine and one of the twelve Jyotirlinga temples.",
      "Sahyadri hills: the Western Ghats landscape surrounding the temple and pilgrimage route.",
      "Temple architecture: the stone temple combines devotional function with a historic regional architectural character.",
      "Wildlife sanctuary: the surrounding forest reserve is known for rich biodiversity and mountain scenery.",
    ],
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Bhimashankar%20temple%20front.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Monsoon%20Maharashtra%20India%20Rain%20Landscape%20%281%29%2001.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Temple%20front%20view3.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Bonnet%20Macaque%20Monkey%20India%2C%20Bhimashankar%20wildlife%20Sanctuary%2C%20Pune%20%281%29%2001.jpg?width=1400",
    ],
    shortDescription:
      "A historic Shiva shrine surrounded by the forests and hills of the Western Ghats.",
    description:
      "Bhimashankar Temple is one of the twelve Jyotirlingas and is located in the Sahyadri hills of Maharashtra.",
    timing: "4:30 AM – 9:30 PM",
    bestTime: "October – February",
    type: "Jyotirlinga",
    highlights: [
      "Bhimashankar shrine",
      "Sahyadri hills",
      "Temple architecture",
      "Wildlife sanctuary",
    ],
  },

  {
    slug: "trimbakeshwar",
    lat: 19.9322,
    lng: 73.5308,
    name: "Trimbakeshwar Temple",
    deity: "Lord Shiva",
    city: "Trimbak",
    state: "Maharashtra",
    region: "West India",
    image: "/images/trimbakeshwar.png",
    highlightDetails: [
      "The Trimbakeshwar shrine is one of the twelve Jyotirlingas and forms the centre of the Trimbak pilgrimage. Its black-stone temple architecture gives it a distinctive visual character.",
      "Brahmagiri Hills rise above the temple town and form an important part of the sacred landscape. Views toward the hills help connect the shrine with the wider geography of the region.",
      "The Godavari is traditionally associated with its source near Trimbak. The river's origin gives the area importance beyond the temple itself.",
      "Nivruttinath Temple is part of the wider sacred circuit around Trimbak. It adds another layer of religious history to a visit centred on the main Jyotirlinga.",
    ],
    highlightDescriptions: [
      "Jyotirlinga shrine: the principal Trimbakeshwar Shiva shrine and one of the twelve Jyotirlingas.",
      "Brahmagiri Hills: the mountain range above Trimbak associated with the sacred landscape around the temple.",
      "Godavari source: the region is traditionally connected with the origin of the Godavari River.",
      "Nivruttinath Temple: a nearby sacred site connected with the Nath tradition and the wider Trimbak pilgrimage circuit.",
    ],
    highlightImages: [
      "/temples/jyotirling-shrine.png",
      "/temples/brahmagiri-hills.png",
      "/temples/godavari-source.png",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Trimbakeshwar%20Shiva%20temple%20nashik.jpg?width=1400",
    ],
    shortDescription:
      "A sacred Jyotirlinga temple near Nashik, associated with the origin of the Godavari.",
    description:
      "Trimbakeshwar Temple is one of the twelve Jyotirlingas and lies near the source region of the Godavari River.",
    timing: "5:30 AM – 9:00 PM",
    bestTime: "October – March",
    type: "Jyotirlinga",
    highlights: [
      "Jyotirlinga shrine",
      "Brahmagiri Hills",
      "Godavari source",
      "Nivruttinath Temple",
    ],
  },

  {
    slug: "vaidyanath",
    lat: 24.4925,
    lng: 86.7,
    name: "Baba Baidyanath Temple",
    deity: "Lord Shiva",
    city: "Deoghar",
    state: "Jharkhand",
    region: "East India",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Baidyanath%20temple%20and%20temple%20complex%2C%20Deoghar%2001.jpg?width=1400",
    highlightDetails: [
      "The main shrine is the central focus of the Baidyanath Dham pilgrimage in Deoghar. The temple is traditionally counted among the twelve Jyotirlingas.",
      "The surrounding temple complex contains a group of smaller shrines and sacred spaces. Exploring them helps show how the pilgrimage precinct functions as more than one standalone building.",
      "Shravani Mela is the major seasonal pilgrimage period at Deoghar, bringing very large numbers of devotees to the shrine. Travel arrangements and crowd conditions can therefore be very different during the mela.",
      "Deoghar's pilgrimage experience extends beyond the main temple into nearby shrines and sacred locations. Allowing extra time makes the visit feel less rushed and more connected to the wider city.",
    ],
    highlightDescriptions: [
      "Main shrine: the Baba Baidyanath Jyotirlinga shrine at the heart of Deoghar’s temple complex.",
      "Temple complex: a cluster of sacred shrines surrounding the principal temple and forming the core pilgrimage area.",
      "Shravani Mela: the major seasonal pilgrimage period when large numbers of Shiva devotees visit Deoghar.",
      "Deoghar pilgrimage: the wider sacred circuit around Deoghar, extending beyond the main shrine.",
    ],
    highlightImages: [
      "/temples/main-shrine.png",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Baba%20Baidyanath%20Jyotirlinga%20Temple.jpg?width=1400",
      "/temples/shravani-mela.png",
      "/temples/deoghar-pilgrimage.png",
    ],
    shortDescription:
      "A major Shiva pilgrimage centre in Deoghar and an important Jyotirlinga shrine.",
    description:
      "Baba Baidyanath Temple at Deoghar is one of the twelve Jyotirlinga shrines and a major pilgrimage destination in Jharkhand.",
    timing: "4:00 AM – 9:00 PM",
    bestTime: "October – February",
    type: "Jyotirlinga",
    highlights: [
      "Main shrine",
      "Temple complex",
      "Shravani Mela",
      "Deoghar pilgrimage",
    ],
  },

  {
    slug: "nageshwar",
    lat: 22.3359,
    lng: 69.0869,
    name: "Nageshwar Jyotirlinga Temple",
    deity: "Lord Shiva",
    city: "Dwarka",
    state: "Gujarat",
    region: "West India",
    image: "/images/nageshwar.png",
    highlightDetails: [
      "The Nageshwar shrine is a major Shiva pilgrimage stop near Dwarka. It is traditionally counted among the twelve Jyotirlingas and is often combined with other Dwarka-area temples.",
      "The huge Shiva statue is one of Nageshwar's most recognizable visual landmarks. It creates a striking contrast with the comparatively intimate scale of the temple precinct.",
      "Nageshwar fits naturally into a Dwarka pilgrimage circuit that includes several nearby sacred sites. Planning it as part of a route can make the day more efficient than treating it as an isolated stop.",
      "The Arabian Sea coast is part of the wider geography of the Dwarka region. Coastal views give the pilgrimage a strong sense of place and connect the temples with the surrounding landscape.",
    ],
    highlightDescriptions: [
      "Main shrine: the Nageshwar Jyotirlinga temple in the Dwarka pilgrimage region.",
      "Large Shiva statue: the monumental Shiva statue is a major visual landmark near the temple.",
      "Dwarka pilgrimage circuit: Nageshwar is often visited alongside other sacred places around Dwarka.",
      "Arabian Sea coast: the coastal landscape around Dwarka adds a distinctive seaside element to the pilgrimage.",
    ],
    highlightImages: [
      "/images/nageshwar.png",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Nageshvara%20colossal%20Shiva%20statue%20Dwarka%20Gujarat.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Nageshvar%20jyotirlinga%20temple%20Dwarka%20Gujarat.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Guj21%20Nageshwar%20pond%20Great%20egret.jpg?width=1400",
    ],
    shortDescription:
      "A revered coastal Shiva temple located near the pilgrimage city of Dwarka.",
    description:
      "Nageshwar is traditionally counted among the twelve Jyotirlinga shrines and is located in the Dwarka region of Gujarat.",
    timing: "5:00 AM – 9:00 PM",
    bestTime: "October – February",
    type: "Jyotirlinga",
    highlights: [
      "Main shrine",
      "Large Shiva statue",
      "Dwarka pilgrimage circuit",
      "Arabian Sea coast",
    ],
  },

  {
    slug: "rameshwaram",
    lat: 9.2881,
    lng: 79.3174,
    name: "Ramanathaswamy Temple",
    deity: "Lord Shiva",
    city: "Rameswaram",
    state: "Tamil Nadu",
    region: "South India",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ramanathaswamy%20Temple%2C%20Rameshwaram%2C%20Tamil%20Nadu.jpg?width=1400",
    highlightDetails: [
      "The Ramanathaswamy Temple is one of the twelve Jyotirlinga pilgrimage destinations and a major Shiva shrine in Tamil Nadu. The island setting adds another layer to the pilgrimage.",
      "The temple corridors are famous for their length, repetition and rows of stone columns. Walking through them is one of the most memorable architectural experiences at Rameshwaram.",
      "The sacred wells inside the complex are associated with ritual bathing traditions. Their presence is an important reminder that the temple is designed around both worship and movement through sacred spaces.",
      "Rameswaram forms part of a wider island pilgrimage network rather than a single monument visit. Nearby sacred sites can be combined into a fuller day or multi-day itinerary.",
    ],
    highlightDescriptions: [
      "Main shrine: the Ramanathaswamy Jyotirlinga temple, one of the major Shiva pilgrimage destinations in India.",
      "Long temple corridors: the temple is celebrated for its exceptionally long pillared corridors and rhythmic architectural perspective.",
      "Sacred wells: the temple complex contains numerous sacred wells associated with ritual bathing traditions.",
      "Rameswaram pilgrimage: the island’s wider sacred landscape includes a number of connected pilgrimage sites.",
    ],
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ramanathaswamy%20Temple%2C%20Rameswaram.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ramanathaswamy%20Temple%20Rameswaram%20%281%29.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ramanathaswamy%20Temple%20corridor.jpg?width=1400",
      "/temples/rameshwaram-pilgrimage.png",
    ],
    shortDescription:
      "A celebrated Shiva temple famous for its monumental corridors and sacred wells.",
    description:
      "Ramanathaswamy Temple in Rameswaram is one of the twelve Jyotirlinga shrines and an important pilgrimage centre in Tamil Nadu.",
    timing: "5:00 AM – 1:00 PM, 3:00 PM – 9:00 PM",
    bestTime: "October – March",
    type: "Jyotirlinga",
    highlights: [
      "Main shrine",
      "Long temple corridors",
      "Sacred wells",
      "Rameswaram pilgrimage",
    ],
  },

  {
    slug: "grishneshwar",
    lat: 20.025,
    lng: 75.1699,
    name: "Grishneshwar Temple",
    deity: "Lord Shiva",
    city: "Chhatrapati Sambhajinagar",
    state: "Maharashtra",
    region: "West India",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Grishneshwar%20Temple.jpg?width=1400",
    highlightDetails: [
      "The Grishneshwar shrine is one of the twelve Jyotirlingas and forms the devotional centre of the area near Ellora. Its carved stone architecture makes it particularly rewarding for heritage-focused visitors.",
      "Ellora Caves are close enough to combine with Grishneshwar in the same heritage itinerary. The rock-cut monuments add a very different architectural experience to the temple visit.",
      "The temple's carved surfaces and stone detailing are worth examining at close range. They show how structural architecture and sculpture work together in the shrine.",
      "The wider Verul/Ellora area combines temples, rock-cut heritage and local culture. A visit that includes the surrounding heritage sites gives much more context than seeing the Jyotirlinga alone.",
    ],
    highlightDescriptions: [
      "Main shrine: the Grishneshwar Jyotirlinga temple and one of the twelve major Shiva pilgrimage shrines.",
      "Ellora Caves: the nearby UNESCO-listed rock-cut cave complex makes the temple part of a larger heritage circuit.",
      "Temple architecture: the shrine is known for its historic stonework, carved surfaces and distinctive temple form.",
      "Verul heritage area: the surrounding Ellora/Verul landscape combines temple heritage, cave monuments and local culture.",
    ],
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Grishneshwar%20Temple.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Grishneshwar%20Temple%20Ellora.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/ElloraCave33and34-Ellora-Maharashtra-JM08.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Grishneshwar%20Shiva%20temple%20Maharashtra.jpg?width=1400",
    ],
    shortDescription:
      "A historic Jyotirlinga shrine located near the Ellora Caves in Maharashtra.",
    description:
      "Grishneshwar Temple is one of the twelve Jyotirlingas and is located near the UNESCO-listed Ellora Caves in Maharashtra.",
    timing: "5:30 AM – 9:30 PM",
    bestTime: "October – March",
    type: "Jyotirlinga",
    highlights: [
      "Main shrine",
      "Ellora Caves",
      "Temple architecture",
      "Verul heritage area",
    ],
  },
];

export const regions = ["All", "North India", "South India", "East India", "West India", "Central India"];