import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UpdateEnte, DeleteEnte, AddEnte } from 'src/app/shared/store/actions/enti/enti.actions';

const BASE_URL = environment.baseUrl;
const API_ENTE = BASE_URL + environment.apiUrl.enti;


@Injectable({
  providedIn: 'root'
})
export class RubricaService {

  constructor(private http: HttpClient) {
  }

  getEnti(): Observable<any> {
      return this.http.get(API_ENTE + '/');
  }

  addEnte(addEnte: AddEnte): Observable<any> {
    return this.http.post<any>(API_ENTE + '/Add', addEnte);
  }

  updateEnte(updateEnte: UpdateEnte): Observable<any> {
    return this.http.post<any>(API_ENTE + '/Update', updateEnte);
  }

  deleteEnte(deleteEnte: DeleteEnte): Observable<any> {
    return this.http.post<any>(API_ENTE + '/Delete', deleteEnte);
  }
}