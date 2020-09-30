import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModificaPartenza } from 'src/app/shared/interface/modifica-partenza.interface';

const BASE_URL = environment.baseUrl;
const API_MODIFICA_PARTENZA = BASE_URL + environment.apiUrl.modificaPartenza;

@Injectable({
  providedIn: 'root'
})

export class ModificaPartenzaService {

  constructor(private http: HttpClient) { }

  addModificaPartenza(obj: ModificaPartenza): Observable<any> {
    return this.http.post(API_MODIFICA_PARTENZA, obj);
  }

}
