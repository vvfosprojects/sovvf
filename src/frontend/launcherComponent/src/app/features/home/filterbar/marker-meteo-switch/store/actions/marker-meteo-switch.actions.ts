
// SET MARKER METEO
export class SetMarkerMeteo {
    static readonly type = '[MarkerMeteoSwitch] Set Meteo Marker Visibility';

    constructor(public active: boolean) {}
}
