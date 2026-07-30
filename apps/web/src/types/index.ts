export type UserRole = "admin" | "supervisor" | "driver";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Truck {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  capacity_kg: number;
  driver_id?: string;
  status: "active" | "maintenance" | "inactive";
  created_at: string;
}

export interface Route {
  id: string;
  truck_id: string;
  driver_id: string;
  sector_ids: string[];
  date: string;
  start_time?: string;
  end_time?: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  created_at: string;
}

export interface GPSLog {
  id: string;
  truck_id: string;
  latitude: number;
  longitude: number;
  speed?: number;
  direction?: number;
  timestamp: string;
}

export interface Incident {
  id: string;
  route_id: string;
  type: "accident" | "breakdown" | "traffic" | "other";
  description: string;
  latitude?: number;
  longitude?: number;
  severity: "low" | "medium" | "high";
  status: "reported" | "resolved";
  created_at: string;
}

export interface Sector {
  id: string;
  name: string;
  code: string;
  boundaries: [number, number][];
  status: "pending" | "in_progress" | "completed";
  assigned_route_id?: string;
  created_at: string;
}

export interface Prediction {
  id: string;
  sector_id: string;
  predicted_fill_percentage: number;
  predicted_date: string;
  confidence: number;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "alert" | "success";
  read: boolean;
  created_at: string;
}
