export interface Impostazione {
    tipo: TipoImpostazione;
    icona: string;
    opzioni: OpzioneImpostazione[];
}

export enum TipoImpostazione {
    Box = 'Box Riepilogo',
    EventiRichiesta = 'Lista Eventi Richiesta',
    ModalitaNotte = 'Modalità Notte',

}

export interface OpzioneImpostazione {
    label: string;
    singleValue?: {
        value: boolean;
    };
    select?: {
        itemsSelect: {
            id: string,
            desc: string
        }[];
        selected: string;
    };
}
