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
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Meenakshi%20Amman%20Temple%2C%20Madurai.JPG?width=1400",
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
    image: "/images/dwarkadhish.png",
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
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Shri%20Jagannath%20Temple%2CPuri.jpg?width=1400",
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
    image: "/images/kashi-vishwanath.png",
    shortDescription: "One of the most revered Shiva temples on the banks of the Ganga.",
    description: "Kashi Vishwanath is a major Shiva pilgrimage site in Varanasi. A visit can be paired with the ghats, Ganga Aarti and the city's living cultural traditions.",
    timing: "3:00 AM – 11:00 PM",
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
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/The%20temple%20of%20Kedernath.jpg?width=1400",
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
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Moonset%20at%20Somnath%20Temple.jpg?width=1400",
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
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/A%20View%20of%20Tirumala%20Venkateswara%20Temple.JPG?width=1400",
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
    image: "/images/mahakaleshwar.png",
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
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Badrinath%20Temple.JPG?width=1400",
    shortDescription: "A revered Vishnu temple in the high Himalayas.",
    description: "Badrinath is one of the Char Dham pilgrimage sites and is set against the spectacular Himalayan landscape.",
    timing: "4:30 AM – 9:00 PM (seasonal)",
    bestTime: "May – October",
    type: "Char Dham",
    highlights: ["Main shrine", "Tapt Kund", "Alaknanda valley", "Himalayan routes"]
  },
  {
    slug: "akshardham-delhi",
    name: "Swaminarayan Akshardham",
    deity: "Lord Swaminarayan",
    city: "New Delhi",
    state: "Delhi",
    region: "North India",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Delhi%20Akshardham%20Temple.JPG?width=1400",
    shortDescription: "A vast modern temple complex famed for its craftsmanship and cultural exhibitions.",
    description: "Swaminarayan Akshardham is a sprawling temple complex in Delhi built with intricate stone carving, showcasing Indian art, architecture and spirituality through its exhibitions and gardens.",
    timing: "9:30 AM – 6:30 PM (closed Mondays)",
    bestTime: "October – March",
    type: "Modern Temple",
    highlights: ["Main monument", "Musical fountain show", "Exhibition halls", "Yagnapurush Kund"]
  },
  {
    slug: "konark-sun-temple",
    name: "Konark Sun Temple",
    deity: "Surya (Sun God)",
    city: "Konark",
    state: "Odisha",
    region: "East India",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/KONARK%20SUN%20TEMPLE.jpg?width=1400",
    shortDescription: "A UNESCO World Heritage chariot-shaped temple dedicated to the Sun God.",
    description: "Konark Sun Temple is a 13th-century marvel built in the shape of a colossal stone chariot with intricately carved wheels, dedicated to the Hindu Sun God Surya.",
    timing: "6:00 AM – 8:00 PM",
    bestTime: "October – February",
    type: "Historic Temple",
    highlights: ["Chariot wheels", "Stone carvings", "Nearby Chandrabhaga beach", "Konark Dance Festival"]
  },
  {
    slug: "brihadeeswarar",
    name: "Brihadeeswarar Temple",
    deity: "Lord Shiva",
    city: "Thanjavur",
    state: "Tamil Nadu",
    region: "South India",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Brihadeeswarar%20Temple%20front%20view.JPG?width=1400",
    shortDescription: "A UNESCO World Heritage Chola-era temple famed for its towering vimana.",
    description: "Built by Raja Raja Chola I in the 11th century, Brihadeeswarar Temple is a masterpiece of Dravidian architecture, renowned for its massive vimana tower and intricate Chola-era sculpture.",
    timing: "6:00 AM – 12:30 PM, 4:00 PM – 8:30 PM",
    bestTime: "October – March",
    type: "Historic Temple",
    highlights: ["Vimana tower", "Nandi statue", "Chola frescoes", "Temple tank"]
  }
  ,{
    slug: "mallikarjuna",
    name: "Mallikarjuna Swamy Temple",
    deity: "Lord Shiva",
    city: "Srisailam",
    state: "Andhra Pradesh",
    region: "South India",
    image: "/images/mallikarjuna.png",
      
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
    name: "Omkareshwar Temple",
    deity: "Lord Shiva",
    city: "Khandwa",
    state: "Madhya Pradesh",
    region: "Central India",
    image: "/images/omkareshwar.png",
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
    name: "Bhimashankar Temple",
    deity: "Lord Shiva",
    city: "Bhimashankar",
    state: "Maharashtra",
    region: "West India",
    image: "/images/bhimashankar.png",
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
    name: "Trimbakeshwar Temple",
    deity: "Lord Shiva",
    city: "Trimbak",
    state: "Maharashtra",
    region: "West India",
    image: "/images/trimbakeshwar.png",
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
    name: "Baba Baidyanath Temple",
    deity: "Lord Shiva",
    city: "Deoghar",
    state: "Jharkhand",
    region: "East India",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Baidyanath%20temple%20and%20temple%20complex%2C%20Deoghar%2001.jpg?width=1400",
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
    name: "Nageshwar Jyotirlinga Temple",
    deity: "Lord Shiva",
    city: "Dwarka",
    state: "Gujarat",
    region: "West India",
    image: "/images/nageshwar.png",
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
    name: "Ramanathaswamy Temple",
    deity: "Lord Shiva",
    city: "Rameswaram",
    state: "Tamil Nadu",
    region: "South India",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ramanathaswamy%20Temple%2C%20Rameshwaram%2C%20Tamil%20Nadu.jpg?width=1400",
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
    name: "Grishneshwar Temple",
    deity: "Lord Shiva",
    city: "Chhatrapati Sambhajinagar",
    state: "Maharashtra",
    region: "West India",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Grishneshwar%20Temple.jpg?width=1400",
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