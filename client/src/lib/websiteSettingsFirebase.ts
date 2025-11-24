import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

const WEBSITE_SETTINGS_DOC = "website_settings";
const WEBSITE_SETTINGS_ID = "default";

export interface WebsiteSettings {
  websiteName: string;
  logo: string; // URL or path to logo
  favicon: string; // URL or path to favicon
  companyName: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

const defaultWebsiteSettings: WebsiteSettings = {
  websiteName: "Premium Car Rentals Australia",
  logo: "",
  favicon: "/favicon.png",
  companyName: "Premium Car Rentals Australia",
  email: "info@premiumcarrentals.com.au",
  phone: "+61 2 9999 8888",
  address: "123 Premium Street, Sydney, NSW 2000, Australia",
  description: "Australia's premier car rental service offering luxury vehicles, premium sedans, SUVs, and sports cars. Book your perfect vehicle for your Australian adventure with exceptional service and competitive rates.",
  facebookUrl: "",
  twitterUrl: "",
  instagramUrl: "",
  linkedinUrl: "",
  metaDescription: "Premium car rental in Australia. Choose from luxury sedans, SUVs, sports cars and more. Best rates, flexible bookings, and exceptional service across Sydney, Melbourne, Brisbane, Perth, and Adelaide. Book your dream car today.",
  metaKeywords: "car rental Australia, luxury car hire Australia, premium car rental Sydney, car hire Melbourne, rent car Brisbane, vehicle rental Perth, car rental Adelaide, Australia car hire, premium vehicles Australia, luxury cars Australia",
};

/**
 * Get website settings from Firebase
 */
export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  try {
    const docRef = doc(db, WEBSITE_SETTINGS_DOC, WEBSITE_SETTINGS_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as WebsiteSettings;
      // Merge with defaults to ensure all fields exist
      return { ...defaultWebsiteSettings, ...data };
    }
    
    // Return defaults if no settings exist
    return defaultWebsiteSettings;
  } catch (error) {
    console.error("Error fetching website settings:", error);
    return defaultWebsiteSettings;
  }
}

/**
 * Save website settings to Firebase
 */
export async function saveWebsiteSettings(
  settings: WebsiteSettings
): Promise<void> {
  try {
    console.log("Attempting to save website settings:", settings);
    const docRef = doc(db, WEBSITE_SETTINGS_DOC, WEBSITE_SETTINGS_ID);
    
    // Clean up the data - remove undefined values and ensure all required fields exist
    const dataToSave: Record<string, any> = {
      websiteName: settings.websiteName || "",
      logo: settings.logo || "",
      favicon: settings.favicon || "/favicon.png",
      companyName: settings.companyName || "",
      email: settings.email || "",
      phone: settings.phone || "",
      address: settings.address || "",
      description: settings.description || "",
    };

    // Only include optional fields if they have values (Firestore doesn't accept undefined)
    if (settings.facebookUrl && settings.facebookUrl.trim()) {
      dataToSave.facebookUrl = settings.facebookUrl;
    }
    if (settings.twitterUrl && settings.twitterUrl.trim()) {
      dataToSave.twitterUrl = settings.twitterUrl;
    }
    if (settings.instagramUrl && settings.instagramUrl.trim()) {
      dataToSave.instagramUrl = settings.instagramUrl;
    }
    if (settings.linkedinUrl && settings.linkedinUrl.trim()) {
      dataToSave.linkedinUrl = settings.linkedinUrl;
    }
    if (settings.metaDescription && settings.metaDescription.trim()) {
      dataToSave.metaDescription = settings.metaDescription;
    }
    if (settings.metaKeywords && settings.metaKeywords.trim()) {
      dataToSave.metaKeywords = settings.metaKeywords;
    }

    console.log("Data to save to Firestore:", dataToSave);
    await setDoc(docRef, dataToSave, { merge: true });
    console.log("Successfully saved website settings to Firestore");
  } catch (error) {
    console.error("Error saving website settings:", error);
    // Provide more detailed error information
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      throw new Error(`Failed to save website settings: ${error.message}`);
    } else {
      const errorStr = String(error);
      throw new Error(`Failed to save website settings: ${errorStr}`);
    }
  }
}
