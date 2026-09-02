export type Festival = {
  slug: string;
  month: string;
  name: string;
  place: string;
  note: string;
  description: string;
  duration: string;
  relatedTempleSlugs: string[];
  imageUrl: string;
  /** Verified next-occurrence date (ISO, Drik Panchang) — refresh yearly since Hindu festival dates shift. */
  date2026: string;
};

export const festivals: Festival[] = [
  {
    slug: "makar-sankranti",
    date2026: "2026-01-14",
    month: "JAN",
    name: "Makar Sankranti",
    place: "Across India",
    note: "A major solar festival celebrated with regional traditions.",
    description: "Makar Sankranti marks the sun's transition into Capricorn and the start of longer days. Celebrated differently across regions — as Pongal in Tamil Nadu, Uttarayan in Gujarat, and Lohri-adjacent festivities in the north — it centres on harvest gratitude, kite flying, and ritual bathing at sacred rivers and temple tanks.",
    duration: "1 day (varies by region)",
    relatedTempleSlugs: ["kashi-vishwanath", "jagannath-puri"],
    imageUrl: "/festivals/makar-sankranti.jpg"
  },
  {
    slug: "maha-shivaratri",
    date2026: "2026-02-15",
    month: "MAR",
    name: "Maha Shivaratri",
    place: "Shiva temples nationwide",
    note: "Night-long worship and special temple ceremonies dedicated to Shiva.",
    description: "Maha Shivaratri, the 'Great Night of Shiva', is observed with night-long vigils, fasting and continuous prayer at Shiva temples across India. Devotees perform the four-phase night worship (prahar puja) with offerings of milk, water and bael leaves to the lingam, especially at major Jyotirlinga shrines.",
    duration: "1 night",
    relatedTempleSlugs: ["kashi-vishwanath", "kedarnath", "somnath", "mahakaleshwar"],
    imageUrl: "/festivals/maha-shivaratri.jpg"
  },
  {
    slug: "holi",
    date2026: "2026-03-04",
    month: "MAR",
    name: "Holi",
    place: "Mathura, Vrindavan & across India",
    note: "The festival of colours, marking the arrival of spring.",
    description: "Holi celebrates the arrival of spring and the triumph of good over evil, with the Holika Dahan bonfire on the eve of the main day. Streets and temple courtyards erupt in clouds of coloured powder and water the next morning, accompanied by folk songs, drums and sweets. Mathura and Vrindavan, associated with Krishna's playful youth, host the most famous celebrations, including the week-long Lathmar Holi at Barsana.",
    duration: "2 days (week-long in Braj region)",
    relatedTempleSlugs: ["dwarkadhish"],
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Barsana%20Holi%20Festival.jpg?width=800"
  },
  {
    slug: "rama-navami",
    date2026: "2026-03-26",
    month: "APR",
    name: "Rama Navami",
    place: "Ayodhya & across India",
    note: "Celebration of the birth of Lord Rama.",
    description: "Rama Navami celebrates the birth of Lord Rama, marked with readings of the Ramayana, devotional processions, and temple decorations. Ayodhya, Rama's traditional birthplace, sees the largest gatherings, with recitations and cultural programs continuing through the day.",
    duration: "1 day",
    relatedTempleSlugs: ["badrinath"],
    imageUrl: "/festivals/rama-navami.jpg"
  },
  {
    slug: "ratha-yatra",
    date2026: "2026-07-16",
    month: "JUL",
    name: "Ratha Yatra",
    place: "Puri, Odisha",
    note: "The grand chariot procession of Lord Jagannath.",
    description: "Ratha Yatra is the annual chariot festival in which the deities Jagannath, Balabhadra and Subhadra are drawn through the streets of Puri on massive, elaborately decorated wooden chariots. Thousands of devotees pull the ropes themselves, believing that helping to move the chariots brings great merit. It is one of the oldest and largest processional festivals in the world.",
    duration: "9 days",
    relatedTempleSlugs: ["jagannath-puri"],
    imageUrl: "/festivals/ratha-yatra.png"
  },
  {
    slug: "guru-purnima",
    date2026: "2026-07-29",
    month: "JUL",
    name: "Guru Purnima",
    place: "Across India",
    note: "A day of gratitude and reverence for spiritual teachers.",
    description: "Guru Purnima honours spiritual and academic teachers, and traditionally marks the birth anniversary of the sage Veda Vyasa, compiler of the Vedas. Devotees visit temples and ashrams to offer prayers and seek blessings from their gurus, and many spiritual centres hold discourses and special satsangs through the day.",
    duration: "1 day",
    relatedTempleSlugs: [],
    imageUrl: "/festivals/guru-purnima.png"
  },
  {
    slug: "janmashtami",
    date2026: "2026-09-04",
    month: "SEP",
    name: "Janmashtami",
    place: "Mathura & Vrindavan",
    note: "Festivities celebrating the birth of Lord Krishna.",
    description: "Janmashtami marks the birth of Lord Krishna with midnight worship, devotional singing, and dramatic reenactments of his childhood stories. Mathura and Vrindavan, his traditional birthplace and childhood home, host the most elaborate celebrations, drawing pilgrims from across the country.",
    duration: "1 day and night",
    relatedTempleSlugs: ["dwarkadhish"],
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Dahi%20Handi.JPG?width=800"
  },
  {
    slug: "onam",
    date2026: "2026-08-26",
    month: "AUG",
    name: "Onam",
    place: "Kerala",
    note: "Kerala's harvest celebration with rich cultural traditions.",
    description: "Onam is Kerala's ten-day harvest festival, honouring the mythical King Mahabali. Celebrations include intricate flower rangoli (pookalam), the Vallam Kali snake boat races, elaborate feasts served on banana leaves (Onam Sadya), and traditional Kathakali performances.",
    duration: "10 days",
    relatedTempleSlugs: [],
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Onam%20pookalam.jpg?width=800"
  },
  {
    slug: "ganesh-chaturthi",
    date2026: "2026-09-14",
    month: "SEP",
    name: "Ganesh Chaturthi",
    place: "Maharashtra & beyond",
    note: "Grand public and family celebrations dedicated to Lord Ganesha.",
    description: "Ganesh Chaturthi celebrates the birth of Lord Ganesha with elaborately decorated clay idols installed in homes and public pandals. The festival culminates in visarjan, a public procession where idols are ceremonially immersed in water, accompanied by music and dance.",
    duration: "10 days",
    relatedTempleSlugs: [],
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Ganesh%20Chaturthi%202010.jpg?width=800"
  },
  {
    slug: "navratri",
    date2026: "2026-10-11",
    month: "OCT",
    name: "Navratri",
    place: "Gujarat & across India",
    note: "Nine nights of devotion, dance and regional celebrations.",
    description: "Navratri honours the divine feminine across nine nights, each dedicated to a form of Goddess Durga. Gujarat is famous for Garba and Dandiya Raas dance celebrations, while other regions mark it with fasting, temple worship, and elaborate Durga Puja pandals.",
    duration: "9 nights",
    relatedTempleSlugs: ["meenakshi-amman"],
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Navratri%20Garba.jpg?width=800"
  },
  {
    slug: "durga-puja",
    date2026: "2026-10-17",
    month: "OCT",
    name: "Durga Puja",
    place: "Kolkata & West Bengal",
    note: "Bengal's grandest festival, honouring Goddess Durga's victory over evil.",
    description: "Durga Puja is West Bengal's largest festival, commemorating the goddess Durga's victory over the buffalo demon Mahishasura. Elaborately themed pandals rise across Kolkata's neighbourhoods, housing intricately sculpted clay idols of Durga with her children. The five main days close with Sindoor Khela and a riverside procession for the idols' immersion.",
    duration: "5 days",
    relatedTempleSlugs: [],
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Durga%20%28frontal%29%20Barisha%20Sarbojanin%202010%20Arnab%20Dutta.JPG?width=800"
  },
  {
    slug: "diwali",
    date2026: "2026-11-08",
    month: "OCT",
    name: "Diwali",
    place: "Across India",
    note: "Festival of lights with temple rituals and family traditions.",
    description: "Diwali, the festival of lights, celebrates the triumph of light over darkness. Homes and temples are illuminated with oil lamps and candles, families exchange sweets and gifts, and elaborate fireworks mark the night. Temples across India hold special evening aartis during the five-day celebration.",
    duration: "5 days",
    relatedTempleSlugs: ["tirupati", "akshardham-delhi"],
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Diwali%20Diyas%20Lamps.jpg?width=800"
  },
  {
    slug: "chhath-puja",
    date2026: "2026-11-15",
    month: "NOV",
    name: "Chhath Puja",
    place: "Bihar, Jharkhand & Eastern UP",
    note: "Ancient worship of the sun god at the banks of rivers and ponds.",
    description: "Chhath Puja is a rigorous four-day festival dedicated to the sun god Surya and Chhathi Maiya, observed mainly across Bihar, Jharkhand and eastern Uttar Pradesh. Devotees undertake a strict fast and stand in rivers or ponds at sunset and sunrise to offer arghya, surrounded by baskets of fruit, sugarcane and thekua sweets on decorated ghats.",
    duration: "4 days",
    relatedTempleSlugs: [],
    imageUrl: "/festivals/chhath-puja.png"
  }
];