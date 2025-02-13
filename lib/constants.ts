export const romanticShayaris = [
  "Tum paas ho ya door ho, mere dil mein ho tum,\nHar saans mein teri khushboo, mere dil mein ho tum.",
  "Mohabbat ki kashti ko kinara mile na mile,\nLekin har safar mein tumhara saath chahiye.",
  "Tumhe dekh kar dil mein jo halchal machi hai,\nWo pehli mohabbat ki pehli kahani hai.",
  "Kuch toh hai tere mere darmiyaan,\nTu hai to hai meri har dhadkan.",
  "Tere ishq mein main kho gaya hoon,\nTeri yaad mein main so gaya hoon.",
  "Har lamha tujhe yaad karta hoon,\nTere pyaar mein barbad karta hoon.",
  "Tum mere pass ho ya na ho,\nMere dil mein hamesha rehte ho.",
  "Ishq ki raah mein rukawat na ho,\nTere mere pyaar mein koi shikayat na ho.",
  "Tere bina jeena mumkin nahi,\nTere bina jeena mushkil sahi.",
  "Mohabbat ki raah mein chalte hain,\nTere liye har gham sehte hain."
];

export type Question = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
  time_limit?: number;
  correct_answer?: number;
};

export type Quiz = {
  id: string;
  creatorName: string;
  questions: Question[];
  created: Date;
  expires: Date;
};