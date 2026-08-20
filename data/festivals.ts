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
};

export const festivals: Festival[] = [
  {
    slug: "makar-sankranti",
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
    slug: "rama-navami",
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
    slug: "janmashtami",
    month: "AUG",
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
    slug: "diwali",
    month: "OCT",
    name: "Diwali",
    place: "Across India",
    note: "Festival of lights with temple rituals and family traditions.",
    description: "Diwali, the festival of lights, celebrates the triumph of light over darkness. Homes and temples are illuminated with oil lamps and candles, families exchange sweets and gifts, and elaborate fireworks mark the night. Temples across India hold special evening aartis during the five-day celebration.",
    duration: "5 days",
    relatedTempleSlugs: ["tirupati", "akshardham-delhi"],
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Diwali%20Diyas%20Lamps.jpg?width=800"
  }
];