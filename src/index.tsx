import { serve } from "bun";
import index from "./index.html";
import type { InventoryItem, CreateInventoryItem, UpdateInventoryItem } from "./types/inventory";

// In-memory storage for inventory items (in production, use a database)
const inventoryDB: Map<string, InventoryItem> = new Map();

// Helper function to generate unique IDs
const generateId = () => crypto.randomUUID();

// Initialize with some sample data
const sampleItems: InventoryItem[] = [
  {
    id: generateId(),
    name: "Wireless Mouse",
    sku: "WM-001",
    description: "Ergonomic wireless mouse with 2.4GHz connection",
    quantity: 50,
    price: 29.99,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: "Mechanical Keyboard",
    sku: "MK-002",
    description: "RGB mechanical keyboard with Cherry MX switches",
    quantity: 30,
    price: 89.99,
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: "USB-C Hub",
    sku: "UH-003",
    description: "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader",
    quantity: 75,
    price: 39.99,
    category: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

sampleItems.forEach(item => inventoryDB.set(item.id, item));

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
      return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },

    // Inventory API endpoints
    "/api/inventory": {
      // Get all inventory items
      async GET(req) {
        const items = Array.from(inventoryDB.values());
        return Response.json(items);
      },
      
      // Create a new inventory item
      async POST(req) {
        try {
          const data: CreateInventoryItem = await req.json();
          
          // Validate required fields
          if (!data.name || !data.sku || !data.description || data.quantity === undefined || data.price === undefined || !data.category) {
            return Response.json(
              { error: "Missing required fields" },
              { status: 400 }
            );
          }

          const newItem: InventoryItem = {
            id: generateId(),
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          inventoryDB.set(newItem.id, newItem);
          return Response.json(newItem, { status: 201 });
        } catch (error) {
          return Response.json(
            { error: "Invalid request body" },
            { status: 400 }
          );
        }
      },
    },

    "/api/inventory/:id": {
      // Get a single inventory item
      async GET(req) {
        const { id } = req.params;
        const item = inventoryDB.get(id);

        if (!item) {
          return Response.json(
            { error: "Item not found" },
            { status: 404 }
          );
        }

        return Response.json(item);
      },

      // Update an inventory item
      async PUT(req) {
        try {
          const { id } = req.params;
          const item = inventoryDB.get(id);

          if (!item) {
            return Response.json(
              { error: "Item not found" },
              { status: 404 }
            );
          }

          const updates: UpdateInventoryItem = await req.json();
          const updatedItem: InventoryItem = {
            ...item,
            ...updates,
            id, // Ensure ID cannot be changed
            updatedAt: new Date().toISOString(),
          };

          inventoryDB.set(id, updatedItem);
          return Response.json(updatedItem);
        } catch (error) {
          return Response.json(
            { error: "Invalid request body" },
            { status: 400 }
          );
        }
      },

      // Delete an inventory item
      async DELETE(req) {
        const { id } = req.params;
        const item = inventoryDB.get(id);

        if (!item) {
          return Response.json(
            { error: "Item not found" },
            { status: 404 }
          );
        }

        inventoryDB.delete(id);
        return Response.json({ message: "Item deleted successfully" });
      },
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});
