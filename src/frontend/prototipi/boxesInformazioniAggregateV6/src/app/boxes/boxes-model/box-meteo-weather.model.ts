import {Coord} from './weather-model/coord.model';
import {WeatherElement} from './weather-model/weather-element.model';
import {Main} from './weather-model/main.model';
import {Wind} from './weather-model/wind.model';
import {Clouds} from './weather-model/clouds.model';
import {Sys} from './weather-model/sys.model';

export class BoxMeteoWeather {
    constructor(
        coord?: Coord,
        weather?: WeatherElement[],
        base?: string,
        main?: Main,
        visibility?: number,
        wind?: Wind,
        clouds?: Clouds,
        dt?: number,
        sys?: Sys,
        id?: number,
        name?: string,
        cod?: number
    ) {
    }
}
