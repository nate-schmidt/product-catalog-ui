import { Product, ProductApiData, ProductApiResponse } from '../types/Product';

export class ProductMapper {
  static apiToProduct(apiData: ProductApiData): Product {
    // Extract primary image
    const primaryImage = apiData.images?.find(img => img.is_primary) || apiData.images?.[0];
    const imageUrl = primaryImage?.url;

    // Calculate in stock status
    const inStock = apiData.inventory?.quantity > 0 && apiData.inventory?.status !== 'out_of_stock';

    // Extract manufacturer from specifications or use a default
    const manufacturerSpec = apiData.specifications?.find(
      spec => spec.name.toLowerCase() === 'manufacturer' || 
               spec.name.toLowerCase() === 'brand' ||
               spec.name.toLowerCase() === 'make'
    );
    const manufacturer = manufacturerSpec?.value || 'Unknown';

    // Extract primary category
    const primaryCategory = apiData.categories?.[0]?.name;

    return {
      id: apiData.id,
      name: apiData.name,
      manufacturer,
      description: apiData.description,
      price: apiData.price,
      imageUrl,
      category: primaryCategory,
      inStock,
      
      // Extended fields
      sku: apiData.sku,
      slug: apiData.slug,
      shortDescription: apiData.short_description,
      compareAtPrice: apiData.compare_at_price,
      featured: apiData.featured,
      categories: apiData.categories,
      images: apiData.images,
      specifications: apiData.specifications,
      inventory: apiData.inventory,
    };
  }

  static apiToProducts(apiResponse: ProductApiResponse): Product[] {
    return apiResponse.data.map(this.apiToProduct);
  }

  static extractManufacturers(products: Product[]): string[] {
    const manufacturers = new Set<string>();
    products.forEach(product => {
      if (product.manufacturer && product.manufacturer !== 'Unknown') {
        manufacturers.add(product.manufacturer);
      }
    });
    return Array.from(manufacturers).sort();
  }

  static extractCategories(products: Product[]): string[] {
    const categories = new Set<string>();
    products.forEach(product => {
      if (product.category) {
        categories.add(product.category);
      }
      // Also extract from extended categories
      product.categories?.forEach(cat => {
        if (cat.name) {
          categories.add(cat.name);
        }
      });
    });
    return Array.from(categories).sort();
  }
} 