export interface Deal {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  displayStartTime: string; // ISO 8601 timestamp
  displayEndTime: string; // ISO 8601 timestamp
}

