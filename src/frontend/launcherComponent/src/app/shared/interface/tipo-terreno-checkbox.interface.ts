export interface TipoTerrenoCheckboxInterface {
    name: string;
    checked: boolean;
    value: number;
    unit: UnitaMisuraTerreno;
}

export enum UnitaMisuraTerreno {
    Mq = 'Mq',
    Ha = 'Ha'
}
