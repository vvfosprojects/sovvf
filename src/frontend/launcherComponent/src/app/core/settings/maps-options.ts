export let MAPSOPTIONS: MapsOptionsInterface = {
    minMarkerCluster: 99999,
    livelloOpacita: 0.3,
    animationTimeoutMs: 30000,
    zoomSelezionato: {
        richiesta: 15,
        sede: 15,
        mezzo: 15
    }
};

export interface MapsOptionsInterface {
    minMarkerCluster: number;
    livelloOpacita: number;
    animationTimeoutMs: number;
    zoomSelezionato: ZoomSelezionatoInterface;
}

export interface ZoomSelezionatoInterface {
    richiesta: number;
    sede: number;
    mezzo: number;
}
