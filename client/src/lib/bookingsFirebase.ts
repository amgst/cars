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
  try {
    console.log("Creating booking with data:", input);
    
    // Validate required fields
    if (!input.carId || !input.carName || !input.startDate || !input.endDate) {
      throw new Error("Missing required booking fields");
    }
    
    if (!input.firstName || !input.lastName || !input.email || !input.phone) {
      throw new Error("Missing required contact information");
    }
    
    const id = crypto.randomUUID();
    // Clean up the booking data - ensure optional fields are handled properly
    const booking: Booking = {
      carId: input.carId,
      carName: input.carName,
      startDate: input.startDate,
      endDate: input.endDate,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      address: input.address || "",
      notes: input.notes || "",
      totalPrice: input.totalPrice || 0,
      id,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    console.log("Saving booking to Firestore:", booking);
    const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), booking);
    console.log("Booking saved successfully with document ID:", docRef.id);
    
    return booking;
  } catch (error) {
    console.error("Error creating booking in Firestore:", error);
    if (error instanceof Error) {
      // Provide more specific error messages
      if (error.message.includes("permission")) {
        throw new Error("Permission denied. Please check Firestore security rules.");
      }
      if (error.message.includes("network")) {
        throw new Error("Network error. Please check your connection and try again.");
      }
      throw new Error(`Failed to create booking: ${error.message}`);
    }
    throw new Error("Failed to create booking. Please try again.");
  }
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

export async function getBookingsByCarFirebase(carId: string): Promise<Booking[]> {
  const q = query(
    collection(db, BOOKINGS_COLLECTION),
    where("carId", "==", carId),
    orderBy("startDate", "asc"),
  );
  const snap = await getDocs(q);
  const bookings: Booking[] = [];

  snap.forEach((docSnap) => {
    bookings.push(docSnap.data() as Booking);
  });

  return bookings;
}

