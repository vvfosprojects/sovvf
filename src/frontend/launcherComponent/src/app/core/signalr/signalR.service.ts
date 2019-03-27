import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Subject } from 'rxjs';
import { SIGNALR_CONFIG } from './signalR.config';
import { Store } from '@ngxs/store';
import { SetConnectionId, SignalRHubConnesso, SignalRHubDisconnesso } from './store/signalR.actions';
import { ShowToastr } from '../../shared/store/actions/toastr/toastr.actions';
import { SintesiRichiesta } from '../../shared/model/sintesi-richiesta.model';
import { ChiamataMarker } from '../../features/home/maps/maps-model/chiamata-marker.model';
import { SetRichieste } from '../../features/home/store/actions/richieste/richieste.actions';
import { SignalRNotification } from './model/signalr-notification.model';
import { ToggleChiamata } from '../../features/home/store/actions/view/view.actions';

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    connectionEstablished = new Subject<boolean>();
    private hubNotification: HubConnection;

    constructor(private store: Store) {
    }

    initSubscription(): void {
        this.createSubscriptionConnection();
        this.registerOnSubscriptionEvents();
        this.startSubscriptionConnection();
    }

    checkConnection() {
        return this.connectionEstablished.asObservable();
    }

    private createSubscriptionConnection() {
        this.hubNotification = new HubConnectionBuilder()
            .withUrl(SIGNALR_CONFIG.notification)
            .build();
    }

    private startSubscriptionConnection() {
        this.hubNotification.start().then(() => {
            console.log('Hub Subscription Connesso');
            this.connectionEstablished.next(true);
            this.store.dispatch(new SignalRHubConnesso());
        }).catch(() => {
            console.log('Impossibile effettuare la connessione, riprovo...');
            this.connectionEstablished.next(false);
            setTimeout(() => this.startSubscriptionConnection(), 3000);
        });
    }

    private registerOnSubscriptionEvents(): void {
        this.hubNotification.on('NotifyLogIn', (data: any) => {
            // console.log(`Login: ${data}`);
            // avvisa gli altri client che un utente si è collegato alla sua stessa sede
            this.store.dispatch(new ShowToastr('info', 'Utente collegato:', data, 3));
        });
        this.hubNotification.on('NotifyLogOut', (data: any) => {
            // console.log(`Logout: ${data}`);
            // avvisa gli altri client che un utente si è scollegato alla sua stessa sede
            this.store.dispatch(new ShowToastr('info', 'Utente disconnesso:', data, 3));
        });
        this.hubNotification.on('ReceiveMessage', (data: string) => {
            // console.log(`Login: ${data}`);
            // avvisa gli altri client che un utente si è collegato alla sua stessa sede
            this.store.dispatch(new ShowToastr('info', 'Notifica importante:', data, 3));
        });


        this.hubNotification.on('SaveAndNotifySuccessChiamata', (data: SintesiRichiesta) => {
            console.log(`Login: ${data}`);
            // Todo Provvisorio: diventerà inserisci richiesta/inserisci marker/aggiorna contatori boxes con un id di tipo RM-001
            this.store.dispatch(new ShowToastr('info', 'Nuova Sintesi Richiesta', null, 3));
        });
        this.hubNotification.on('ModifyAndNotifySuccess', (data: SintesiRichiesta) => {
            console.log(`Login: ${data}`);
            // Todo Provvisorio: diventerà modifica richiesta/modifica marker/aggiorna contatori boxes
            this.store.dispatch(new ShowToastr('info', 'Modifica Sintesi Richiesta', null, 3));
        });
        // this.hubNotification.on('NotifyGetListaRichieste', (data: any) => {
        //     this.store.dispatch(new SetRichieste(JSON.parse(data)));
        //     this.store.dispatch(new ShowToastr('success', 'Richieste ricevute da signalR', null, 5));
        // });

        this.hubNotification.on('NotifyChiamataInCorsoMarkerSuccess', (data: ChiamataMarker) => {
            console.log(`Login: ${data}`);
            // Todo Provvisorio: SetChiamataMarker
            this.store.dispatch(new ShowToastr('info', 'Nuova chiamata sulla mappa', null, 3));
        });
        this.hubNotification.on('NotifyChiamataInCorsoMarkerDelete', (data: ChiamataMarker) => {
            console.log(`Login: ${data}`);
            // Todo Provvisorio: ClearChiamataMarker di quell'ID
            this.store.dispatch(new ShowToastr('info', 'Nuova chiamata sulla mappa', null, 3));
        });
        this.hubNotification.onclose(() => {
            console.log('Hub Subscription Disconnesso');
            this.connectionEstablished.next(false);
            this.store.dispatch(new SignalRHubDisconnesso());
            this.startSubscriptionConnection();
        });
    }

    byPassSignalR(): void {
        this.connectionEstablished.next(true);
        this.store.dispatch(new SignalRHubConnesso());
    }

    getContextId() {
        if (!SIGNALR_CONFIG.signlaRByPass) {
            this.hubNotification.invoke('GetConnectionId').then(connectionId => {
                this.store.dispatch(new SetConnectionId(connectionId));
            });
        }
    }


    addToGroup(notification: SignalRNotification) {
        if (!SIGNALR_CONFIG.signlaRByPass) {
            this.hubNotification.invoke('AddToGroup', notification).then(
                () => this.store.dispatch(new ShowToastr('info', 'Connessione al gruppo effettuata con successo', null, 3))
            ).catch(
                () => this.store.dispatch(new ShowToastr('warning', 'Connessione al gruppo fallita', null, 3))
            );
        }
    }

    removeToGroup(notification: SignalRNotification) {
        if (!SIGNALR_CONFIG.signlaRByPass) {
            this.hubNotification.invoke('RemoveToGroup', notification).then(
                () => this.store.dispatch(new ShowToastr('info', 'Disconnessione al gruppo effettuata con successo', null, 3))
            ).catch(
                () => this.store.dispatch(new ShowToastr('warning', 'Disconnessione al gruppo fallita', null, 3))
            );
        }
    }

    insertChiamata(notification: SignalRNotification) {
        if (!SIGNALR_CONFIG.signlaRByPass) {
            this.hubNotification.invoke('SaveAndNotifyChiamata', notification).then(
                (data: SintesiRichiesta) => {
                    // Todo Provvisorio: diventerà inserisci richiesta/inserisci marker/aggiorna contatori boxes con un id di tipo RM-001
                    this.store.dispatch(new ToggleChiamata());
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

    getChiamate(notification?: SignalRNotification) {
        if (!SIGNALR_CONFIG.signlaRByPass) {
            this.hubNotification.invoke('GetAndNotifyListaSintesi').catch(
                (data: string) => {
                    console.log(data);
                    this.store.dispatch(new ShowToastr('error', 'Richieste non ricevute da signalR', data, 5));
                }
            );
        }
    }

    insertMarkerChiamata(notification: SignalRNotification) {
        if (!SIGNALR_CONFIG.signlaRByPass) {
            // Invio a signalR il marker della chiamata che sto effettuando
            this.hubNotification.invoke('NotifyChiamataInCorsoMarker', notification);
        }
    }

    deleteMarkerChiamata(notification: SignalRNotification) {
        if (!SIGNALR_CONFIG.signlaRByPass) {
            // Avviso signalR che il marker della chiamata in corso è da cancellare
            this.hubNotification.invoke('NotifyChiamataInCorsoMarkerDelete', notification);
        }
    }


    modifySintesiRichiesta(notification: SignalRNotification) {
        if (!SIGNALR_CONFIG.signlaRByPass) {
            this.hubNotification.invoke('ModifyAndNotify', notification).then(
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
