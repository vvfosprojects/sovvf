import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Subject } from 'rxjs';
import { Store } from '@ngxs/store';
import { SetConnectionId, SignalRHubConnesso, SignalRHubDisconnesso } from './store/signalR.actions';
import { ShowToastr } from '../../shared/store/actions/toastr/toastr.actions';
import { SintesiRichiesta } from '../../shared/model/sintesi-richiesta.model';
import { ChiamataMarker } from '../../features/home/maps/maps-model/chiamata-marker.model';
import { SetRichieste } from '../../features/home/store/actions/richieste/richieste.actions';
import { SignalRNotification } from './model/signalr-notification.model';
import { SetTimeSync } from '../../shared/store/actions/app/app.actions';
import { SetBoxPersonale } from '../../features/home/store/actions/boxes/box-personale.actions';
import { SetBoxMezzi } from '../../features/home/store/actions/boxes/box-mezzi.actions';
import { SetBoxRichieste } from '../../features/home/store/actions/boxes/box-richieste.actions';
import { environment } from '../../../environments/environment';
import { SetRichiesteMarkers } from '../../features/home/store/actions/maps/richieste-markers.actions';
import { SetMezziMarkers } from '../../features/home/store/actions/maps/mezzi-markers.actions';
import { SetSediMarkers } from '../../features/home/store/actions/maps/sedi-markers.actions';
import { SetPreAccoppiati } from '../../features/home/store/actions/composizione-partenza/pre-accoppiati.actions';
import { SetSquadreComposizione } from '../../features/home/store/actions/composizione-partenza/squadre-composizione.actions';
import { SetMezziComposizione } from '../../features/home/store/actions/composizione-partenza/mezzi-composizione.actions';
import { AuthenticationService } from '../auth/_services';
import { Utente } from '../../shared/model/utente.model';
import { SetFiltriComposizione } from '../../features/home/store/actions/composizione-partenza/filterbar-composizione.actions';
import { ToastrType } from '../../shared/enum/toastr';
import { SetDataNavbar } from '../../features/navbar/store/actions/navbar.actions';

