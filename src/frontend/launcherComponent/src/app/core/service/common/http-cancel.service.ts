import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class HttpCancelService {

    private pendingHTTPRequests$ = new Subject<void>();

    public cancelPendingRequests(): void {
        this.pendingHTTPRequests$.next();
    }

    public onCancelPendingRequests(): Observable<any> {
        return this.pendingHTTPRequests$.asObservable();
    }

}
