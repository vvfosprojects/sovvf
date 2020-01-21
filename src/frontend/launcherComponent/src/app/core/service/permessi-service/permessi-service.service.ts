import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PermessiService {

    constructor() {
    }

    getPermessi(): Observable<string[]> {
        return;
    }
}
