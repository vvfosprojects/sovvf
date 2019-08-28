export let MAPSOPTIONS: MapsOptionsInterface = {
    clusterOptions: {
        minMarkerCluster: 3,
        maxZoom: 14,
        gridSize: 100,
        zoomOnClick: true,
        path: {
            richieste: 'assets/img/cluster-markers/m',
            mezzi: 'assets/img/cluster-markers/m',
            sedi: 'assets/img/cluster-markers/m'
        }
    },
    livelloOpacita: 0.3,
    animationTimeoutMs: 30000,
    zoomSelezionato: {
        richiesta: 15,
        sede: 15,
        mezzo: 15
    }
};

export interface MapsOptionsInterface {
    clusterOptions: MarkerClusterInterface;
    livelloOpacita: number;
    animationTimeoutMs: number;
    zoomSelezionato: ZoomSelezionatoInterface;
}

export interface ZoomSelezionatoInterface {
    richiesta: number;
    sede: number;
    mezzo: number;
}

export interface MarkerClusterInterface {
    minMarkerCluster: number;
    maxZoom: number;
    gridSize: number;
    zoomOnClick: boolean;
    path: PathClusterInterface;
}

export interface PathClusterInterface {
    richieste: string;
    sedi: string;
    mezzi: string;
}
