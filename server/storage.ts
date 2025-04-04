import { db } from './db';
import { eq, and } from 'drizzle-orm';
import * as schema from '../shared/schema';
import type { InsertUser, InsertService, InsertBooking, InsertReview, InsertMessage, InsertCategory, InsertEventType, InsertServiceEventType, InsertServiceTag } from '../shared/schema';
import session from 'express-session';
import createMemoryStore from 'memorystore';

const MemoryStore = createMemoryStore(session);

export const storage = {
  // Session store
  sessionStore: new MemoryStore({
    checkPeriod: 86400000, // prune expired entries every 24h
  }),
  // User operations
  async createUser(userData: InsertUser) {
    const [user] = await db.insert(schema.users).values(userData).returning();
    return user;
  },

  async getUser(id: number) {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user;
  },

  async getUserByUsername(username: string) {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return user;
  },

  async getUserByEmail(email: string): Promise<schema.User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));
    return user;
  },

  async updateUser(id: number, userUpdate: Partial<schema.User>): Promise<schema.User | undefined> {
    const [user] = await db.update(schema.users).set(userUpdate).where(eq(schema.users.id, id)).returning();
    return user;
  },


  // Category operations
  async getCategories(): Promise<schema.Category[]> {
    return await db.select().from(schema.categories);
  },

  async getCategoryById(id: number): Promise<schema.Category | undefined> {
    const [category] = await db.select().from(schema.categories).where(eq(schema.categories.id, id));
    return category;
  },

  async createCategory(category: InsertCategory): Promise<schema.Category> {
    const [newCategory] = await db.insert(schema.categories).values(category).returning();
    return newCategory;
  },

  // Event type operations
  async getEventTypes(): Promise<schema.EventType[]> {
    return await db.select().from(schema.eventTypes);
  },

  async getEventTypeById(id: number): Promise<schema.EventType | undefined> {
    const [eventType] = await db.select().from(schema.eventTypes).where(eq(schema.eventTypes.id, id));
    return eventType;
  },

  async createEventType(eventType: InsertEventType): Promise<schema.EventType> {
    const [newEventType] = await db.insert(schema.eventTypes).values(eventType).returning();
    return newEventType;
  },

  // Service operations
  async getServices(filter?: Partial<schema.Service>): Promise<schema.Service[]> {
    let query = db.select().from(schema.services);
    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        query = query.where(eq(schema.services[key as keyof schema.Service], value));
      }
    }
    return await query;
  },

  async getServiceById(id: number): Promise<schema.Service | undefined> {
    const [service] = await db.select().from(schema.services).where(eq(schema.services.id, id));
    return service;
  },

  async getServicesByUserId(userId: number): Promise<schema.Service[]> {
    return await db.select().from(schema.services).where(eq(schema.services.userId, userId));
  },

  async getServicesByCategory(categoryId: number): Promise<schema.Service[]> {
    return await db.select().from(schema.services).where(eq(schema.services.categoryId, categoryId));
  },

  async getFeaturedServices(): Promise<schema.Service[]> {
    return await db.select().from(schema.services).where(eq(schema.services.featured, true));
  },

  async createService(serviceData: InsertService): Promise<schema.Service> {
    const [service] = await db.insert(schema.services).values(serviceData).returning();
    return service;
  },

  async updateService(id: number, serviceData: Partial<schema.Service>): Promise<schema.Service | undefined> {
    const [service] = await db.update(schema.services)
      .set(serviceData)
      .where(eq(schema.services.id, id))
      .returning();
    return service;
  },

  async deleteService(id: number): Promise<boolean> {
    const result = await db.delete(schema.services).where(eq(schema.services.id, id));
    return result.rowsAffected > 0;
  },

  // Service Event Type operations
  async createServiceEventType(serviceEventType: InsertServiceEventType): Promise<schema.ServiceEventType> {
    const [newServiceEventType] = await db.insert(schema.serviceEventTypes).values(serviceEventType).returning();
    return newServiceEventType;
  },

  async getServiceEventTypesByServiceId(serviceId: number): Promise<schema.ServiceEventType[]> {
    return await db.select().from(schema.serviceEventTypes).where(eq(schema.serviceEventTypes.serviceId, serviceId));
  },


  // Service Tags operations
  async createServiceTag(serviceTag: InsertServiceTag): Promise<schema.ServiceTag> {
    const [newServiceTag] = await db.insert(schema.serviceTags).values(serviceTag).returning();
    return newServiceTag;
  },

  async getServiceTagsByServiceId(serviceId: number): Promise<schema.ServiceTag[]> {
    return await db.select().from(schema.serviceTags).where(eq(schema.serviceTags.serviceId, serviceId));
  },

  // Review operations
  async createReview(reviewData: InsertReview): Promise<schema.Review> {
    const [review] = await db.insert(schema.reviews).values(reviewData).returning();
    return review;
  },

  async getReviewsByServiceId(serviceId: number): Promise<schema.Review[]> {
    return await db.select().from(schema.reviews).where(eq(schema.reviews.serviceId, serviceId));
  },

  async getReviewsByUserId(userId: number): Promise<schema.Review[]> {
    return await db.select().from(schema.reviews).where(eq(schema.reviews.userId, userId));
  },

  // Booking operations
  async createBooking(bookingData: InsertBooking): Promise<schema.Booking> {
    const [booking] = await db.insert(schema.bookings).values(bookingData).returning();
    return booking;
  },

  async getBookingById(id: number): Promise<schema.Booking | undefined> {
    const [booking] = await db.select().from(schema.bookings).where(eq(schema.bookings.id, id));
    return booking;
  },

  async getBookingsByUserId(userId: number): Promise<schema.Booking[]> {
    return await db.select().from(schema.bookings).where(eq(schema.bookings.userId, userId));
  },

  async getBookingsByServiceId(serviceId: number): Promise<schema.Booking[]> {
    return await db.select().from(schema.bookings).where(eq(schema.bookings.serviceId, serviceId));
  },

  async updateBookingStatus(id: number, status: string): Promise<schema.Booking | undefined> {
    const [booking] = await db.update(schema.bookings)
      .set({ status })
      .where(eq(schema.bookings.id, id))
      .returning();
    return booking;
  },

  // Message operations
  async createMessage(messageData: InsertMessage): Promise<schema.Message> {
    const [message] = await db.insert(schema.messages).values(messageData).returning();
    return message;
  },

  async getMessagesByUserId(userId: number): Promise<schema.Message[]> {
    return await db.select().from(schema.messages)
      .where(eq(schema.messages.fromUserId, userId))
      .or(eq(schema.messages.toUserId, userId));
  },

  async getMessagesByBookingId(bookingId: number): Promise<schema.Message[]> {
    return await db.select().from(schema.messages).where(eq(schema.messages.bookingId, bookingId));
  },

  async getConversation(user1Id: number, user2Id: number): Promise<schema.Message[]> {
    return await db.select().from(schema.messages)
      .where(
        and(eq(schema.messages.fromUserId, user1Id), eq(schema.messages.toUserId, user2Id))
        .or(
          and(eq(schema.messages.fromUserId, user2Id), eq(schema.messages.toUserId, user1Id))
        )
      )
      .orderBy(schema.messages.createdAt);
  },

  async markMessageAsRead(id: number): Promise<schema.Message | undefined> {
    const [message] = await db.update(schema.messages)
      .set({ read: true })
      .where(eq(schema.messages.id, id))
      .returning();
    return message;
  }
};