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
              'Via Cavour, 5, Roma, RM',
              'Portone Uffici Centrali VVF', 
              'Incendio', 
              'Attributi di classificazione',
              'Note',
              5,
              '2',
              'VVF');
}
}

