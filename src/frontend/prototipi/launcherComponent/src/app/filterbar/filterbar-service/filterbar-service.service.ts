import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ViewInterface } from '../view-mode/view.interface';

@Injectable({
  providedIn: 'root'
})
export class FilterbarService {

    private subject = new Subject<ViewInterface>();

    sendView(view: ViewInterface) {
        this.subject.next(view);
    }

    clearView() {
        this.subject.next();
    }

    getView(): Observable<ViewInterface> {
        return this.subject.asObservable();
    }
}
