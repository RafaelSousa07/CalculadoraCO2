
export enum TransportMode {
  CAR_PETROL = 'CAR_PETROL',
  CAR_DIESEL = 'CAR_DIESEL',
  CAR_ELECTRIC = 'CAR_ELECTRIC',
  BUS = 'BUS',
  TRAIN = 'TRAIN',
  FLIGHT_SHORT = 'FLIGHT_SHORT',
  FLIGHT_LONG = 'FLIGHT_LONG',
  BIKE = 'BIKE',
  WALK = 'WALK'
}

export interface RouteData {
  id: string;
  name: string;
  distanceKm: number;
}

export interface CalculationResult {
  co2Kg: number;
  treesNeeded: number;
  equivalents: {
    smartphonesCharged: number;
    plasticBottles: number;
  };
}

export interface TripData {
  origin: string;
  destination: string;
  distance: number;
  mode: TransportMode;
  passengers: number;
}
