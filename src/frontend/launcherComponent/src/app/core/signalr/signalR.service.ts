import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Subject } from 'rxjs';
import { Store } from '@ngxs/store';
import { SetConnectionId, SignalRHubConnesso, SignalRHubDisconnesso } from './store/signalR.actions';
import { ShowToastr } from '../../shared/store/actions/toastr/toastr.actions';
import { UpdateRichiesta } from '../../features/home/store/actions/richieste/richieste.actions';
import { SignalRNotification } from './model/signalr-notification.model';
import { SetTimeSync } from '../../shared/store/actions/app/app.actions';
import { SetBoxPersonale } from '../../features/home/store/actions/boxes/box-personale.actions';
import { SetBoxMezzi } from '../../features/home/store/actions/boxes/box-mezzi.actions';
import { SetBoxRichieste } from '../../features/home/store/actions/boxes/box-richieste.actions';
import { environment } from '../../../environments/environment';
import { ToastrType } from '../../shared/enum/toastr';
import { InsertChiamataSuccess } from '../../features/home/store/actions/chiamata/scheda-telefonata.actions';
import {
    InsertChiamataMarker,
    RemoveChiamataMarker,
    UpdateItemChiamataMarker
} from '../../features/home/store/actions/maps/chiamate-markers.actions';
import {
    AddBookMezzoComposizione,
    RemoveBookingMezzoComposizione,
    RemoveBookMezzoComposizione,
    SetListaMezziComposizione,
    UpdateMezzoComposizione
} from '../../features/home/store/actions/composizione-partenza/mezzi-composizione.actions';
import {
    SetListaSquadreComposizione
} from '../../features/home/store/actions/composizione-partenza/squadre-composizione.actions';
import { RemoveBoxPartenzaByMezzoId } from '../../features/home/store/actions/composizione-partenza/box-partenza.actions';
import {
    InsertRichiestaMarker,
    UpdateRichiestaMarker
} from '../../features/home/store/actions/maps/richieste-markers.actions';
import { ComposizionePartenzaState } from '../../features/home/store/states/composizione-partenza/composizione-partenza.state';
import { Composizione } from '../../shared/enum/composizione.enum';
import {
    GetListaComposizioneVeloce,
    SetListaComposizioneVeloce, SetListaIdPreAccoppiati,
    UpdateMezzoPreAccoppiatoComposizione
} from '../../features/home/store/actions/composizione-partenza/composizione-veloce.actions';
import { SetMezziInServizio } from 'src/app/features/home/store/actions/mezzi-in-servizio/mezzi-in-servizio.actions';
import { ViewComponentState } from '../../features/home/store/states/view/view.state';
import { GetListeComposizioneAvanzata } from '../../features/home/store/actions/composizione-partenza/composizione-avanzata.actions';
import { IdPreaccoppiati } from '../../features/home/composizione-partenza/interface/id-preaccoppiati-interface';

