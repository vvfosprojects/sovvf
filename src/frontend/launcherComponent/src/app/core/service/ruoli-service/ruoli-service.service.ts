import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RuoliService {

    constructor() {
    }

    getRuoli(): Observable<string[]> {
        return;
    }
}
