export let MAPSOPTIONS: MapsOptionsInterface = {
    clusterOptions: {
        minMarkerCluster: 6,
        maxZoom: 14,
        gridSize: 120,
        zoomOnClick: true,
        averageCenter: true,
        path: {
            richieste: 'assets/img/cluster-markers/m',
            mezzi: 'assets/img/cluster-markers/m',
            sedi: 'assets/img/cluster-markers/m',
            schedeContatto: 'assets/img/cluster-markers/m'
        }
    },
    livelloOpacita: 0.3,
    animationTimeoutMs: 30000,
    zoomSelezionato: {
        richiesta: 15,
        sede: 15,
        mezzo: 15
    },
    minZoom: 6,
    maxZoom: 18,
    panDelay: 500,
    panMarkerRefresh: 500,
    expRoundCoord: 1
};

export interface MapsOptionsInterface {
    clusterOptions: MarkerClusterInterface;
    livelloOpacita: number;
    animationTimeoutMs: number;
    zoomSelezionato: ZoomSelezionatoInterface;
    minZoom: number;
    maxZoom: number;
    panDelay: number;
    panMarkerRefresh: number;
    expRoundCoord: number;
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
    averageCenter: boolean;
    path: PathClusterInterface;
}

export interface PathClusterInterface {
    richieste: string;
    sedi: string;
    mezzi: string;
    schedeContatto: string;
}
