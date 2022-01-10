import { DirectionInterface } from '../../maps-interface/direction.interface';
import { DirectionTravelDataInterface } from '../../maps-interface/direction-travel-data.interface';

export class SetDirection {
    static readonly type = '[MapsDirection] Set Direction';

    constructor(public direction: DirectionInterface) {
    }
}

export class SetDirectionTravelData {
    static readonly type = '[MapsDirection] Set Direction Travel Data';

    constructor(public travelData: DirectionTravelDataInterface) {
    }
}

export class ClearDirection {
    static readonly type = '[MapsDirection] Clear Direction';
}
