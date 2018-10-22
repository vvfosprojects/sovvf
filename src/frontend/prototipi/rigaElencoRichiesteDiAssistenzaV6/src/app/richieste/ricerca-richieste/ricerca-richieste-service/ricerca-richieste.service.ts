import { Injectable } from '@angular/core';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

@Injectable({
  providedIn: 'root'
})
export class RicercaRichiesteService {

  searchTerm: any = {codice: '', descrizione: ''};
  constructor() { }
}
