import { TipoConcorrenzaEnum } from '../../../enum/tipo-concorrenza.enum';

export interface AddConcorrenzaDtoInterface {
    type: TipoConcorrenzaEnum;
    value: string;
}
