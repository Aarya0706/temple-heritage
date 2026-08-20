export type Festival = {
  month: string;
  name: string;
  place: string;
  note: string;
};

export const festivals: Festival[] = [
  { month: "JAN", name: "Makar Sankranti", place: "Across India", note: "A major solar festival celebrated with regional traditions." },
  { month: "MAR", name: "Maha Shivaratri", place: "Shiva temples nationwide", note: "Night-long worship and special temple ceremonies dedicated to Shiva." },
  { month: "APR", name: "Rama Navami", place: "Ayodhya & across India", note: "Celebration of the birth of Lord Rama." },
  { month: "AUG", name: "Janmashtami", place: "Mathura & Vrindavan", note: "Festivities celebrating the birth of Lord Krishna." },
  { month: "AUG", name: "Onam", place: "Kerala", note: "Kerala's harvest celebration with rich cultural traditions." },
  { month: "SEP", name: "Ganesh Chaturthi", place: "Maharashtra & beyond", note: "Grand public and family celebrations dedicated to Lord Ganesha." },
  { month: "OCT", name: "Navratri", place: "Gujarat & across India", note: "Nine nights of devotion, dance and regional celebrations." },
  { month: "OCT", name: "Diwali", place: "Across India", note: "Festival of lights with temple rituals and family traditions." }
];