const HUB_URL = environment.signalRHub;
const SIGNALR_BYPASS = !environment.signalR;

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    connectionEstablished = new Subject<boolean>();
    private hubNotification: HubConnection;
    private localName = 'userSO115';

    constructor(private store: Store, private auth: AuthenticationService) {
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
            .withUrl(HUB_URL)
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
        this.hubNotification.on('NotifyAuth', (data: Utente) => {
            localStorage.setItem(this.localName, JSON.stringify(data));
            this.auth.currentUserSubject.next(data);
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Sei loggato', '', 3));
        });
        this.hubNotification.on('NotifyLogIn', (data: any) => {
            // console.log(`Login: ${data}`);
            // avvisa gli altri client che un utente si è collegato alla sua stessa sede
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Utente collegato:', data, 3));
        });
        this.hubNotification.on('NotifyLogOut', (data: any) => {
            // console.log(`Logout: ${data}`);
            // avvisa gli altri client che un utente si è scollegato alla sua stessa sede
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Utente disconnesso:', data, 3));
        });
        this.hubNotification.on('ReceiveMessage', (data: string) => {
            // console.log(`Login: ${data}`);
            // avvisa gli altri client che un utente si è collegato alla sua stessa sede
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Notifica importante:', data, 3));
        });


        this.hubNotification.on('SaveAndNotifySuccessChiamata', (data: SintesiRichiesta) => {
            // console.log(`Login: ${data}`);
            // Todo Provvisorio: diventerà inserisci richiesta/inserisci marker/aggiorna contatori boxes con un id di tipo RM-001
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Nuova Sintesi Richiesta', null, 3));
        });
        this.hubNotification.on('ModifyAndNotifySuccess', (data: SintesiRichiesta) => {
            // console.log(`Login: ${data}`);
            // Todo Provvisorio: diventerà modifica richiesta/modifica marker/aggiorna contatori boxes
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Modifica Sintesi Richiesta', null, 3));
        });
        /**
         * inizio nuova implementazione
         */
        this.hubNotification.on('NotifyGetNavbar', (data: any) => {
            // console.log(data);
            this.store.dispatch(new SetDataNavbar(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Dati della Navbar', null, 5));
        });
        this.hubNotification.on('NotifyGetListaRichieste', (data: any) => {
            // console.log(data);
            this.store.dispatch(new SetRichieste(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Richieste ricevute da signalR', null, 5));
        });
        this.hubNotification.on('NotifyGetBoxPersonale', (data: any) => {
            // console.log(data);
            this.store.dispatch(new SetBoxPersonale(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Box Personale ricevute da signalR', null, 5));
        });
        this.hubNotification.on('NotifyGetBoxMezzi', (data: any) => {
            // console.log(data);
            this.store.dispatch(new SetBoxMezzi(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Box Mezzi ricevute da signalR', null, 5));
        });
        this.hubNotification.on('NotifyGetBoxInterventi', (data: any) => {
            // console.log(data);
            this.store.dispatch(new SetBoxRichieste(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Box Richieste ricevute da signalR', null, 5));
        });
        this.hubNotification.on('NotifyGetListaRichiesteMarker', (data: any) => {
            // console.log(data);
            this.store.dispatch(new SetRichiesteMarkers(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Richieste Markers ricevute da signalR', null, 5));
        });
        this.hubNotification.on('NotifyGetListaMezziMarker', (data: any) => {
            // console.log(data);
            this.store.dispatch(new SetMezziMarkers(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Mezzi Markers ricevute da signalR', null, 5));
        });
        this.hubNotification.on('NotifyGetFiltri', (data: any) => {
            console.log('Filtri signalR', data);
            this.store.dispatch(new SetFiltriComposizione(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Filtri Composizione ricevuti da signalR', null, 5));
        });
        this.hubNotification.on('NotifyGetListaSediMarker', (data: any) => {
            // console.log(data);
            this.store.dispatch(new SetSediMarkers(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Sedi Markers ricevute da signalR', null, 5));
        });
        this.hubNotification.on('NotifyGetMezziComposizione', (data: any) => {
            // console.log(data);
            this.store.dispatch(new SetMezziComposizione(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Mezzi Composizione ricevute da signalR', null, 5));
        });
        this.hubNotification.on('NotifyGetSquadreComposizione', (data: any) => {
            // console.log(data);
            this.store.dispatch(new SetSquadreComposizione(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Squadre Composizione ricevute da signalR', null, 5));
        });
        this.hubNotification.on('NotifyGetPreaccoppiatiComposizione', (data: any) => {
            // console.log(data);
            this.store.dispatch(new SetPreAccoppiati(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Preaccoppiati Composizione ricevute da signalR', null, 5));
        });
        /**
         * fine nuova implementazione
         */
        this.hubNotification.on('NotifyChiamataInCorsoMarkerSuccess', (data: ChiamataMarker) => {
            console.log(`Login: ${data}`);
            // Todo Provvisorio: SetChiamataMarker
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Nuova chiamata sulla mappa', null, 3));
        });
        this.hubNotification.on('NotifyChiamataInCorsoMarkerDelete', (data: ChiamataMarker) => {
            console.log(`Login: ${data}`);
            // Todo Provvisorio: ClearChiamataMarker di quell'ID
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Nuova chiamata sulla mappa', null, 3));
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
        this.store.dispatch(new SetConnectionId('N{[=sE=2\\_A/y"J7v;ZMEDcGZ3a$K5Bdmn9UJ]mR{PXd8rx\\M\\tdeE>:2NPH<&!n:s^2;'));
    }

    getContextId() {
        if (!SIGNALR_BYPASS) {
            this.hubNotification.invoke('GetConnectionId').then(connectionId => {
                this.store.dispatch(new SetConnectionId(connectionId));
            });
        }
    }

    startGetTime() {
        if (!SIGNALR_BYPASS) {
            this.hubNotification.invoke('GetDateTime')
                .then((data: any) => {
                    this.store.dispatch(new SetTimeSync(data));
                })
                .catch(() => console.log('GetTime Error'));
        }
    }


    addToGroup(notification: SignalRNotification) {
        if (!SIGNALR_BYPASS) {
            this.hubNotification.invoke('AddToGroup', notification).then(
                () => this.store.dispatch(new ShowToastr(ToastrType.Info, 'Connessione al gruppo effettuata con successo', null, 3))
            ).catch(
                () => this.store.dispatch(new ShowToastr(ToastrType.Warning, 'Connessione al gruppo fallita', null, 3))
            );
        }
    }

    removeToGroup(notification: SignalRNotification) {
        if (!SIGNALR_BYPASS) {
            this.hubNotification.invoke('RemoveToGroup', notification).then(
                () => this.store.dispatch(new ShowToastr(ToastrType.Info, 'Disconnessione al gruppo effettuata con successo', null, 3))
            ).catch(
                () => this.store.dispatch(new ShowToastr(ToastrType.Warning, 'Disconnessione al gruppo fallita', null, 3))
            );
        }
    }

}
