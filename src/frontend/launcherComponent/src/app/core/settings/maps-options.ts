import { ClusterStyle } from '@agm/js-marker-clusterer/services/google-clusterer-types';

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
        },
        styles: [
            {
                textSize: 20,
                url: 'assets/img/cluster-markers/mezzi/m1-test.png',
                height: 104,
                width: 80,
                anchor: [20, 10]
            }
        ]
    },
    livelloOpacita: 0.3,
    animationTimeoutMs: 30000,
    zoomSelezionato: {
        richiesta: 15,
        sede: 15,
        mezzo: 15
    },
    minZoom: 6,
    panDelay: 500,
    panMarkerRefresh: 500,
    expRoundCoord: 3
};

export interface MapsOptionsInterface {
    clusterOptions: MarkerClusterInterface;
    livelloOpacita: number;
    animationTimeoutMs: number;
    zoomSelezionato: ZoomSelezionatoInterface;
    minZoom: number;
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
    styles?: ClusterStyle[];
}

export interface PathClusterInterface {
    richieste: string;
    sedi: string;
    mezzi: string;
    schedeContatto: string;
}
