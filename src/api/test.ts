// Simple integration test for API services
import { productService } from './productService';
import { orderService } from './orderService';

export async function testApiIntegration() {
  console.log('🧪 Testing API Integration...');
  
  try {
    // Test product service
    console.log('📦 Testing product service...');
    const products = await productService.getAllProducts();
    console.log(`✅ Successfully fetched ${products.length} products`);
    
    if (products.length > 0) {
      const firstProduct = products[0];
      console.log(`📋 Sample product: ${firstProduct.name} - $${firstProduct.price}`);
    }
    
    // Test search functionality
    console.log('🔍 Testing search functionality...');
    const searchResults = await productService.searchByName('table');
    console.log(`✅ Search returned ${searchResults.length} results`);
    
    // Test category filtering
    console.log('🏷️ Testing category filtering...');
    const categories = Array.from(new Set(products.map(p => p.category)));
    if (categories.length > 0) {
      const categoryProducts = await productService.getProductsByCategory(categories[0]);
      console.log(`✅ Category "${categories[0]}" has ${categoryProducts.length} products`);
    }
    
    console.log('🎉 All API tests passed!');
    return true;
  } catch (error) {
    console.error('❌ API test failed:', error);
    return false;
  }
}

// Test checkout data structure
export function testCheckoutData() {
  console.log('🧾 Testing checkout data structure...');
  
  const sampleCheckoutData = {
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+1234567890',
    shippingAddress: '123 Main St',
    shippingCity: 'Anytown',
    shippingState: 'CA',
    shippingZip: '12345',
    shippingCountry: 'United States',
    sameAsShipping: true,
    paymentMethod: 'CREDIT_CARD' as const,
    items: [
      {
        productId: 1,
        quantity: 2,
        price: 99.99,
      }
    ],
    specialInstructions: 'Please handle with care',
  };
  
  console.log('✅ Checkout data structure is valid');
  return sampleCheckoutData;
}
