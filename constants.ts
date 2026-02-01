
import { TransportMode, RouteData } from './types';

// CO2 emission factors in grams per km per passenger
export const EMISSION_FACTORS: Record<TransportMode, number> = {
  [TransportMode.CAR_PETROL]: 192,
  [TransportMode.CAR_DIESEL]: 171,
  [TransportMode.CAR_ELECTRIC]: 53,
  [TransportMode.BUS]: 105,
  [TransportMode.TRAIN]: 41,
  [TransportMode.FLIGHT_SHORT]: 255,
  [TransportMode.FLIGHT_LONG]: 150,
  [TransportMode.BIKE]: 0,
  [TransportMode.WALK]: 0,
};

export const TRANSPORT_LABELS: Record<TransportMode, string> = {
  [TransportMode.CAR_PETROL]: 'Carro (Gasolina)',
  [TransportMode.CAR_DIESEL]: 'Carro (Diesel)',
  [TransportMode.CAR_ELECTRIC]: 'Carro (Elétrico)',
  [TransportMode.BUS]: 'Ônibus',
  [TransportMode.TRAIN]: 'Trem/Metrô',
  [TransportMode.FLIGHT_SHORT]: 'Voo (Curta distância < 1500km)',
  [TransportMode.FLIGHT_LONG]: 'Voo (Longa distância > 1500km)',
  [TransportMode.BIKE]: 'Bicicleta',
  [TransportMode.WALK]: 'A pé',
};

export const PREDEFINED_ROUTES: RouteData[] = [
  { id: '1', name: 'São Paulo - Rio de Janeiro', distanceKm: 435 },
  { id: '2', name: 'Belo Horizonte - São Paulo', distanceKm: 585 },
  { id: '3', name: 'Curitiba - São Paulo', distanceKm: 408 },
  { id: '4', name: 'Brasília - Rio de Janeiro', distanceKm: 1148 },
  { id: '5', name: 'Salvador - Recife', distanceKm: 800 },
];

// Calculation constants
export const CO2_PER_TREE_YEAR_KG = 22; // A mature tree absorbs approx 22kg of CO2 per year
export const SMARTPHONE_CHARGE_CO2_G = 5; // CO2 per full smartphone charge
export const PLASTIC_BOTTLE_CO2_G = 82; // CO2 to produce a 500ml PET bottle
