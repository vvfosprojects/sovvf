import { TipoConcorrenzaEnum } from '../enum/tipo-concorrenza.enum';

export interface ConcorrenzaInterface {
    id: string;
    idOperatore: string;
    type: TipoConcorrenzaEnum;
    value: string;
    codComando: string;
}
