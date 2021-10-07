export class AddLayersMappa {
    static readonly type = '[Mappa] Add Layers Mappa';

    constructor(public layers: any[], public layersType: string) {
    }
}

export class RemoveLayersMappa {
    static readonly type = '[Mappa] Remove Layers Mappa';

    constructor(public layers: any[], public layersType: string) {
    }
}
