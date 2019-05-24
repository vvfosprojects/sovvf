import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class ChiamataServiceFake {

    idChiamata: string;

    constructor() {
    }

    insertChiamata(chiamata: any): Observable<any> {
        return of();
    }

}
