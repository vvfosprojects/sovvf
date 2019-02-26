// Interface
import { DirectionInterface } from '../../service/direction-service/direction-interface';

export class SetDirection {
    static readonly type = '[MapsDirection] Set Direction';

    constructor(public direction: DirectionInterface) { }
}

export class ClearDirection {
    static readonly type = '[MapsDirection] Clear Direction';
}
