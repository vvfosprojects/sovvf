import { Injectable } from '@angular/core';
import { MezzoInServizio} from './mezzoinservizio.model';

@Injectable()
export class MezzoInServizioService {
   private ms: MezzoInServizio;

  constructor() { 
        this.ms = new MezzoInServizio(
            '1',
            'Centrale', 
            'M_34564',
            'APS',
            '34564',
            'SulPosto',
            new Date(2017, 3, 26, 10, 10, 0),
            '13423',
            true);
    }
    
    public Get(): MezzoInServizio {
        return this.ms;
    }

}
