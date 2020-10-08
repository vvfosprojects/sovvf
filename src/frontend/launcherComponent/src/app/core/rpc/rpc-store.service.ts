import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RpcStoreService {

    private localIp = new BehaviorSubject<string>(null);
    private rcpStatus = new Subject<boolean>();

    constructor() {
    }

    public get currentLocalIpValue(): string {
        return this.localIp.value;
    }

    getRcpStatus(): Observable<any> {
        return this.rcpStatus.asObservable();
    }

    setLocalIp(value: string): void {
        this.localIp.next(value);
        this.rcpStatus.next(true);
    }

}
