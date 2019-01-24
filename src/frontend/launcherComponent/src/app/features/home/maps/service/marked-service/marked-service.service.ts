import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MarkedService {

    private marked = new Subject<any>();

    sendMarked(marker: any) {
        this.marked.next(marker);
    }

    clearMarked() {
        this.marked.next();
    }

    getMarked(): Observable<any> {
        return this.marked.asObservable();
    }

}
