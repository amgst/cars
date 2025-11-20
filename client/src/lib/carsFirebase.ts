import { db } from "./firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import type { Car, InsertCar } from "@shared/schema";

const CARS_COLLECTION = "cars";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ensureArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

export async function getAllCarsFirebase(): Promise<Car[]> {
  const snap = await getDocs(collection(db, CARS_COLLECTION));
  const cars: Car[] = [];

  snap.forEach((docSnap) => {
    const data = docSnap.data() as Car;
    // Ensure images is always an array
    cars.push({
      ...data,
      images: ensureArray(data.images as any),
    });
  });

  return cars;
}

export async function getCarBySlugFirebase(slug: string): Promise<Car | undefined> {
  const q = query(
    collection(db, CARS_COLLECTION),
    where("slug", "==", slug),
  );
  const snap = await getDocs(q);
  if (snap.empty) return undefined;

  const data = snap.docs[0].data() as Car;
  return {
    ...data,
    images: ensureArray(data.images as any),
  };
}

export async function getCarByIdFirebase(id: string): Promise<Car | undefined> {
  const q = query(
    collection(db, CARS_COLLECTION),
    where("id", "==", id),
  );
  const snap = await getDocs(q);
  if (snap.empty) return undefined;

  const data = snap.docs[0].data() as Car;
  return {
    ...data,
    images: ensureArray(data.images as any),
  };
}

export async function createCarFirebase(input: InsertCar): Promise<Car> {
  const id = crypto.randomUUID();
  const slug = generateSlug(input.name);

  const car: Car = {
    ...(input as any),
    id,
    slug,
    images: ensureArray(input.images as any),
  };

  await addDoc(collection(db, CARS_COLLECTION), car);
  return car;
}

export async function updateCarFirebase(id: string, input: InsertCar): Promise<Car | undefined> {
  const q = query(
    collection(db, CARS_COLLECTION),
    where("id", "==", id),
  );
  const snap = await getDocs(q);
  if (snap.empty) return undefined;

  const docRef = snap.docs[0].ref;
  const slug = generateSlug(input.name);

  const updated: Car = {
    ...(input as any),
    id,
    slug,
    images: ensureArray(input.images as any),
  };

  await updateDoc(docRef, updated as any);
  return updated;
}

export async function deleteCarFirebase(id: string): Promise<boolean> {
  const q = query(
    collection(db, CARS_COLLECTION),
    where("id", "==", id),
  );
  const snap = await getDocs(q);
  if (snap.empty) return false;

  const docRef = snap.docs[0].ref;
  await deleteDoc(docRef);
  return true;
}






