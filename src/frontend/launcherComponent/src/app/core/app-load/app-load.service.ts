import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_TIPOLOGIE } from '../settings/tipologie';
import { environment } from '../../../environments/environment';
import { SignalRService } from '../signalr/signalR.service';
import { Subscription } from 'rxjs';
import { AppSettings } from '../../shared/interface/app-settings.interface';
import { Store } from '@ngxs/store';
import { SetListaSediTreeview } from '../../shared/store/actions/sedi-treeview/sedi-treeview.actions';

const API_URL = environment.apiUrl.appSettings;
const SIGNALR_BYPASS = !environment.signalR;

@Injectable()
export class AppLoadService {

    subscription = new Subscription;
    checkConnectionSignalR: boolean;


    constructor(private http: HttpClient, private signalR: SignalRService, private store: Store) {
        if (!SIGNALR_BYPASS) {
            this.signalR.initSubscription();
            this.subscription.add(this.signalR.checkConnection().subscribe(result => {
                this.checkConnectionSignalR = result;
                if (result) {
                    this.signalR.getContextId();
                    this.signalR.startGetTime();
                }
            }));
        }
    }

    initializeApp(): Promise<any> {
        return new Promise((resolve) => {
            if (!SIGNALR_BYPASS) {
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
                this.signalR.byPassSignalR();
                resolve();
            }
        });
    }

    getSettings(): Promise<any> {
        return this.http.get<AppSettings>(API_URL)
            .toPromise()
            .then(settings => {
                APP_TIPOLOGIE.push(...settings.tipologie);
                this.store.dispatch(new SetListaSediTreeview(settings.listaSedi));
            }).catch();
    }
}
