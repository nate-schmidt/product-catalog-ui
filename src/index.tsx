import { serve } from "bun";
import index from "./index.html";
import { mockProducts, mockFlashSales } from "./data/mockData";
import { FlashSale, FlashSaleStatus } from "./types/flashSales";

// Helper function to calculate flash sale status
function getFlashSaleStatus(flashSale: FlashSale): FlashSaleStatus {
  const now = new Date().getTime();
  const startTime = new Date(flashSale.startTime).getTime();
  const endTime = new Date(flashSale.endTime).getTime();
  
  const hasStarted = now >= startTime;
  const hasEnded = now >= endTime;
  const isActive = hasStarted && !hasEnded && flashSale.isActive;
  
  let timeRemaining = 0;
  let percentageComplete = 0;
  
  if (hasStarted && !hasEnded) {
    timeRemaining = endTime - now;
    const totalDuration = endTime - startTime;
    const elapsed = now - startTime;
    percentageComplete = Math.min(100, (elapsed / totalDuration) * 100);
  } else if (!hasStarted) {
    timeRemaining = startTime - now;
  }
  
  return {
    isActive,
    timeRemaining: Math.max(0, timeRemaining),
    hasStarted,
    hasEnded,
    percentageComplete: Math.max(0, Math.min(100, percentageComplete))
  };
}

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/products": {
      async GET() {
        return Response.json(mockProducts);
      }
    },

    "/api/flash-sales": {
      async GET() {
        // Update flash sale statuses and return with status info
        const flashSalesWithStatus = mockFlashSales.map(sale => ({
          ...sale,
          status: getFlashSaleStatus(sale)
        }));
        
        return Response.json(flashSalesWithStatus);
      }
    },

    "/api/flash-sales/active": {
      async GET() {
        const now = new Date().getTime();
        const activeFlashSales = mockFlashSales
          .filter(sale => {
            const status = getFlashSaleStatus(sale);
            return status.isActive;
          })
          .map(sale => ({
            ...sale,
            status: getFlashSaleStatus(sale)
          }));
        
        return Response.json(activeFlashSales);
      }
    },

    "/api/flash-sales/upcoming": {
      async GET() {
        const now = new Date().getTime();
        const upcomingFlashSales = mockFlashSales
          .filter(sale => {
            const status = getFlashSaleStatus(sale);
            return !status.hasStarted;
          })
          .map(sale => ({
            ...sale,
            status: getFlashSaleStatus(sale)
          }))
          .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
        
        return Response.json(upcomingFlashSales);
      }
    },

    "/api/flash-sales/:id": {
      async GET(req) {
        const id = req.params.id;
        const flashSale = mockFlashSales.find(sale => sale.id === id);
        
        if (!flashSale) {
          return new Response("Flash sale not found", { status: 404 });
        }
        
        const flashSaleWithStatus = {
          ...flashSale,
          status: getFlashSaleStatus(flashSale)
        };
        
        return Response.json(flashSaleWithStatus);
      }
    },

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
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});
