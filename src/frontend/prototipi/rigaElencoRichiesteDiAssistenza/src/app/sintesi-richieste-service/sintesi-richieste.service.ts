import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";

import { SintesiRichiesta } from '../sintesi-richiesta/sintesi-richiesta.model';

@Injectable()
export class SintesiRichiesteService {

  constructor() { }

  public getSintesiRichieste(): Observable<SintesiRichiesta[]> {
    //va implementato con query http
    return null;
  }
}
