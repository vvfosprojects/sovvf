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
            'InSede',
            new Date(2016, 3, 4, 10, 10, 0),
            '13423',
            false);
    }
    
    public Get(): MezzoInServizio {
        return this.ms;
    }

}
