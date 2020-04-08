import { Injectable } from '@angular/core';
import { SchedaContatto} from './scheda-contatto.model';


@Injectable()
export class SchedaContattoService {

  constructor() {   }
   
      Get() : SchedaContatto {
          return new SchedaContatto(
              798495,
              //new Date(1977, 8, 20, 14, 29, 0), 
              new Date(2016, 3, 4, 10, 10, 0), 
              205, 
              '121156A', 
              'MARIO ROSSI', 
              3351234567, 
              'Via Giovanni Giolitti 4, Roma, RM',
              'SCALA:1 PIANO:T CIT.ROSSO', 
              'SOCCORSO TECNICO URGENTE - INCENDIO', 
              'Soccorso a persone',
              'INCENDIO IN APPARTAMENTO',
              'HIGH',
              '3',
              'VVF');
}
}

