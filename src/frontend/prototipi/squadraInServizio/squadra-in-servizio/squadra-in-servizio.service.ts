import { Injectable } from '@angular/core';
import { SquadraInServizio} from './squadrainservizio.model';
import { PersonaDellaSquadra } from './persona-della-squadra.model';

@Injectable()
export class SquadraInServizioService {
   private ss: SquadraInServizio;

    constructor() { 
        this.ss = new SquadraInServizio('1','Centrale','1/A','','A',new Date(2017, 3, 26, 10, 10, 0),'InSede','',
            [
                new PersonaDellaSquadra(
                    "FRJKDJD12333",
                    "CS Rossi Mario",
                    "C.F.: FRJKDJD12333",
                    true,
                    false
                ),
                new PersonaDellaSquadra(
                    "RIETJR12345",
                    "VP Verdi Mario",
                    "C.F.: FRJKDJD12333",
                    false,
                    false
                ),
                new PersonaDellaSquadra(
                    "BNCMRO332292",
                    "VP Bianchi Mario",
                    "C.F.: BNCMRO332292",
                    false,
                    true
                ),
            ]);
    }
 
    public Get(): SquadraInServizio {
        return this.ss;
    }
}

