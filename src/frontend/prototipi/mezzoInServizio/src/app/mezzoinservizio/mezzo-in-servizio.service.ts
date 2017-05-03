import { Injectable } from '@angular/core';
import { MezzoInServizio} from './mezzoinservizio.model';
import { PersonaSulMezzo } from './persona-sul-mezzo.model';

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
            true,
            'APS-01',
            'D',
            new Date(2017, 3, 26, 10, 10, 0),
            [
                new PersonaSulMezzo(
                    "FRJKDJD12333",
                    "CS Rossi Mario",
                    "C.F.: FRJKDJD12333",
                    true,
                    false
                ),
                new PersonaSulMezzo(
                    "RIETJR12345",
                    "VP Verdi Mario",
                    "C.F.: FRJKDJD12333",
                    false,
                    false
                ),
                new PersonaSulMezzo(
                    "BNCMRO332292",
                    "VP Bianchi Mario",
                    "C.F.: BNCMRO332292",
                    false,
                    true
                ),
            ]);
    }
 
    public Get(): MezzoInServizio {
        return this.ms;
    }
}

