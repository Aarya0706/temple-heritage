export type Temple = {
  slug: string;
  name: string;
  deity: string;
  city: string;
  state: string;
  region: string;
  image: string;
  highlightImages: string[];
  shortDescription: string;
  description: string;
  timing: string;
  bestTime: string;
  type: string;
  highlights: string[];
};



// Wikimedia Commons image helper.
// The filenames below are from temple-specific Commons categories/files.
const commons = (fileName: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=1400`;

export const temples: Temple[] = [
  {
    slug: "meenakshi-amman",
    name: "Meenakshi Amman Temple",
    deity: "Goddess Meenakshi",
    city: "Madurai",
    state: "Tamil Nadu",
    region: "South India",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Meenakshi%20Amman%20Temple%2C%20Madurai.JPG?width=1400",
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Meenakshi%20Amman%20Temple%2C%20Madurai.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Inside%20the%20Thousand%20Pillar%20Hall%20Meenakshi%20Amman%20Temple%2C%20Madurai.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Meenakshi%20Amman%20temple%20in%20Madurai.JPG?width=1400",
      "https://m.economictimes.com/thumb/msid-62765938,width-1200,height-1200,resizemode-4,imgsize-95287/madurai-bcc.jpg",
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
    name: "Dwarkadhish Temple",
    deity: "Lord Krishna",
    city: "Dwarka",
    state: "Gujarat",
    region: "West India",
    image: "/images/dwarkadhish.png",
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Dwarkadhish%20Temple%2C%20Dwarka%2C%20Gujarat.JPG?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Dwarka%20temple%20Gomati%20ghat.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Guj21%20Dwarka%20Dwarkadhish%20Temple%20from%20Sudama%20Setu.jpg?width=1400",
      "https://www.margikayatra.com/DwMain.jpeg",
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
    name: "Jagannath Temple",
    deity: "Lord Jagannath",
    city: "Puri",
    state: "Odisha",
    region: "East India",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Shri%20Jagannath%20Temple%2CPuri.jpg?width=1400",
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Jagannath%20Puri.JPG?width=1400",
      "https://media.newindianexpress.com/newindianexpress%2F2024-07%2Fcaad25c0-1c80-4bf5-8ed0-f0a1c80c501e%2FSHRINIE.jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Queue%20-%20Jagannath%20Mandir%20-%20Grand%20Road%20-%20Puri%2020180126140232.jpg?width=1400",
      "https://indiatourism.travel/wp-content/uploads/2025/02/puri-attractions.webp",
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
    name: "Kashi Vishwanath Temple",
    deity: "Lord Shiva",
    city: "Varanasi",
    state: "Uttar Pradesh",
    region: "North India",
    image: "/images/kashi-vishwanath.png",
    highlightImages: [
      "https://pbs.twimg.com/media/GQTBHc4bQAATwhk.jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Aarti%2C%20Ganga%20Aarti%20at%20Dashashwamedh%20Ghat%2C%20Varanasi.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Dashashwamedh%20Ghat%2C%20Ganga%2C%20Varanasi.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Vishwanath%20Gali%2C%20in%20Varanasi.jpg?width=1400",
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
    name: "Kedarnath Temple",
    deity: "Lord Shiva",
    city: "Kedarnath",
    state: "Uttarakhand",
    region: "North India",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/The%20temple%20of%20Kedernath.jpg?width=1400",
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Kedarnath%20Temple%20at%20Dawn%20-%20OCT%202014.jpg?width=1400",
      "https://nextindiatimes.com/wp-content/uploads/2025/06/upruiy6g.png",
      "https://sanatan-os-mobile.vercel.app/apps/temples/data/temples/kedarnath/images/hero.png",
      "https://commons.wikimedia.org/wiki/Special:FilePath/The%20spiritual%20radiance%20of%20Kedarnath%20Temple%20at%20sunrise.jpg?width=1400",
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
    name: "Somnath Temple",
    deity: "Lord Shiva",
    city: "Somnath",
    state: "Gujarat",
    region: "West India",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Moonset%20at%20Somnath%20Temple.jpg?width=1400",
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Moonset%20at%20Somnath%20Temple.jpg?width=1400",
      "https://www.haribhoomi.com/h-upload/2025/10/11/1500x900_2534682-somnath.webp",
      "https://www.hindusthansamachar.in/Encyc/2025/10/19/213a61abd03dcd9df739cab33aa00cc4_776797236.jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/2015%20Somnath%20Jyotirlinga%20temple%20Prabhas%20Patan.jpg?width=1400",
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
    name: "Tirumala Venkateswara Temple",
    deity: "Lord Venkateswara",
    city: "Tirupati",
    state: "Andhra Pradesh",
    region: "South India",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/A%20View%20of%20Tirumala%20Venkateswara%20Temple.JPG?width=1400",
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Tirumala%20Venkateswara%20Temple%2C%20Tirupati%20%2823710086864%29.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Tirumala%20Venkateswara%20Temple%2C%20Tirupati%20%2824338261275%29.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Tirumala%20View%20from%20srivari%20padalu.jpg?width=1400",
      "https://2.bp.blogspot.com/_SrXUtdDZEE0/THunKfFT_cI/AAAAAAAABqg/cVB8A9GNM74/s1600/100_1427.JPG",
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
    name: "Mahakaleshwar Temple",
    deity: "Lord Shiva",
    city: "Ujjain",
    state: "Madhya Pradesh",
    region: "Central India",
    image: "/images/mahakaleshwar.png",
    highlightImages: [
      "https://images.hindustantimes.com/rf/image_size_640x362/HT/p2/2015/12/10/Pictures/devotees-celebration-thronged-festival-mahakal-thousands-occasion_6d9e47b2-9f37-11e5-b2ec-728a428a3282.jpg",
      "https://akm-img-a-in.tosshub.com/indiatoday/images/story/202210/Mahakal_Corridor_Drone_Shot-28_0_x.png?VersionId=f1bgJ.Olf2jH0BQ2H5KUEzdwzUadyyc3",
      "https://cms.patrika.com/wp-content/uploads/2022/10/04/mahakaleshwarujjain.jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Shri%20Mahakaleshwar%20Temple%20Ujjain%20-%20panoramio%20%282%29.jpg?width=1400",
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
    name: "Badrinath Temple",
    deity: "Lord Vishnu",
    city: "Badrinath",
    state: "Uttarakhand",
    region: "North India",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Badrinath%20Temple.JPG?width=1400",
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Badrinath%20Temple%20Pictures.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Badrinath%20Temple%20Tapt%20Kund%20hot%20springs.jpg?width=1400",
      "https://static2.tripoto.com/media/filter/tst/img/395815/Image/1651311313_1589272369_1589272343098.jpg.webp",
      "https://www.ketanjoshi.net/uploads/6/0/3/6/60363273/20180919-155418_orig.jpg",
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
    name: "Swaminarayan Akshardham",
    deity: "Lord Swaminarayan",
    city: "New Delhi",
    state: "Delhi",
    region: "North India",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Delhi%20Akshardham%20Temple.JPG?width=1400",
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Akshardham%2C%20Delhi.jpg?width=1400",
      "https://tripnetra.com/blog/wp-content/uploads/2019/10/Akshardham-fountain.jpg",
      "https://media.baps.dev/wp-content/uploads/2023/08/18001313/001-Vicharan-Robbinsville-July14-2023-scaled.jpg",
      "https://cdn.getyourguide.com/img/tour/04ab731a4cbe7e543ab2fd10f5af1a472b0ab24e151897cea241fa158a336e19.jpg/148.jpg",
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
    name: "Konark Sun Temple",
    deity: "Surya (Sun God)",
    city: "Konark",
    state: "Odisha",
    region: "East India",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/KONARK%20SUN%20TEMPLE.jpg?width=1400",
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/1%29Konark%20Sun%20Temple.jpg?width=1400",
      "https://www.oyorooms.com/blog/wp-content/uploads/2019/06/Memorable-Trip-to-Konark-Sun-Temple-Puri-City-1-Konark-Sun-Temple.jpg",
      "https://www.travelbaits.in/wp-content/uploads/2025/11/Konark-Sea-Beach_01-1024x600.jpg",
      "https://imagedelivery.net/dmcxpiIQ1lAgOmi_eg0IzQ/843d751a-1446-4051-9930-3f744227e100/public",
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
    name: "Brihadeeswarar Temple",
    deity: "Lord Shiva",
    city: "Thanjavur",
    state: "Tamil Nadu",
    region: "South India",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Brihadeeswarar%20Temple%20front%20view.JPG?width=1400",
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Beautiful%20view%20of%20the%20Brihadishvara%20Temple.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Thanjavur%20periya%20koil%20nandhi.jpg?width=1400",
      "https://images.gettyimages.com/gi-resources/images/500px/2018/2/17/CRS-Brihadeeswarar-Temple-Murals.jpg",
      "https://images.nativeplanet.com/hi/img/2017/11/23-1511423430-8.jpg",
    ],
    shortDescription: "A UNESCO World Heritage Chola-era temple famed for its towering vimana.",
    description: "Built by Raja Raja Chola I in the 11th century, Brihadeeswarar Temple is a masterpiece of Dravidian architecture, renowned for its massive vimana tower and intricate Chola-era sculpture.",
    timing: "6:00 AM – 12:30 PM, 4:00 PM – 8:30 PM",
    bestTime: "October – March",
    type: "Historic Temple",
    highlights: ["Vimana tower", "Nandi statue", "Chola frescoes", "Temple tank"]
  },
  {
    slug: "mallikarjuna",
    name: "Mallikarjuna Swamy Temple",
    deity: "Lord Shiva",
    city: "Srisailam",
    state: "Andhra Pradesh",
    region: "South India",
    image: "/images/mallikarjuna.png",
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Mallikarjuna%20Temple%20of%20Sri%20sailam.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Mallikarjuna%20Temple%2C%20Sri%20Sailam.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Nallamala%20Hills%20near%20Srisailam%2001.jpg?width=1400",
      "https://4.bp.blogspot.com/-zNOI1AB-Z3I/VOLp5SjQB4I/AAAAAAAAAJg/PFK6h2gKEfA/s1600/25.jpg",
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
    name: "Omkareshwar Temple",
    deity: "Lord Shiva",
    city: "Khandwa",
    state: "Madhya Pradesh",
    region: "Central India",
    image: "/images/omkareshwar.png",
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/0102621%20Omkareswar%20Jyothirlinga%20temple%2C%20Mandhata%20Madhya%20Pradesh%20005.jpg?width=1400",
      "https://revealinglies.s3.ap-south-1.amazonaws.com/uploads/images/202501/image_870x_678b446d0dadc.webp",
      "https://www.alightindia.com/cdn/uploads/postimages/ORIGINAL/omkareshwar%20Trip--420594.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/0102621_Mamleshwar_Temple%2C_Amareshwar_mandir%2C_Omkareshwar_Madhya_Pradesh_011.jpg/960px-0102621_Mamleshwar_Temple%2C_Amareshwar_mandir%2C_Omkareshwar_Madhya_Pradesh_011.jpg",
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
    name: "Bhimashankar Temple",
    deity: "Lord Shiva",
    city: "Bhimashankar",
    state: "Maharashtra",
    region: "West India",
    image: "/images/bhimashankar.png",
    highlightImages: [
      commons('Bhima sankar, Maharashtra.jpg'),
      commons('Bhima Shankar, Maharashtra.jpg'),
      commons('Bhimashankar 1.JPG'),
      commons('Bhimashankar trekking.jpg'),
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
    name: "Trimbakeshwar Temple",
    deity: "Lord Shiva",
    city: "Trimbak",
    state: "Maharashtra",
    region: "West India",
    image: "/images/trimbakeshwar.png",
    highlightImages: [
      commons('Trimbakeshwar Temple.jpg'),
      commons('Trimbakeshwar temple.jpg'),
      commons('Trimbakeshwar Temple , one of the 12 jyotirlings in India.jpg'),
      commons('Trimbhakeshwar Temple.jpg'),
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
    name: "Baba Baidyanath Temple",
    deity: "Lord Shiva",
    city: "Deoghar",
    state: "Jharkhand",
    region: "East India",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Baidyanath%20temple%20and%20temple%20complex%2C%20Deoghar%2001.jpg?width=1400",
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Baba%20Baidyanath%20Jyotirlinga%20Temple.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Baba%20Dham.jpg?width=1400",
      "https://utsav.gov.in/public/uploads/event_cover_image/event_695/16606476141886273131.jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Baidyanath%20temple%20and%20temple%20complex%2C%20Deoghar%2002.jpg?width=1400",
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
    name: "Nageshwar Jyotirlinga Temple",
    deity: "Lord Shiva",
    city: "Dwarka",
    state: "Gujarat",
    region: "West India",
    image: "/images/nageshwar.png",
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Nageshvar%20jyotirlinga%20temple%20Dwarka%20Gujarat.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Nageshvara%20colossal%20Shiva%20statue%20Dwarka%20Gujarat.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Nageshvar%20jyotirlinga%20temple%20near%20Dwarka%2C%20west%20of%20Jamnagar%20Gujarat.jpg?width=1400",
      "https://www.holidify.com/images/cmsuploads/compressed/shutterstock_1095414869_20200320100736_20200320100830.jpg",
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
    name: "Ramanathaswamy Temple",
    deity: "Lord Shiva",
    city: "Rameswaram",
    state: "Tamil Nadu",
    region: "South India",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ramanathaswamy%20Temple%2C%20Rameshwaram%2C%20Tamil%20Nadu.jpg?width=1400",
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ramanathaswamy%20Temple%20night%20view.jpg?width=1400",
      "https://rameshwaramtourism.co.in/images/v2/tourist-places/sri-ramanathaswamy-temple-rameshwaram/sri-ramanathaswamy-temple-rameshwaram-1.jpg",
      "https://images.deccanchronicle.com/dc-Cover-1ig9ufme8fj03sodnit2o8ips2-20190624012627.Medi.jpeg",
      "https://static.toiimg.com/thumb/58104411/Agni-Theertham.jpg?height=900&width=1200",
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
    name: "Grishneshwar Temple",
    deity: "Lord Shiva",
    city: "Chhatrapati Sambhajinagar",
    state: "Maharashtra",
    region: "West India",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Grishneshwar%20Temple.jpg?width=1400",
    highlightImages: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Grishneshwar%20Temple.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Grishneshwar%20Jyotirlinga%20Temple%2C%20Verul%20villag%2C%20Aurangabad%20district%2C%20Maharashtra%2C%20India%2002.jpg?width=1400",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ellora%20Caves.jpg?width=1400",
      "https://photos.wikimapia.org/p/00/00/20/93/13_big.jpg",
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