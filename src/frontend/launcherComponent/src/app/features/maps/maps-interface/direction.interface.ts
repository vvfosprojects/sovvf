import { DirectionTravelDataInterface } from './direction-travel-data.interface';

export interface DirectionInterface {
    origin?: {
        lat: number;
        lng: number;
    };
    destination?: {
        lat: number;
        lng: number;
    };
    genereMezzo?: string;
    travelData?: DirectionTravelDataInterface;
    isVisible: boolean;
}
