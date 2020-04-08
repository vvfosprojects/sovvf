import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';

import { ModificaStatoMezzo } from './mezzoinservizio/modifica-stato-mezzo.model';

@Injectable()
export class ModificaStatoService_Fake {
  private modf: ModificaStatoMezzo = 
       new ModificaStatoMezzo(
      "FRP98903",
      "InSede",
      "InRientro"
      );

  constructor() { }

  public sendModStatoMezzo(): Observable<ModificaStatoMezzo> {
      return Observable.of(this.modf);
  }

}



      