const HUB_URL = environment.signalRHub;
const SIGNALR_BYPASS = !environment.signalR;

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

        /**
         * Login
         */
        this.hubNotification.on('NotifyLogIn', (data: any) => {
            console.log('NotifyLogIn', data);
            // avvisa gli altri client che un utente si è collegato alla sua stessa sede
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Utente collegato:', data, 3));
        });
        this.hubNotification.on('NotifyLogOut', (data: any) => {
            console.log('NotifyLogOut', data);
            // avvisa gli altri client che un utente si è scollegato alla sua stessa sede
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Utente disconnesso:', data, 3));
        });

        /**
         * Message
         */
        this.hubNotification.on('ReceiveMessage', (data: string) => {
            console.log('ReceiveMessage', data);
            // avvisa gli altri client che un utente si è collegato alla sua stessa sede
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Notifica importante:', data, 3));
        });

        /**
         * Modifica Richiesta
         */
        this.hubNotification.on('ModifyAndNotifySuccess', (data: any) => {
            console.log('ModifyAndNotifySuccess:', data);
            this.store.dispatch(new UpdateRichiesta(data.chiamata));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Modifica Sintesi Richiesta', null, 3));
        });

        /**
         * Cambiamento Stato Squadra/Mezzi Richiesta
         */
        this.hubNotification.on('ChangeStateSuccess', (data: any) => {
            console.log('ChangeStateSuccess:', data);
            const composizioneMode = this.store.selectSnapshot(ViewComponentState.composizioneStatus);
            if (composizioneMode) {
                const compMode = this.store.selectSnapshot(ViewComponentState.composizioneMode);
                if (compMode === Composizione.Avanzata) {
                    this.store.dispatch(new GetListeComposizioneAvanzata());
                } else if (compMode === Composizione.Veloce) {
                    // Todo: scatta lo stesso metodo... non serve questo controllo
                    // this.store.dispatch(new GetListaComposizioneVeloce());
                }
            }
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Modifica Stato Squadra/Mezzi Richiesta', null, 3));
        });

        /**
         * Mezzi In Servizio
         */
        // TodoBackEnd: da finire
        this.hubNotification.on('NotifyGetListaMezziInServizio', (data: any) => {
            console.log('NotifyGetListaMezziInServizio', data);
            this.store.dispatch(new SetMezziInServizio(data));
        });

        /**
         * Markers Mappa --------------
         */
        this.hubNotification.on('NotifyGetRichiestaMarker', (data: any) => {
            console.log('NotifyGetRichiestaMarker', data);
            this.store.dispatch(new InsertRichiestaMarker(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Richiesta Marker ricevute da signalR', null, 5));
        });
        this.hubNotification.on('NotifyGetRichiestaUpdateMarker', (data: any) => {
            console.log('NotifyGetRichiestaUpdateMarker', data);
            this.store.dispatch(new UpdateRichiestaMarker(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Richiesta Marker ricevute da signalR', null, 5));
        });

        /**
         * Box
         */
        this.hubNotification.on('NotifyGetBoxPersonale', (data: any) => {
            console.log('NotifyGetBoxPersonale', data);
            this.store.dispatch(new SetBoxPersonale(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Box Personale ricevute da signalR', null, 5));
        });
        this.hubNotification.on('NotifyGetBoxMezzi', (data: any) => {
            console.log('NotifyGetBoxMezzi', data);
            this.store.dispatch(new SetBoxMezzi(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Box Mezzi ricevute da signalR', null, 5));
        });
        this.hubNotification.on('NotifyGetBoxInterventi', (data: any) => {
            console.log('NotifyGetBoxInterventi', data);
            this.store.dispatch(new SetBoxRichieste(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Box Richieste ricevute da signalR', null, 5));
        });

        /**
         * Chiamata in Corso
         */
        this.hubNotification.on('NotifyChiamataInCorsoMarkerAdd', (data: any) => {
            console.log('NotifyChiamataInCorsoMarkerAdd', data);
            this.store.dispatch(new InsertChiamataMarker(data.addChiamataInCorso));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Nuova chiamata in corso sulla mappa', null, 3));
        });
        this.hubNotification.on('NotifyChiamataInCorsoMarkerUpdate', (data: any) => {
            console.log('NotifyChiamataInCorsoMarkerUpdate', data);
            this.store.dispatch(new UpdateItemChiamataMarker(data.chiamataInCorso));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Chiamata in corso sulla mappa aggiornata', null, 3));
        });
        this.hubNotification.on('NotifyChiamataInCorsoMarkerDelete', (id: string) => {
            console.log('NotifyChiamataInCorsoMarkerDelete', id);
            this.store.dispatch(new RemoveChiamataMarker(id));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Chiamata in corso sulla mappa rimossa', null, 3));
        });

        /**
         * Inserimento Chiamata
         */
        this.hubNotification.on('SaveAndNotifySuccessChiamata', (data: any) => {
            console.log('SaveAndNotifySuccessChiamata', data);
            this.store.dispatch(new InsertChiamataSuccess(data));
        });

        /**
         * Composizione Partenza
         */
        this.hubNotification.on('NotifyGetComposizioneMezzi', (data: any) => {
            console.log('NotifyGetComposizioneMezzi', data);
            this.store.dispatch(new SetListaMezziComposizione(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Mezzi Composizione ricevute da signalR', null, 5));
        });
        this.hubNotification.on('NotifyGetComposizioneSquadre', (data: any) => {
            console.log('NotifyGetComposizioneSquadre', data);
            this.store.dispatch(new SetListaSquadreComposizione(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Squadre Composizione ricevute da signalR', null, 5));
        });
        this.hubNotification.on('NotifyGetPreaccoppiati', (data: IdPreaccoppiati[]) => {
            console.log('NotifyGetPreaccoppiatiComposizione', data);
            this.store.dispatch(new SetListaIdPreAccoppiati(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Preaccoppiati Composizione ricevute da signalR', null, 5));
        });
        this.hubNotification.on('NotifyAddPrenotazioneMezzo', (data: any) => {
            const compMode = this.store.selectSnapshot(ComposizionePartenzaState).composizioneMode;
            if (compMode === Composizione.Avanzata) {
                this.store.dispatch(new AddBookMezzoComposizione(data.mezzoPrenotato.mezzoComposizione));
                this.store.dispatch(new RemoveBookingMezzoComposizione(data.mezzoPrenotato.mezzoComposizione));
                this.store.dispatch(new UpdateMezzoComposizione(data.mezzoPrenotato.mezzoComposizione));
            } else if (compMode === Composizione.Veloce) {
                this.store.dispatch(new UpdateMezzoPreAccoppiatoComposizione(data.mezzoPrenotato.mezzoComposizione));
            }
            const mezzoComp = data.mezzoPrenotato.mezzoComposizione;
            let dataScadenzaSelezione = new Date(mezzoComp.istanteScadenzaSelezione).getHours() + ':';
            dataScadenzaSelezione += new Date(mezzoComp.istanteScadenzaSelezione).getMinutes() + ':';
            dataScadenzaSelezione += new Date(mezzoComp.istanteScadenzaSelezione).getSeconds();
            const idRichiesta = data.mezzoPrenotato.mezzoComposizione.idRichiesta;
            this.store.dispatch(new ShowToastr(
                ToastrType.Info,
                'Mezzo Prenotato',
                'Mezzo ' + mezzoComp.mezzo.descrizione + ' prenotato fino alle ' + dataScadenzaSelezione + ' sulla richiesta ' + idRichiesta,
                5)
            );
            console.log('Mezzo prenotato signalr', data.mezzoPrenotato.mezzoComposizione);
        });

        this.hubNotification.on('NotifyRemovePrenotazioneMezzo', (data: any) => {
            const compMode = this.store.selectSnapshot(ComposizionePartenzaState).composizioneMode;
            if (compMode === Composizione.Avanzata) {
                this.store.dispatch(new RemoveBookMezzoComposizione(data.mezzoPrenotato.mezzoComposizione));
                this.store.dispatch(new UpdateMezzoComposizione(data.mezzoPrenotato.mezzoComposizione));
                this.store.dispatch(new RemoveBoxPartenzaByMezzoId(data.mezzoPrenotato.mezzoComposizione.mezzo.codice));
            } else if (compMode === Composizione.Veloce) {
                this.store.dispatch(new UpdateMezzoPreAccoppiatoComposizione(data.mezzoPrenotato.mezzoComposizione));
            }
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Prenotazione Scaduta', 'La prenotazione del mezzo ' + data.mezzoPrenotato.mezzoComposizione.mezzo.codice + ' è scaduta.', 5));
            console.log('Mezzo remove prenotato signalr', data.mezzoPrenotato.mezzoComposizione);
        });
        this.hubNotification.on('NotifyResetPrenotazioneMezzo', (data: any) => {
            const compMode = this.store.selectSnapshot(ComposizionePartenzaState).composizioneMode;
            if (compMode === Composizione.Avanzata) {
                this.store.dispatch(new UpdateMezzoComposizione(data.mezzoPrenotato.mezzoComposizione));
            } else if (compMode === Composizione.Veloce) {
                this.store.dispatch(new UpdateMezzoPreAccoppiatoComposizione(data.mezzoPrenotato.mezzoComposizione));
            }
            console.log('[SignalR] Reset Prenotazione Mezzo', data.mezzoPrenotato.mezzoComposizione);
        });
        /**
         * Disconnessione SignalR
         */
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
        this.store.dispatch(new SetConnectionId('N{[=sE=2\\_A/y"J7v;ZMEDcGZ3a$K53dmn9UJ]mR{PXd8rx\\M\\tdeE>:2NPH<3!n:s^2;'));
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
            console.log(notification);
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
