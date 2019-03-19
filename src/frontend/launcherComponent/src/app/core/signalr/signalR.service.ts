import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Subject } from 'rxjs';
import { SIGNALR_CONFIG } from './signalR.config';
import { Store } from '@ngxs/store';
import { SignalRHubConnesso, SignalRHubDisconnesso } from './store/signalR.actions';
import { ShowToastr } from '../../shared/store/actions/toastr/toastr.actions';
import { SignalRNotification } from './interface/signalr-notification.interface';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    connectionEstablished = new Subject<boolean>();
    private hubConnection: HubConnection;

    constructor(private store: Store) {
    }

    init(): void {
        this.createConnection();
        this.registerOnServerEvents();
        this.startConnection();
    }

    checkConnection() {
        return this.connectionEstablished.asObservable();
    }

    addToGroup(notification: SignalRNotification) {
        if (!SIGNALR_CONFIG.signlaRByPass) {
            this.hubConnection.invoke('AddToGroup', notification);
        }
    }

    removeToGroup(notification: SignalRNotification) {
        if (!SIGNALR_CONFIG.signlaRByPass) {
            this.hubConnection.invoke('RemoveToGroup', notification);
        }
    }

    private createConnection() {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(SIGNALR_CONFIG.baseUrls)
            .build();
    }

    private startConnection() {
        this.hubConnection.start().then(() => {
            console.log('Hub connesso');
            this.connectionEstablished.next(true);
            this.store.dispatch(new SignalRHubConnesso());
        }).catch(() => {
            console.log('Impossibile effettuare la connessione, riprovo...');
            this.connectionEstablished.next(false);
            setTimeout(() => this.startConnection(), 3000);
        });
    }

    private registerOnServerEvents(): void {
        this.hubConnection.on('ReceiveMessage', (data: any) => {
            console.log(`Login: ${data}`);
        });
        this.hubConnection.on('NotifyLogIn', (data: any) => {
            // console.log(`Login: ${data}`);
            this.store.dispatch(new ShowToastr('info', 'Utente collegato:', data, 3));
        });
        this.hubConnection.on('NotifyLogOut', (data: any) => {
            // console.log(`Logout: ${data}`);
            this.store.dispatch(new ShowToastr('info', 'Utente disconnesso:', data, 3));
        });
        this.hubConnection.onclose(() => {
            console.log('Hub Disconnesso');
            this.connectionEstablished.next(false);
            this.store.dispatch(new SignalRHubDisconnesso());
            this.startConnection();
        });
    }

    byPassSignalR(): void {
        this.connectionEstablished.next(true);
        this.store.dispatch(new SignalRHubConnesso());
    }
}
