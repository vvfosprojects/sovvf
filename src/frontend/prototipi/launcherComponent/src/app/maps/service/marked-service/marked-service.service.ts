import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MarkedService {

    private subject = new Subject<any>();

    sendMarked(marker: any) {
        this.subject.next(marker);
    }

    clearMarked() {
        this.subject.next();
    }

    getMarked(): Observable<any> {
        return this.subject.asObservable();
    }
}
