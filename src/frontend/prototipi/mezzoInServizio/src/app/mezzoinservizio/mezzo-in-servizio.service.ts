import { Injectable } from '@angular/core';
import { MezzoInServizio} from './mezzoinservizio.model';
import { SquadraSulMezzo} from './mezzoinservizio.model';



@Injectable()
export class MezzoInServizioService {
   private ms: MezzoInServizio;
   private sq: SquadraSulMezzo[] = [
      new SquadraSulMezzo(        'VP',
        "FRJKDJD12333",
        "CapoSquadra",
        "Rossi Mario"
        ),
        new SquadraSulMezzo(
        "VP",
        "RIETJR12345",
        "Vigile",
        "Verdi Mario"
        ),
        new SquadraSulMezzo(
        "VP",
        "FRJKDJD12333",
        "CapoSquadra",
        "Bianchi Mario"
        )];

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
            new Date(2017, 3, 26, 10, 10, 0));
    }
 
    public Get(): MezzoInServizio {
        return this.ms;
    }

public GetSquadra(): SquadraSulMezzo[] {
        return this.sq;
    }

}

