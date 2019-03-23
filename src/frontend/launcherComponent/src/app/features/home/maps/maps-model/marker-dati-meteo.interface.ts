import { Meteo } from '../../../../shared/model/meteo.model';

export interface MarkerDatiMeteo {
    id: string;
    datiMeteo: Meteo;
    date: Date;
}
