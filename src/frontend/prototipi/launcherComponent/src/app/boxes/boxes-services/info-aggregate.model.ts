import {BoxFunzionariSo} from '../boxes-model/box-funzionari-so.model';
import {BoxInterventi} from '../boxes-model/box-interventi.model';
import {BoxMezzi} from '../boxes-model/box-mezzi.model';
import {BoxMeteo} from '../boxes-model/box-meteo.model';

export class InfoAggregate {
    constructor(
        /* Array contenente le informazioni relative ai funzionari di servizio in Sala Operativa */
        public funzionariSo: BoxFunzionariSo[],
        /* Array contenente le informazioni sugli interventi */
        public interventi: BoxInterventi[],
        /* Array contenente le informazioni sui mezzi */
        public meteo: BoxMezzi[],
        /* Array contenente le informazioni sul meteo */
        public mezzi: BoxMeteo[]
    ) {
    }
}
