export interface Stop {
  id: number;
  name: string;
  transportType: string;
}

export interface RouteListItem {
  id: number;
  name: string;
  departureStop: Stop | null;
  departureTime: string | null;
  arrivalStop: Stop | null;
  arrivalTime: string | null;
  fare: number;
}

export interface Plan {
  id: number;
  name: string;
  userId: number;
  routes: RouteListItem[];
}

export interface PlanListItem {
  id: number;
  name: string;
}

export interface PlanForm {
  name: string;
} 