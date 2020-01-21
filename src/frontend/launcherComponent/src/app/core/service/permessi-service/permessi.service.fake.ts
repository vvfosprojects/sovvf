import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PermessiServiceFake {

    permessi: string[];

    constructor() {
    }

    getPermessi(): Observable<string[]> {
        this.permessi = [];
        return of(this.permessi);
    }

}
