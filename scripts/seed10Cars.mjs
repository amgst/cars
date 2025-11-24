import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Firebase client config – same as in client/src/lib/firebase.ts
const firebaseConfig = {
  apiKey: "AIzaSyCMdH8eoSXk9M8icxWB7cd3neS84faMbr0",
  authDomain: "cars-4ecea.firebaseapp.com",
  projectId: "cars-4ecea",
  storageBucket: "cars-4ecea.firebasestorage.app",
  messagingSenderId: "254741947742",
  appId: "1:254741947742:web:9cc7ec263ed8a8687c1bcf",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper function to generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  // Read the cars data from JSON file
  const dataPath = join(__dirname, "..", "data", "10-cars-data.json");
  console.log(`Reading cars data from ${dataPath}...`);
  
  const fileContent = readFileSync(dataPath, "utf-8");
  const cars = JSON.parse(fileContent);

  console.log(`Seeding ${cars.length} cars to Firestore...`);

  for (const car of cars) {
    // Generate slug from name
    const slug = generateSlug(car.name);
    
    // Prepare car data with slug
    const carData = {
      ...car,
      slug: slug,
    };

    try {
      // Add car to Firestore collection
      const docRef = await addDoc(collection(db, "cars"), carData);
      console.log(`✓ Saved car: ${car.name} (ID: ${docRef.id}, Slug: ${slug})`);
    } catch (error) {
      console.error(`✗ Failed to save car: ${car.name}`, error.message);
    }
  }

  console.log("\n✅ Done seeding cars to Firestore!");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});


