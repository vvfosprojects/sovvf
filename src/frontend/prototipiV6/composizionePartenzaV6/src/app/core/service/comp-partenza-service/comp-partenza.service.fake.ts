import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Models
import { Mezzo } from '../../../shared/model/mezzo.model';
import { Squadra } from '../../../shared/model/squadra.model';
import { Componente } from '../../../shared/model/componente.model';
import { PreAccoppiato } from 'src/app/composizione-partenza/model/pre-accoppiato.model';


@Injectable({
  providedIn: 'root'
})
export class CompPartenzaServiceFake {
  preAccoppiati: PreAccoppiato[];

  constructor() {
  }

  public getPreAccoppiati(): Observable<PreAccoppiato[]> {
    this.preAccoppiati = [
      new PreAccoppiato('1',
        new Mezzo('A1', '', 'APS', 'inSede', [], 0),
        new Squadra('Rossa', 'inSede', [
          new Componente('QF', 'Mario Verdi', '', true, false, false),
          new Componente('QF', 'Roberto Merlo', '', false, true, false),
          new Componente('QF', 'Francesca De Simone', '', false, false, false),
          new Componente('QF', 'Emanuele Catti', '', false, false, false),
          new Componente('QF', 'Mariangela Rossi', '', false, false, false),
        ]),
        'Tuscolana',
        23.5,
        '24 min.'
      ),
      new PreAccoppiato('2',
        new Mezzo('A2', '', 'APS', 'inRientro', [], 0),
        new Squadra('Gialla', 'inSede', [
          new Componente('QF', 'Mario Verdi', '', true, false, false),
          new Componente('QF', 'Roberto Merlo', '', false, true, false),
          new Componente('QF', 'Francesca De Simone', '', false, false, false),
          new Componente('QF', 'Emanuele Catti', '', false, false, false),
          new Componente('QF', 'Mariangela Rossi', '', false, false, false),
        ]),
        'Ostiense',
        5.5,
        '6 min.'
      ),
      new PreAccoppiato('2',
        new Mezzo('A2', '', 'APS', 'inRientro', [], 0),
        new Squadra('Gialla', 'inSede', [
          new Componente('QF', 'Mario Verdi', '', true, false, false),
          new Componente('QF', 'Roberto Merlo', '', false, true, false),
          new Componente('QF', 'Francesca De Simone', '', false, false, false),
          new Componente('QF', 'Emanuele Catti', '', false, false, false),
          new Componente('QF', 'Mariangela Rossi', '', false, false, false),
        ]),
        'Ostiense',
        5.5,
        '6 min.'
      ),
      new PreAccoppiato('2',
        new Mezzo('A2', '', 'APS', 'inRientro', [], 0),
        new Squadra('Gialla', 'inSede', [
          new Componente('QF', 'Mario Verdi', '', true, false, false),
          new Componente('QF', 'Roberto Merlo', '', false, true, false),
          new Componente('QF', 'Francesca De Simone', '', false, false, false),
          new Componente('QF', 'Emanuele Catti', '', false, false, false),
          new Componente('QF', 'Mariangela Rossi', '', false, false, false),
        ]),
        'Ostiense',
        5.5,
        '6 min.'
      ),
      new PreAccoppiato('2',
        new Mezzo('A2', '', 'APS', 'inRientro', [], 0),
        new Squadra('Gialla', 'inSede', [
          new Componente('QF', 'Mario Verdi', '', true, false, false),
          new Componente('QF', 'Roberto Merlo', '', false, true, false),
          new Componente('QF', 'Francesca De Simone', '', false, false, false),
          new Componente('QF', 'Emanuele Catti', '', false, false, false),
          new Componente('QF', 'Mariangela Rossi', '', false, false, false),
        ]),
        'Ostiense',
        5.5,
        '6 min.'
      ),
      new PreAccoppiato('2',
        new Mezzo('A2', '', 'APS', 'inRientro', [], 0),
        new Squadra('Gialla', 'inSede', [
          new Componente('QF', 'Mario Verdi', '', true, false, false),
          new Componente('QF', 'Roberto Merlo', '', false, true, false),
          new Componente('QF', 'Francesca De Simone', '', false, false, false),
          new Componente('QF', 'Emanuele Catti', '', false, false, false),
          new Componente('QF', 'Mariangela Rossi', '', false, false, false),
        ]),
        'Ostiense',
        5.5,
        '6 min.'
      ),
      new PreAccoppiato('2',
        new Mezzo('A2', '', 'APS', 'inRientro', [], 0),
        new Squadra('Gialla', 'inSede', [
          new Componente('QF', 'Mario Verdi', '', true, false, false),
          new Componente('QF', 'Roberto Merlo', '', false, true, false),
          new Componente('QF', 'Francesca De Simone', '', false, false, false),
          new Componente('QF', 'Emanuele Catti', '', false, false, false),
          new Componente('QF', 'Mariangela Rossi', '', false, false, false),
        ]),
        'Ostiense',
        5.5,
        '6 min.'
      ),
      new PreAccoppiato('2',
        new Mezzo('A2', '', 'APS', 'inRientro', [], 0),
        new Squadra('Gialla', 'inSede', [
          new Componente('QF', 'Mario Verdi', '', true, false, false),
          new Componente('QF', 'Roberto Merlo', '', false, true, false),
          new Componente('QF', 'Francesca De Simone', '', false, false, false),
          new Componente('QF', 'Emanuele Catti', '', false, false, false),
          new Componente('QF', 'Mariangela Rossi', '', false, false, false),
        ]),
        'Ostiense',
        5.5,
        '6 min.'
      ),
      new PreAccoppiato('2',
        new Mezzo('A2', '', 'APS', 'inRientro', [], 0),
        new Squadra('Gialla', 'inSede', [
          new Componente('QF', 'Mario Verdi', '', true, false, false),
          new Componente('QF', 'Roberto Merlo', '', false, true, false),
          new Componente('QF', 'Francesca De Simone', '', false, false, false),
          new Componente('QF', 'Emanuele Catti', '', false, false, false),
          new Componente('QF', 'Mariangela Rossi', '', false, false, false),
        ]),
        'Ostiense',
        5.5,
        '6 min.'
      ),
      new PreAccoppiato('2',
        new Mezzo('A2', '', 'APS', 'inRientro', [], 0),
        new Squadra('Gialla', 'inSede', [
          new Componente('QF', 'Mario Verdi', '', true, false, false),
          new Componente('QF', 'Roberto Merlo', '', false, true, false),
          new Componente('QF', 'Francesca De Simone', '', false, false, false),
          new Componente('QF', 'Emanuele Catti', '', false, false, false),
          new Componente('QF', 'Mariangela Rossi', '', false, false, false),
        ]),
        'Ostiense',
        5.5,
        '6 min.'
      ),
      new PreAccoppiato('2',
        new Mezzo('A2', '', 'APS', 'inRientro', [], 0),
        new Squadra('Gialla', 'inSede', [
          new Componente('QF', 'Mario Verdi', '', true, false, false),
          new Componente('QF', 'Roberto Merlo', '', false, true, false),
          new Componente('QF', 'Francesca De Simone', '', false, false, false),
          new Componente('QF', 'Emanuele Catti', '', false, false, false),
          new Componente('QF', 'Mariangela Rossi', '', false, false, false),
        ]),
        'Ostiense',
        5.5,
        '6 min.'
      ),
      new PreAccoppiato('2',
        new Mezzo('A2', '', 'APS', 'inRientro', [], 0),
        new Squadra('Gialla', 'inSede', [
          new Componente('QF', 'Mario Verdi', '', true, false, false),
          new Componente('QF', 'Roberto Merlo', '', false, true, false),
          new Componente('QF', 'Francesca De Simone', '', false, false, false),
          new Componente('QF', 'Emanuele Catti', '', false, false, false),
          new Componente('QF', 'Mariangela Rossi', '', false, false, false),
        ]),
        'Ostiense',
        5.5,
        '6 min.'
      ),
    ];

    return of(this.preAccoppiati);
  }

}
