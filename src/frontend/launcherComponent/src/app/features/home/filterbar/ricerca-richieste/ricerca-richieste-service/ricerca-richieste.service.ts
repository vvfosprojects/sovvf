import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RicercaRichiesteService {

    searchTerm: any = {descrizione: ''};

    private subject = new Subject<any>();

    sendRicerca(ricerca: any) {
        this.subject.next(ricerca);
    }

    getRicerca(): Observable<any> {
        return this.subject.asObservable();
    }
}
