import { Injectable } from '@angular/core';
import { SchedaContatto} from './scheda-contatto.model';
import * as moment from 'moment';

@Injectable()
export class SchedaContattoService {

  constructor() { 
     var a = moment('21-03-2017');
     var b = moment('2016-03-12 13:00:00').format('LLL');
     a.format();
     var d = Date.parse("March 21, 2012");

  }
   
      Get() : SchedaContatto {
          return new SchedaContatto(798495, '21-03-2017 18:05:08' , 205, '121156A', 'MARIO ROSSI', 3351234567, 'Via Cavour, 5, Roma, RM', 'Portone Uffici Centrali VVF', 'Incendio', 'Attributi di classificazione','Note','HIGH','2','VVF');
}
}

