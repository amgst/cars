import { type User, type InsertUser, type Car, type InsertCar } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllCars(): Promise<Car[]>;
  getCar(id: string): Promise<Car | undefined>;
  createCar(car: InsertCar): Promise<Car>;
  updateCar(id: string, car: InsertCar): Promise<Car | undefined>;
  deleteCar(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private cars: Map<string, Car>;

  constructor() {
    this.users = new Map();
    this.cars = new Map();
    this.seedCars();
  }

  private seedCars() {
    const sampleCars: InsertCar[] = [
      {
        name: "Tesla Model 3",
        category: "Electric",
        description: "Experience the future of driving with the Tesla Model 3. This premium electric sedan combines cutting-edge technology, impressive range, and exhilarating performance in a sleek, modern package.",
        image: "/attached_assets/generated_images/Tesla_Model_3_sedan_123f6843.png",
        pricePerDay: 120,
        seats: 5,
        transmission: "Automatic",
        fuelType: "Electric",
        luggage: 2,
        doors: 4,
        year: 2024,
        hasGPS: true,
        hasBluetooth: true,
        hasAC: true,
        hasUSB: true,
        available: true,
      },
      {
        name: "BMW X5",
        category: "SUV",
        description: "The BMW X5 delivers luxury and versatility in perfect harmony. This premium SUV offers spacious seating, advanced technology, and powerful performance for both city driving and weekend adventures.",
        image: "/attached_assets/generated_images/BMW_X5_SUV_e9085a45.png",
        pricePerDay: 150,
        seats: 7,
        transmission: "Automatic",
        fuelType: "Petrol",
        luggage: 4,
        doors: 5,
        year: 2023,
        hasGPS: true,
        hasBluetooth: true,
        hasAC: true,
        hasUSB: true,
        available: true,
      },
      {
        name: "Toyota Camry",
        category: "Sedan",
        description: "The Toyota Camry is the perfect blend of reliability, comfort, and efficiency. This midsize sedan offers a smooth ride, excellent fuel economy, and all the features you need for daily driving.",
        image: "/attached_assets/generated_images/Toyota_Camry_sedan_a32cd876.png",
        pricePerDay: 80,
        seats: 5,
        transmission: "Automatic",
        fuelType: "Hybrid",
        luggage: 2,
        doors: 4,
        year: 2023,
        hasGPS: true,
        hasBluetooth: true,
        hasAC: true,
        hasUSB: false,
        available: true,
      },
      {
        name: "Mercedes-Benz S-Class",
        category: "Luxury",
        description: "Step into ultimate luxury with the Mercedes-Benz S-Class. This flagship sedan redefines premium driving with its exquisite craftsmanship, cutting-edge technology, and unparalleled comfort.",
        image: "/attached_assets/generated_images/Mercedes_S-Class_luxury_8b2e970a.png",
        pricePerDay: 250,
        seats: 5,
        transmission: "Automatic",
        fuelType: "Petrol",
        luggage: 3,
        doors: 4,
        year: 2024,
        hasGPS: true,
        hasBluetooth: true,
        hasAC: true,
        hasUSB: true,
        available: false,
      },
      {
        name: "Porsche 911",
        category: "Sports",
        description: "Unleash your passion for driving with the iconic Porsche 911. This legendary sports car delivers breathtaking performance, precise handling, and timeless design that turns every drive into an unforgettable experience.",
        image: "/attached_assets/generated_images/Porsche_911_sports_c1be3448.png",
        pricePerDay: 300,
        seats: 4,
        transmission: "Manual",
        fuelType: "Petrol",
        luggage: 1,
        doors: 2,
        year: 2024,
        hasGPS: true,
        hasBluetooth: true,
        hasAC: true,
        hasUSB: true,
        available: true,
      },
      {
        name: "Honda CR-V",
        category: "SUV",
        description: "The Honda CR-V is your ideal companion for family adventures. This versatile compact SUV combines practicality, safety, and comfort with excellent fuel efficiency and spacious interior.",
        image: "/attached_assets/generated_images/Honda_CR-V_compact_SUV_52dc1a4d.png",
        pricePerDay: 95,
        seats: 5,
        transmission: "Automatic",
        fuelType: "Petrol",
        luggage: 3,
        doors: 5,
        year: 2023,
        hasGPS: false,
        hasBluetooth: true,
        hasAC: true,
        hasUSB: true,
        available: true,
      },
    ];

    sampleCars.forEach((carData) => {
      const id = randomUUID();
      const car: Car = { ...carData, id };
      this.cars.set(id, car);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllCars(): Promise<Car[]> {
    return Array.from(this.cars.values());
  }

  async getCar(id: string): Promise<Car | undefined> {
    return this.cars.get(id);
  }

  async createCar(insertCar: InsertCar): Promise<Car> {
    const id = randomUUID();
    const car: Car = { ...insertCar, id };
    this.cars.set(id, car);
    return car;
  }

  async updateCar(id: string, insertCar: InsertCar): Promise<Car | undefined> {
    const existing = this.cars.get(id);
    if (!existing) {
      return undefined;
    }
    const updatedCar: Car = { ...insertCar, id };
    this.cars.set(id, updatedCar);
    return updatedCar;
  }

  async deleteCar(id: string): Promise<boolean> {
    return this.cars.delete(id);
  }
}

export const storage = new MemStorage();
