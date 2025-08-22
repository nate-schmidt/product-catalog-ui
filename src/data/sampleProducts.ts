import { Product } from '../types/cart';

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Treasure Map',
    price: 299.99,
    description: 'Ancient treasure map leading to buried gold doubloons',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    category: 'Maps'
  },
  {
    id: '2',
    name: 'Pirate Hat',
    price: 49.99,
    description: 'Authentic black tricorn hat with skull and crossbones',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    category: 'Apparel'
  },
  {
    id: '3',
    name: 'Cutlass Sword',
    price: 159.99,
    description: 'Sharp steel cutlass for defending yer ship',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    category: 'Weapons'
  },
  {
    id: '4',
    name: 'Compass',
    price: 89.99,
    description: 'Brass compass for navigating the seven seas',
    image: 'https://images.unsplash.com/photo-1606044466411-207a9a49711f?w=400&h=300&fit=crop',
    category: 'Navigation'
  },
  {
    id: '5',
    name: 'Rum Bottle',
    price: 25.99,
    description: 'Fine aged rum from the Caribbean',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop',
    category: 'Beverages'
  },
  {
    id: '6',
    name: 'Parrot',
    price: 199.99,
    description: 'Colorful talking parrot, perfect ship companion',
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop',
    category: 'Pets'
  }
];