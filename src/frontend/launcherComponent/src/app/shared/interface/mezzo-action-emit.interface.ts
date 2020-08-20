import { StatoMezzoActions } from '../enum/stato-mezzo-actions.enum';

export interface MezzoActionEmit {
    mezzoAction: StatoMezzoActions;
    oraEvento: {
        ora: number,
        minuti: number
    };
}
