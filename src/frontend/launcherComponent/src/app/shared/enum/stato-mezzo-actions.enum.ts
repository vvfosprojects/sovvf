export enum StatoMezzoActions {
    Rientrato = 'Rientrato',
    InUscita = 'In Uscita',
    InViaggio = 'In Viaggio',
    SulPosto = 'Sul Posto',
    InRientro = 'In Rientro'
}

export class StatoMezzoActionsAndTime {
    statoMezzoActions : StatoMezzoActions;
    time: string;
}

