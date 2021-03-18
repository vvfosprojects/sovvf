import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModificaPartenzaDto } from 'src/app/shared/interface/dto/modifica-partenza-dto.interface';
import { SostituzionePartenzaFineTurnoDto } from '../../../shared/interface/dto/sostituzione-partenza-fine-turno-dto.interface';

const BASE_URL = environment.baseUrl;
const API_MODIFICA_PARTENZA = BASE_URL + environment.apiUrl.modificaPartenza;
const API_SOSTITUZIONE_FINE_TURNO = BASE_URL + environment.apiUrl.sostituzionePartenza;

@Injectable({
    providedIn: 'root'
})

export class ModificaPartenzaService {

    constructor(private http: HttpClient) {
    }

    addModificaPartenza(obj: ModificaPartenzaDto): Observable<any> {
        return this.http.post<ModificaPartenzaDto>(API_MODIFICA_PARTENZA, obj);
    }

    addSostituzioneFineTurno(obj: SostituzionePartenzaFineTurnoDto): Observable<any> {
        return this.http.post<SostituzionePartenzaFineTurnoDto>(API_SOSTITUZIONE_FINE_TURNO, obj);
    }

}
