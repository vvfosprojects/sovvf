import { StatoMezzoActions } from '../enum/stato-mezzo-actions.enum';

export interface MezzoActionEmit {
    mezzoAction: StatoMezzoActions;
    oraEvento: {
        ora: number,
        minuti: number,
        secondi: number
    };
    dataEvento?: {
      giorno: number,
      mese: number,
      anno: number
    };
    codicePartenza: string;
    modificaOrario: boolean;
    azioneIntervento?: string;
}
