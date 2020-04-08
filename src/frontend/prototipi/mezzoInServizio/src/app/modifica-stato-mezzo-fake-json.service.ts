import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';

import { ModificaStatoMezzo } from './mezzoinservizio/modifica-stato-mezzo.model';
// import { Http } from "@angular/http";
import { HttpClientModule } from '@angular/common/http';

@Injectable()
export class ModificaStatoMezzoService_FakeJson {
  private modf: ModificaStatoMezzo = JSON.parse(`
    {
      "codice": "FRP98903",
      "codiceStato": "InSede",
      "codiceStatoPrec": "InRientro"     
    }
  `);
  constructor(private http: HttpClientModule) { }

  public sendModStatoMezzo(): Observable<ModificaStatoMezzo> {
    return Observable.of(this.modf);
  }
}
