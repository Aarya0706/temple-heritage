export type Temple = {
  slug: string;
  name: string;
  deity: string;
  city: string;
  state: string;
  region: string;
  image: string;
  shortDescription: string;
  description: string;
  timing: string;
  bestTime: string;
  type: string;
  highlights: string[];
};

export const temples: Temple[] = [
  {
    slug: "meenakshi-amman",
    name: "Meenakshi Amman Temple",
    deity: "Goddess Meenakshi",
    city: "Madurai",
    state: "Tamil Nadu",
    region: "South India",
    image: "https://images.unsplash.com/photo-1600100397608-f0106d6c2a52?auto=format&fit=crop&w=1400&q=85",
    shortDescription: "Historic temple complex celebrated for its towering gopurams and vibrant sculpture.",
    description: "The Meenakshi Amman Temple is one of the most iconic temple complexes in Tamil Nadu. Its enormous gopurams, sculptural details and living traditions make Madurai a memorable heritage destination.",
    timing: "5:00 AM – 12:30 PM, 4:00 PM – 10:00 PM",
    bestTime: "October – March",
    type: "Historic Temple",
    highlights: ["South Tower", "Hall of Thousand Pillars", "Meenakshi Shrine", "Evening ceremonies"]
  },
  {
    slug: "dwarkadhish",
    name: "Dwarkadhish Temple",
    deity: "Lord Krishna",
    city: "Dwarka",
    state: "Gujarat",
    region: "West India",
    image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1400&q=85",
    shortDescription: "Ancient Krishna temple overlooking the sacred coastal city of Dwarka.",
    description: "Dwarkadhish Temple, also known as Jagat Mandir, is a major pilgrimage centre associated with Krishna and the ancient city of Dwarka.",
    timing: "6:30 AM – 1:00 PM, 5:00 PM – 9:30 PM",
    bestTime: "November – February",
    type: "Vaishnav Temple",
    highlights: ["Main shrine", "Gomti Ghat", "Dwarka heritage walk", "Sunset by the coast"]
  },
  {
    slug: "jagannath-puri",
    name: "Jagannath Temple",
    deity: "Lord Jagannath",
    city: "Puri",
    state: "Odisha",
    region: "East India",
    image: "https://images.unsplash.com/photo-1625149182857-4f4b6f9b9a5b?auto=format&fit=crop&w=1400&q=85",
    shortDescription: "Sacred coastal pilgrimage centre famous for the Rath Yatra tradition.",
    description: "The Jagannath Temple in Puri is one of India's most important pilgrimage destinations and the spiritual heart of the city.",
    timing: "5:00 AM – 11:00 PM (varies by ritual)",
    bestTime: "October – February",
    type: "Vaishnav Temple",
    highlights: ["Main temple", "Rath Yatra traditions", "Grand Road", "Puri beach"]
  },
  {
    slug: "kashi-vishwanath",
    name: "Kashi Vishwanath Temple",
    deity: "Lord Shiva",
    city: "Varanasi",
    state: "Uttar Pradesh",
    region: "North India",
    image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=1400&q=85",
    shortDescription: "One of the most revered Shiva temples on the banks of the Ganga.",
    description: "Kashi Vishwanath is a major Shiva pilgrimage site in Varanasi. A visit can be paired with the ghats, Ganga Aarti and the city's living cultural traditions.",
    timing: "2:30 AM – 11:00 PM",
    bestTime: "November – February",
    type: "Jyotirlinga",
    highlights: ["Vishwanath shrine", "Ganga Aarti", "Dashashwamedh Ghat", "Old Kashi lanes"]
  },
  {
    slug: "kedarnath",
    name: "Kedarnath Temple",
    deity: "Lord Shiva",
    city: "Kedarnath",
    state: "Uttarakhand",
    region: "North India",
    image: "https://images.unsplash.com/photo-1609947017136-9daf32a5eb16?auto=format&fit=crop&w=1400&q=85",
    shortDescription: "A Himalayan Shiva shrine surrounded by dramatic mountain landscapes.",
    description: "Kedarnath is one of the most revered Himalayan pilgrimage destinations and one of the twelve Jyotirlingas. The journey combines devotion with a challenging mountain trek.",
    timing: "4:00 AM – 9:00 PM (seasonal)",
    bestTime: "May – October",
    type: "Jyotirlinga",
    highlights: ["Kedarnath shrine", "Mountain trek", "Mandakini valley", "Himalayan scenery"]
  },
  {
    slug: "somnath",
    name: "Somnath Temple",
    deity: "Lord Shiva",
    city: "Somnath",
    state: "Gujarat",
    region: "West India",
    image: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1400&q=85",
    shortDescription: "A celebrated Shiva temple on the Arabian Sea coast.",
    description: "Somnath is traditionally regarded as the first of the twelve Jyotirlingas. Its coastal setting makes it especially striking at sunrise and sunset.",
    timing: "6:00 AM – 10:00 PM",
    bestTime: "October – February",
    type: "Jyotirlinga",
    highlights: ["Main shrine", "Sea-facing promenade", "Evening sound-and-light show", "Nearby Prabhas Patan"]
  },
  {
    slug: "tirupati",
    name: "Tirumala Venkateswara Temple",
    deity: "Lord Venkateswara",
    city: "Tirupati",
    state: "Andhra Pradesh",
    region: "South India",
    image: "https://images.unsplash.com/photo-1621928624004-3bba6c0c8b3c?auto=format&fit=crop&w=1400&q=85",
    shortDescription: "Major Vaishnav pilgrimage centre in the Tirumala hills.",
    description: "The Tirumala Venkateswara Temple is one of the most visited pilgrimage destinations in India, known for its traditions, hill setting and elaborate visitor arrangements.",
    timing: "Varies by sewa and darshan",
    bestTime: "September – February",
    type: "Vaishnav Temple",
    highlights: ["Tirumala hills", "Darshan", "Temple traditions", "Nearby waterfalls"]
  },
  {
    slug: "mahakaleshwar",
    name: "Mahakaleshwar Temple",
    deity: "Lord Shiva",
    city: "Ujjain",
    state: "Madhya Pradesh",
    region: "Central India",
    image: "https://images.unsplash.com/photo-1600181953916-7c3b4c0f4e25?auto=format&fit=crop&w=1400&q=85",
    shortDescription: "Famous Ujjain Jyotirlinga temple with the renowned Bhasma Aarti.",
    description: "Mahakaleshwar is a prominent Shiva temple in Ujjain. The city itself is a major sacred centre with the Shipra river and a rich festival calendar.",
    timing: "3:00 AM – 11:00 PM",
    bestTime: "October – March",
    type: "Jyotirlinga",
    highlights: ["Bhasma Aarti", "Mahakal Lok", "Shipra ghats", "Ujjain heritage"]
  },
  {
    slug: "badrinath",
    name: "Badrinath Temple",
    deity: "Lord Vishnu",
    city: "Badrinath",
    state: "Uttarakhand",
    region: "North India",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=85",
    shortDescription: "A revered Vishnu temple in the high Himalayas.",
    description: "Badrinath is one of the Char Dham pilgrimage sites and is set against the spectacular Himalayan landscape.",
    timing: "4:30 AM – 9:00 PM (seasonal)",
    bestTime: "May – October",
    type: "Char Dham",
    highlights: ["Main shrine", "Tapt Kund", "Alaknanda valley", "Himalayan routes"]
  }
];

export const regions = ["All", "North India", "South India", "East India", "West India", "Central India"];
