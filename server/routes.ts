import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertServiceSchema, insertServiceTagSchema, insertBookingSchema, insertMessageSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";
import { getUploadMiddleware } from "./utils/upload";
import path from "path";
import express from "express";
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  const httpServer = createServer(app);

  // Categories API
  app.get("/api/categories", async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.get("/api/categories/:id", async (req, res) => {
    const category = await storage.getCategoryById(Number(req.params.id));
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  });

  // Event Types API
  app.get("/api/event-types", async (req, res) => {
    const eventTypes = await storage.getEventTypes();
    res.json(eventTypes);
  });

  app.get("/api/event-types/:id", async (req, res) => {
    const eventType = await storage.getEventTypeById(Number(req.params.id));
    if (!eventType) return res.status(404).json({ message: "Event type not found" });
    res.json(eventType);
  });

  // Services API
  app.get("/api/services", async (req, res) => {
    let services;
    if (req.query.featured === "true") {
      services = await storage.getFeaturedServices();
    } else if (req.query.categoryId) {
      services = await storage.getServicesByCategory(Number(req.query.categoryId));
    } else {
      services = await storage.getServices();
    }
    res.json(services);
  });

  app.get("/api/services/:id", async (req, res) => {
    const service = await storage.getServiceById(Number(req.params.id));
    if (!service) return res.status(404).json({ message: "Service not found" });
    
    // Get service tags
    const tags = await storage.getServiceTagsByServiceId(service.id);
    
    // Get service event types
    const serviceEventTypes = await storage.getServiceEventTypesByServiceId(service.id);
    
    // Get business owner info
    const owner = await storage.getUser(service.userId);
    if (!owner) return res.status(404).json({ message: "Service provider not found" });
    
    // Remove sensitive data
    const { password, ...ownerWithoutPassword } = owner;
    
    res.json({
      ...service,
      tags: tags.map(tag => tag.tag),
      eventTypes: serviceEventTypes.map(set => set.eventTypeId),
      owner: ownerWithoutPassword
    });
  });

  app.post("/api/services", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    if (req.user?.userType !== "business") return res.status(403).json({ message: "Only business users can create services" });
    
    try {
      const parsedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService({
        ...parsedData,
        userId: req.user.id
      });
      
      // Handle event types
      if (req.body.eventTypes && Array.isArray(req.body.eventTypes)) {
        for (const eventTypeId of req.body.eventTypes) {
          await storage.createServiceEventType({
            serviceId: service.id,
            eventTypeId: Number(eventTypeId)
          });
        }
      }
      
      // Handle tags
      if (req.body.tags && Array.isArray(req.body.tags)) {
        for (const tag of req.body.tags) {
          await storage.createServiceTag({
            serviceId: service.id,
            tag: tag
          });
        }
      }
      
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid service data", errors: error.errors });
      }
      throw error;
    }
  });

  app.put("/api/services/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    const serviceId = Number(req.params.id);
    const service = await storage.getServiceById(serviceId);
    
    if (!service) return res.status(404).json({ message: "Service not found" });
    if (service.userId !== req.user?.id) return res.status(403).json({ message: "You can only update your own services" });
    
    try {
      const updatedService = await storage.updateService(serviceId, req.body);
      res.json(updatedService);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid service data", errors: error.errors });
      }
      throw error;
    }
  });

  app.delete("/api/services/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    const serviceId = Number(req.params.id);
    const service = await storage.getServiceById(serviceId);
    
    if (!service) return res.status(404).json({ message: "Service not found" });
    if (service.userId !== req.user?.id) return res.status(403).json({ message: "You can only delete your own services" });
    
    await storage.deleteService(serviceId);
    res.status(204).send();
  });

  // Business services
  app.get("/api/business/services", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    if (req.user?.userType !== "business") return res.status(403).json({ message: "Only business users can access this endpoint" });
    
    const services = await storage.getServicesByUserId(req.user.id);
    res.json(services);
  });

  // Reviews API
  app.get("/api/services/:id/reviews", async (req, res) => {
    const serviceId = Number(req.params.id);
    const reviews = await storage.getReviewsByServiceId(serviceId);
    
    // Get user info for each review
    const reviewsWithUser = await Promise.all(reviews.map(async (review) => {
      const user = await storage.getUser(review.userId);
      if (!user) return { ...review, user: null };
      
      const { password, ...userWithoutPassword } = user;
      return {
        ...review,
        user: userWithoutPassword
      };
    }));
    
    res.json(reviewsWithUser);
  });

  app.post("/api/services/:id/reviews", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    if (req.user?.userType !== "customer") return res.status(403).json({ message: "Only customers can post reviews" });
    
    const serviceId = Number(req.params.id);
    const service = await storage.getServiceById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });
    
    try {
      const parsedData = insertReviewSchema.parse({
        ...req.body,
        userId: req.user.id,
        serviceId
      });
      
      const review = await storage.createReview(parsedData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      throw error;
    }
  });

  // Bookings API
  app.get("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    let bookings;
    if (req.user?.userType === "customer") {
      bookings = await storage.getBookingsByUserId(req.user.id);
    } else if (req.user?.userType === "business") {
      // Get all services owned by this business
      const services = await storage.getServicesByUserId(req.user.id);
      const serviceIds = services.map(service => service.id);
      
      // Get bookings for all services
      bookings = [];
      for (const serviceId of serviceIds) {
        const serviceBookings = await storage.getBookingsByServiceId(serviceId);
        bookings.push(...serviceBookings);
      }
    } else {
      return res.status(403).json({ message: "Invalid user type" });
    }
    
    // Enrich booking data with service and customer info
    const enrichedBookings = await Promise.all(bookings.map(async (booking) => {
      const service = await storage.getServiceById(booking.serviceId);
      const customer = await storage.getUser(booking.userId);
      
      if (!service || !customer) return booking;
      
      const { password, ...customerWithoutPassword } = customer;
      
      return {
        ...booking,
        service,
        customer: customerWithoutPassword
      };
    }));
    
    res.json(enrichedBookings);
  });

  app.post("/api/services/:id/book", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    if (req.user?.userType !== "customer") return res.status(403).json({ message: "Only customers can book services" });
    
    const serviceId = Number(req.params.id);
    const service = await storage.getServiceById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });
    
    try {
      const parsedData = insertBookingSchema.parse({
        ...req.body,
        userId: req.user.id,
        serviceId
      });
      
      const booking = await storage.createBooking(parsedData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      throw error;
    }
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    const bookingId = Number(req.params.id);
    const booking = await storage.getBookingById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    
    const service = await storage.getServiceById(booking.serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });
    
    // Validate status update permissions
    if (req.user?.userType === "business" && service.userId !== req.user.id) {
      return res.status(403).json({ message: "You can only update bookings for your own services" });
    }
    
    if (req.user?.userType === "customer" && booking.userId !== req.user.id) {
      return res.status(403).json({ message: "You can only update your own bookings" });
    }
    
    const { status } = req.body;
    if (!status || !["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    const updatedBooking = await storage.updateBookingStatus(bookingId, status);
    res.json(updatedBooking);
  });

  // Messages API
  app.get("/api/messages", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    const messages = await storage.getMessagesByUserId(req.user!.id);
    
    // Group messages by conversation
    const conversations = messages.reduce((acc, message) => {
      const otherUserId = message.fromUserId === req.user!.id ? message.toUserId : message.fromUserId;
      if (!acc[otherUserId]) {
        acc[otherUserId] = [];
      }
      acc[otherUserId].push(message);
      return acc;
    }, {} as Record<number, typeof messages>);
    
    // Get info about the other user for each conversation
    const conversationsWithUserInfo = await Promise.all(
      Object.entries(conversations).map(async ([otherUserId, messages]) => {
        const otherUser = await storage.getUser(Number(otherUserId));
        if (!otherUser) return null;
        
        const { password, ...otherUserWithoutPassword } = otherUser;
        
        // Sort messages by createdAt
        const sortedMessages = [...messages].sort((a, b) => 
          (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
        const lastMessage = sortedMessages[sortedMessages.length - 1];
        
        // Count unread messages
        const unreadCount = sortedMessages.filter(m => !m.read && m.toUserId === req.user!.id).length;
        
        return {
          otherUser: otherUserWithoutPassword,
          lastMessage,
          unreadCount
        };
      })
    );
    
    // Remove null values
    const validConversations = conversationsWithUserInfo.filter(Boolean);
    
    res.json(validConversations);
  });

  app.get("/api/messages/:userId", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    const otherUserId = Number(req.params.userId);
    const otherUser = await storage.getUser(otherUserId);
    if (!otherUser) return res.status(404).json({ message: "User not found" });
    
    const conversation = await storage.getConversation(req.user!.id, otherUserId);
    
    // Mark all messages from other user as read
    for (const message of conversation) {
      if (message.toUserId === req.user!.id && !message.read) {
        await storage.markMessageAsRead(message.id);
      }
    }
    
    // Get updated conversation
    const updatedConversation = await storage.getConversation(req.user!.id, otherUserId);
    
    res.json(updatedConversation);
  });

  app.post("/api/messages/:userId", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    const toUserId = Number(req.params.userId);
    const recipient = await storage.getUser(toUserId);
    if (!recipient) return res.status(404).json({ message: "Recipient not found" });
    
    try {
      const parsedData = insertMessageSchema.parse({
        ...req.body,
        fromUserId: req.user!.id,
        toUserId
      });
      
      const message = await storage.createMessage(parsedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      throw error;
    }
  });

  // Serve static files from uploads directory
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  // Upload image endpoints
  const uploadMiddleware = getUploadMiddleware();

  // Upload service images endpoint
  app.post('/api/services/:id/images', 
    (req, res, next) => {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      if (req.user?.userType !== "business") return res.status(403).json({ message: "Only business users can upload images" });
      next();
    },
    uploadMiddleware.array('images', 5), // Allow up to 5 images
    async (req, res) => {
      try {
        const serviceId = Number(req.params.id);
        const service = await storage.getServiceById(serviceId);
        
        if (!service) return res.status(404).json({ message: "Service not found" });
        if (service.userId !== req.user?.id) return res.status(403).json({ message: "You can only upload images to your own services" });
        
        // Get file paths from multer
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
          return res.status(400).json({ message: "No images uploaded" });
        }
        
        // Get image URLs
        const imageUrls = files.map(file => {
          if ('path' in file) {
            return file.path.startsWith('http') ? file.path : `/uploads/${path.basename(file.path)}`;
          } else if ('filename' in file) {
            return `/uploads/${(file as any).filename}`;
          }
          return `/uploads/unknown-file-${Date.now()}`;
        });
        
        // Update service with new images
        const currentImages = service.images as string[] || [];
        const updatedService = await storage.updateService(serviceId, {
          images: [...currentImages, ...imageUrls]
        });
        
        res.json(updatedService);
      } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({ message: "Failed to upload images", error: (error as Error).message });
      }
    }
  );

  // Upload profile image endpoint
  app.post('/api/profile/image', 
    (req, res, next) => {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      next();
    },
    uploadMiddleware.single('profileImage'),
    async (req, res) => {
      try {
        const file = req.file as Express.Multer.File;
        if (!file) {
          return res.status(400).json({ message: "No image uploaded" });
        }
        
        // Get image URL
        const imageUrl = 'path' in file && file.path.startsWith('http') 
          ? file.path 
          : `/uploads/${path.basename(file.path)}`;
        
        // Update user with new profile image
        const updatedUser = await storage.updateUser(req.user!.id, {
          profileImage: imageUrl
        });
        
        if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
        }
        
        const { password, ...userWithoutPassword } = updatedUser;
        res.json(userWithoutPassword);
      } catch (error) {
        console.error('Profile image upload error:', error);
        res.status(500).json({ message: "Failed to upload profile image", error: (error as Error).message });
      }
    }
  );
  
  // Add service package endpoint
  app.post('/api/services/:id/packages', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    if (req.user?.userType !== "business") return res.status(403).json({ message: "Only business users can add packages" });
    
    try {
      const serviceId = Number(req.params.id);
      const service = await storage.getServiceById(serviceId);
      
      if (!service) return res.status(404).json({ message: "Service not found" });
      if (service.userId !== req.user?.id) return res.status(403).json({ message: "You can only add packages to your own services" });
      
      const packageData = req.body;
      if (!packageData.name || !packageData.description || packageData.price === undefined || !packageData.features) {
        return res.status(400).json({ message: "Invalid package data. Required fields: name, description, price, features" });
      }
      
      // Update service with new package
      const currentPackages = service.packages as any[] || [];
      const updatedService = await storage.updateService(serviceId, {
        packages: [...currentPackages, packageData]
      });
      
      res.json(updatedService);
    } catch (error) {
      console.error('Add package error:', error);
      res.status(500).json({ message: "Failed to add package", error: (error as Error).message });
    }
  });
  
  // Update service package endpoint
  app.put('/api/services/:id/packages/:index', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    if (req.user?.userType !== "business") return res.status(403).json({ message: "Only business users can update packages" });
    
    try {
      const serviceId = Number(req.params.id);
      const packageIndex = Number(req.params.index);
      const service = await storage.getServiceById(serviceId);
      
      if (!service) return res.status(404).json({ message: "Service not found" });
      if (service.userId !== req.user?.id) return res.status(403).json({ message: "You can only update packages for your own services" });
      
      const currentPackages = service.packages as any[] || [];
      if (packageIndex < 0 || packageIndex >= currentPackages.length) {
        return res.status(404).json({ message: "Package not found" });
      }
      
      const packageData = req.body;
      currentPackages[packageIndex] = {
        ...currentPackages[packageIndex],
        ...packageData
      };
      
      const updatedService = await storage.updateService(serviceId, {
        packages: currentPackages
      });
      
      res.json(updatedService);
    } catch (error) {
      console.error('Update package error:', error);
      res.status(500).json({ message: "Failed to update package", error: (error as Error).message });
    }
  });
  
  // Delete service package endpoint
  app.delete('/api/services/:id/packages/:index', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    if (req.user?.userType !== "business") return res.status(403).json({ message: "Only business users can delete packages" });
    
    try {
      const serviceId = Number(req.params.id);
      const packageIndex = Number(req.params.index);
      const service = await storage.getServiceById(serviceId);
      
      if (!service) return res.status(404).json({ message: "Service not found" });
      if (service.userId !== req.user?.id) return res.status(403).json({ message: "You can only delete packages from your own services" });
      
      const currentPackages = service.packages as any[] || [];
      if (packageIndex < 0 || packageIndex >= currentPackages.length) {
        return res.status(404).json({ message: "Package not found" });
      }
      
      currentPackages.splice(packageIndex, 1);
      
      const updatedService = await storage.updateService(serviceId, {
        packages: currentPackages
      });
      
      res.json(updatedService);
    } catch (error) {
      console.error('Delete package error:', error);
      res.status(500).json({ message: "Failed to delete package", error: (error as Error).message });
    }
  });

  return httpServer;
}
