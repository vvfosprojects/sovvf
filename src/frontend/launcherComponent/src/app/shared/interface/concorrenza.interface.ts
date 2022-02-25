import { TipoConcorrenzaEnum } from '../enum/tipo-concorrenza.enum';

export interface ConcorrenzaInterface {
    idOperatore: string;
    type: TipoConcorrenzaEnum;
    value: string;
    codComando: string;
}
