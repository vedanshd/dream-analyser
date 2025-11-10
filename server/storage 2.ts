import { dreams, users, type User, type InsertUser, type Dream } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createDream(dream: Omit<Dream, "id" | "createdAt">): Promise<Dream>;
  getDream(id: number): Promise<Dream | undefined>;
  getAllDreams(): Promise<Dream[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private dreams: Map<number, Dream>;
  userCurrentId: number;
  dreamCurrentId: number;

  constructor() {
    this.users = new Map();
    this.dreams = new Map();
    this.userCurrentId = 1;
    this.dreamCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createDream(dream: Omit<Dream, "id" | "createdAt">): Promise<Dream> {
    const id = this.dreamCurrentId++;
    const createdAt = new Date();
    const newDream: Dream = { ...dream, id, createdAt };
    this.dreams.set(id, newDream);
    return newDream;
  }

  async getDream(id: number): Promise<Dream | undefined> {
    return this.dreams.get(id);
  }

  async getAllDreams(): Promise<Dream[]> {
    return Array.from(this.dreams.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
}

export const storage = new MemStorage();
