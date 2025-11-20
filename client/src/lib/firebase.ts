import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: For production, move these values to environment variables.
const firebaseConfig = {
  apiKey: "AIzaSyCMdH8eoSXk9M8icxWB7cd3neS84faMbr0",
  authDomain: "cars-4ecea.firebaseapp.com",
  projectId: "cars-4ecea",
  storageBucket: "cars-4ecea.firebasestorage.app",
  messagingSenderId: "254741947742",
  appId: "1:254741947742:web:9cc7ec263ed8a8687c1bcf",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);




