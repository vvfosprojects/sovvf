import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Subject } from 'rxjs';
import { SIGNALR_CONFIG } from './signalR.config';
import { Store } from '@ngxs/store';
import { SignalRHubConnesso, SignalRHubDisconnesso } from './store/signalR.actions';
import { ShowToastr } from '../../shared/store/actions/toastr/toastr.actions';
import { SignalRNotification } from './interface/signalr-notification.interface';
import { SintesiRichiesta } from '../../shared/model/sintesi-richiesta.model';
import { ChiamataMarker } from '../../features/home/maps/maps-model/chiamata-marker.model';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    connectionEstablished = new Subject<boolean>();
    private hubSubscription: HubConnection;
    private hubNotify: HubConnection;
    private hubNotifyMarker: HubConnection;

    constructor(private store: Store) {
    }

    initSubscription(): void {
        this.createSubscriptionConnection();
        this.registerOnSubscriptionEvents();
        this.startSubscriptionConnection();
    }

    initNotify(): void {
        this.createNotifyConnection();
        this.registerOnNotifyEvents();
        this.startNotifyConnection();
    }

    initNotifyMarker(): void {
        this.createNotifyMarkerConnection();
        this.registerOnNotifyMarkerEvents();
        this.startNotifyMarkerConnection();
    }

    checkConnection() {
        return this.connectionEstablished.asObservable();
    }

    private createSubscriptionConnection() {
        this.hubSubscription = new HubConnectionBuilder()
            .withUrl(SIGNALR_CONFIG.subscription)
            .build();
    }

    private startSubscriptionConnection() {
        this.hubSubscription.start().then(() => {
            console.log('Hub Subscription Connesso');
            this.connectionEstablished.next(true);
            this.store.dispatch(new SignalRHubConnesso());
        }).catch(() => {
            console.log('Impossibile effettuare la connessione, riprovo...');
            this.connectionEstablished.next(false);
            setTimeout(() => this.startSubscriptionConnection(), 3000);
        });
    }


    private createNotifyConnection(): void {
        this.hubNotify = new HubConnectionBuilder()
            .withUrl(SIGNALR_CONFIG.notify)
            .build();
    }

    private startNotifyConnection() {
        this.hubNotify.start().then(() => {
            console.log('Hub Notify Connesso');
        }).catch(() => {
            console.log('Impossibile effettuare la connessione con Hub Chiamata, riprovo...');
        });
    }

    private createNotifyMarkerConnection(): void {
        this.hubNotifyMarker = new HubConnectionBuilder()
            .withUrl(SIGNALR_CONFIG.notifyMarkers)
            .build();
    }

    private startNotifyMarkerConnection() {
        this.hubNotifyMarker.start().then(() => {
            console.log('Hub Notify Marker Connesso');
        }).catch(() => {
            console.log('Impossibile effettuare la connessione con Hub Chiamata, riprovo...');
        });
    }

    private registerOnSubscriptionEvents(): void {
        this.hubSubscription.on('NotifyLogIn', (data: any) => {
            // console.log(`Login: ${data}`);
            // avvisa gli altri client che un utente si è collegato alla sua stessa sede
            this.store.dispatch(new ShowToastr('info', 'Utente collegato:', data, 3));
        });
        this.hubSubscription.on('NotifyLogOut', (data: any) => {
            // console.log(`Logout: ${data}`);
            // avvisa gli altri client che un utente si è scollegato alla sua stessa sede
            this.store.dispatch(new ShowToastr('info', 'Utente disconnesso:', data, 3));
        });
        this.hubSubscription.on('ReceiveMessage', (data: string) => {
            // console.log(`Login: ${data}`);
            // avvisa gli altri client che un utente si è collegato alla sua stessa sede
            this.store.dispatch(new ShowToastr('info', 'Notifica importante:', data, 3));
        });
        this.hubSubscription.onclose(() => {
            console.log('Hub Subscription Disconnesso');
            this.connectionEstablished.next(false);
            this.store.dispatch(new SignalRHubDisconnesso());
            this.startSubscriptionConnection();
        });
    }

    private registerOnNotifyEvents(): void {
        this.hubNotify.on('SaveAndNotifySuccessChiamata', (data: SintesiRichiesta) => {
            console.log(`Login: ${data}`);
            // Todo Provvisorio: diventerà inserisci richiesta/inserisci marker/aggiorna contatori boxes con un id di tipo RM-001
            this.store.dispatch(new ShowToastr('info', 'Nuova Sintesi Richiesta', null, 3));
        });
        this.hubNotify.on('ModifyAndNotifySuccess', (data: SintesiRichiesta) => {
            console.log(`Login: ${data}`);
            // Todo Provvisorio: diventerà modifica richiesta/modifica marker/aggiorna contatori boxes
            this.store.dispatch(new ShowToastr('info', 'Modifica Sintesi Richiesta', null, 3));
        });
        this.hubNotify.onclose(() => {
            console.log('Hub Notify Disconnesso');
            this.startNotifyConnection();
        });
    }

    private registerOnNotifyMarkerEvents(): void {
        this.hubNotifyMarker.on('NotifyChiamataInCorsoMarkerSuccess', (data: ChiamataMarker) => {
            console.log(`Login: ${data}`);
            // Todo Provvisorio: SetChiamataMarker
            this.store.dispatch(new ShowToastr('info', 'Nuova chiamata sulla mappa', null, 3));
        });
        this.hubNotifyMarker.on('NotifyChiamataInCorsoMarkerDelete', (data: ChiamataMarker) => {
            console.log(`Login: ${data}`);
            // Todo Provvisorio: ClearChiamataMarker di quell'ID
            this.store.dispatch(new ShowToastr('info', 'Nuova chiamata sulla mappa', null, 3));
        });
        this.hubNotifyMarker.onclose(() => {
            console.log('Hub Notify Marker Disconnesso');
            this.startNotifyConnection();
        });
    }

    byPassSignalR(): void {
        this.connectionEstablished.next(true);
        this.store.dispatch(new SignalRHubConnesso());
    }


    addToGroup(notification: SignalRNotification) {
        if (!SIGNALR_CONFIG.signlaRByPass) {
            this.hubSubscription.invoke('AddToGroup', notification).then(
                () => this.store.dispatch(new ShowToastr('info', 'Connessione al gruppo effettuata con successo', null, 3))
            ).catch(
                () => this.store.dispatch(new ShowToastr('warning', 'Connessione al gruppo fallita', null, 3))
            );
        }
    }

    removeToGroup(notification: SignalRNotification) {
        if (!SIGNALR_CONFIG.signlaRByPass) {
            this.hubSubscription.invoke('RemoveToGroup', notification).then(
                () => this.store.dispatch(new ShowToastr('info', 'Disconnessione al gruppo effettuata con successo', null, 3))
            ).catch(
                () => this.store.dispatch(new ShowToastr('warning', 'Disconnessione al gruppo fallita', null, 3))
            );
        }
    }

    insertChiamata(notification: SignalRNotification) {
        if (!SIGNALR_CONFIG.signlaRByPass) {
            this.hubNotify.invoke('SaveAndNotifyChiamata', notification).then(
                (data: SintesiRichiesta) => {
                    // Todo Provvisorio: diventerà inserisci richiesta/inserisci marker/aggiorna contatori boxes con un id di tipo RM-001
                    this.store.dispatch(new ShowToastr('success', 'Inserimento della chiamata effettuato', null, 5));
                    console.log(data.descrizione);
                }
            ).catch(
                (data: string) => {
                    // mostra alert dell'inserimento fallito della chiamata
                    this.store.dispatch(new ShowToastr('error', 'Inserimento della chiamata fallito', data, 5));
                    console.log(data);
                }
            );
        }
    }

    insertMarkerChiamata(notification: SignalRNotification) {
        if (!SIGNALR_CONFIG.signlaRByPass) {
            // Invio a signalR il marker della chiamata che sto effettuando
            this.hubNotifyMarker.invoke('NotifyChiamataInCorsoMarker', notification);
        }
    }

    deleteMarkerChiamata(notification: SignalRNotification) {
        if (!SIGNALR_CONFIG.signlaRByPass) {
            // Avviso signalR che il marker della chiamata in corso è da cancellare
            this.hubNotifyMarker.invoke('NotifyChiamataInCorsoMarkerDelete', notification);
        }
    }


    modifySintesiRichiesta(notification: SignalRNotification) {
        if (!SIGNALR_CONFIG.signlaRByPass) {
            this.hubNotify.invoke('ModifyAndNotify', notification).then(
                (data: SintesiRichiesta) => {
                    // Todo Provvisorio: diventerà modifica richiesta/modifica marker/aggiorna contatori boxes
                    this.store.dispatch(new ShowToastr('success', 'Modifica effettuata con successo', null, 5));
                    console.log(data.descrizione);
                }
            ).catch(
                (data: string) => {
                    // mostra alert del fallimento della modifica
                    this.store.dispatch(new ShowToastr('error', 'Modifica fallita', data, 5));
                    console.log(data);
                }
            );
        }
    }
}
