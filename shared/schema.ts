import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cars = pgTable("cars", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  pricePerDay: integer("price_per_day").notNull(),
  seats: integer("seats").notNull(),
  transmission: text("transmission").notNull(),
  fuelType: text("fuel_type").notNull(),
  luggage: integer("luggage").notNull(),
  doors: integer("doors").notNull(),
  year: integer("year").notNull(),
  hasGPS: boolean("has_gps").notNull().default(false),
  hasBluetooth: boolean("has_bluetooth").notNull().default(false),
  hasAC: boolean("has_ac").notNull().default(true),
  hasUSB: boolean("has_usb").notNull().default(false),
  available: boolean("available").notNull().default(true),
});

export const insertCarSchema = createInsertSchema(cars).omit({
  id: true,
  slug: true,
});

export type InsertCar = z.infer<typeof insertCarSchema>;
export type Car = typeof cars.$inferSelect;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
