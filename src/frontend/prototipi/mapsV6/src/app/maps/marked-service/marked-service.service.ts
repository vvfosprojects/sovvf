import {Injectable} from '@angular/core';
import {RichiestaMarker} from '../maps-model/richiesta-marker.model';
import {Observable, of, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MarkedService {

    private subject = new Subject<RichiestaMarker>();

    sendMarked(marker: RichiestaMarker) {
        this.subject.next(marker);
    }

    clearMarked() {
        this.subject.next();
    }

    getMarked(): Observable<RichiestaMarker> {
        return this.subject.asObservable();
    }
}
