import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { FiltersInterface } from 'src/app/shared/interface/filters.interface';
import { PaginationInterface } from 'src/app/shared/interface/pagination.interface';
import { Observable } from 'rxjs';

const BASE_URL = environment.baseUrl;
const API_ENTE = BASE_URL + environment.apiUrl.trasferimentoChiamata;

@Injectable({
  providedIn: 'root'
})

export class TrasferimentoChiamataService {

  constructor(private http: HttpClient) {
  }

  getTrasferimentoChiamata(filters: FiltersInterface, pagination: PaginationInterface): Observable<any> {
    const obj = {
        // filters: {
        //     search: filters.search
        // },
        pagination
    };
    return this.http.post(API_ENTE, obj);
}

}
