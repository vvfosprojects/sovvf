import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_TIPOLOGIE, TipologieInterface } from '../settings/tipologie';
import { environment } from '../../../environments/environment';
import { SignalRService } from '../signalr/signalR.service';
import { Subscription } from 'rxjs';

const API_URL = environment.apiUrl.elencoTipologie;

@Injectable()
export class AppLoadService {

    subscription = new Subscription;
    checkConnectionSignalR: boolean;
    exitSignalRCheck = false;

    constructor(private http: HttpClient, private signalR: SignalRService) {
        this.signalR.init();
        this.subscription.add(this.signalR.checkConnection().subscribe(result => this.checkConnectionSignalR = result));
    }

    initializeApp(): Promise<any> {
        return new Promise((resolve) => {
            if (!this.exitSignalRCheck) {
                if (this.checkConnectionSignalR) {
                    resolve();
                } else {
                    const interval = setInterval(() => {
                        if (this.checkConnectionSignalR) {
                            resolve();
                            clearInterval(interval);
                        }
                    }, 3000);
                }
            } else {
                resolve();
            }
        });
    }

    getSettings(): Promise<any> {
        return this.http.get<TipologieInterface[]>(API_URL)
            .toPromise()
            .then(settings => {
                APP_TIPOLOGIE.push(...settings);
                return settings;
            }).catch();
    }
}
