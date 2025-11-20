import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import type { Booking, InsertBooking } from "@shared/schema";

const BOOKINGS_COLLECTION = "bookings";

export async function createBookingFirebase(
  input: InsertBooking,
): Promise<Booking> {
  const id = crypto.randomUUID();
  const booking: Booking = {
    ...input,
    id,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  await addDoc(collection(db, BOOKINGS_COLLECTION), booking);
  return booking;
}

export async function getAllBookingsFirebase(): Promise<Booking[]> {
  const q = query(
    collection(db, BOOKINGS_COLLECTION),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  const bookings: Booking[] = [];

  snap.forEach((docSnap) => {
    bookings.push(docSnap.data() as Booking);
  });

  return bookings;
}

export async function updateBookingStatusFirebase(
  id: string,
  status: Booking["status"],
): Promise<void> {
  const q = query(
    collection(db, BOOKINGS_COLLECTION),
    where("id", "==", id),
  );
  const snap = await getDocs(q);
  if (snap.empty) return;

  const docRef = snap.docs[0].ref;
  await updateDoc(docRef, { status });
}

