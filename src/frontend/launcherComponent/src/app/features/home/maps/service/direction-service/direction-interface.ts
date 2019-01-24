export interface DirectionInterface {
    origin?: {
        lat: number;
        lng: number;
    };
    destination?: {
        lat: number;
        lng: number;
    };
    isVisible: boolean;
}
