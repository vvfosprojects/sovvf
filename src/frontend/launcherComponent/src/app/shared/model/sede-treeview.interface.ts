export interface SedeTreeviewInterface {
    codice: string;
    descrizione: string;
    child: SedeTreeviewInterface[];
}

export interface SedeSelezionataInterface {
    codiceSede: string;
    tipo: SedeTreeviewEnum;
}

export interface ListaSediSelezionate {
    listaSediSelezionate: SedeSelezionataInterface[];
}


export enum SedeTreeviewEnum {
    Ricorsiva,
    NonRicorsiva
}
