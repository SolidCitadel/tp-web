export interface Stop {
  id: number;
  name: string;
  transportType: string;
}

export interface Direction {
  id: number;
  fare: number;
  requiredTime: string;
  departureStop: Stop;
  arrivalStop: Stop;
  departureTimes: string[];
}

export interface DirectionListItem {
  id: number;
  fare: number;
  requiredTime: string;
  departureStop: Stop;
  arrivalStop: Stop;
}

export interface Segment {
  id: number;
  routeId: number;
  direction: Direction;
  departureTime: string;
}

export interface Route {
  id: number;
  planId: number;
  name: string;
  segments: Segment[];
}

export interface createSegmentForm {
  directionId: number;
  departureTime: string;
}