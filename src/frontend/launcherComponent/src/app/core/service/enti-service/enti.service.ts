import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
    AddEnteInterface,
    CategoriaEnte,
    DeleteEnteInterface,
    ResponseAddEnteRubricaInterface,
    ResponseDeleteEnteRubricaInterface,
    ResponseUpdateEnteRubricaInterface,
    UpdateEnteRubricaInterface
} from '../../../shared/interface/ente.interface';

const BASE_URL = environment.baseUrl;
const API_ENTE = BASE_URL + environment.apiUrl.enti;


@Injectable({
    providedIn: 'root'
})
export class EntiService {

    constructor(private http: HttpClient) {
    }

    getCategorie(): Observable<CategoriaEnte[]> {
        return this.http.get<CategoriaEnte[]>(API_ENTE + '/GetCategorie');
    }

    add(addEnte: AddEnteInterface): Observable<ResponseAddEnteRubricaInterface> {
        return this.http.post<ResponseAddEnteRubricaInterface>(API_ENTE + '/Add', addEnte);
    }

    update(updateEnte: UpdateEnteRubricaInterface): Observable<ResponseUpdateEnteRubricaInterface> {
        return this.http.post<ResponseUpdateEnteRubricaInterface>(API_ENTE + '/Update', updateEnte);
    }

    delete(deleteEnte: DeleteEnteInterface): Observable<ResponseDeleteEnteRubricaInterface> {
        return this.http.get<ResponseDeleteEnteRubricaInterface>(API_ENTE + '/Delete?Id=' + deleteEnte.id);
    }

}
