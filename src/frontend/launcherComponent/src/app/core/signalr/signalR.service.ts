import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Subject } from 'rxjs';
import { Store } from '@ngxs/store';
import { SetConnectionId, SignalRHubConnesso, SignalRHubDisconnesso } from './store/signalR.actions';
import { ShowToastr } from '../../shared/store/actions/toastr/toastr.actions';
import { StopLoadingActionMezzo, UpdateRichiesta } from '../../features/home/store/actions/richieste/richieste.actions';
import { SignalRNotification } from './model/signalr-notification.model';
import { SetTimeSync } from '../../shared/store/actions/app/app.actions';
import { SetBoxPersonale } from '../../features/home/store/actions/boxes/box-personale.actions';
import { SetBoxMezzi } from '../../features/home/store/actions/boxes/box-mezzi.actions';
import { SetBoxRichieste } from '../../features/home/store/actions/boxes/box-richieste.actions';
import { environment } from '../../../environments/environment';
import { ToastrType } from '../../shared/enum/toastr';
import { ApriModaleRichiestaDuplicata, InsertChiamataSuccess } from '../../features/home/store/actions/chiamata/scheda-telefonata.actions';
import { InsertChiamataMarker, RemoveChiamataMarker, UpdateItemChiamataMarker } from '../../features/home/store/actions/maps/chiamate-markers.actions';
import {
    AddBookMezzoComposizione,
    RemoveBookingMezzoComposizione,
    RemoveBookMezzoComposizione,
    SetListaMezziComposizione,
    UpdateMezzoComposizione,
    UpdateMezzoComposizioneScadenzaByCodiceMezzo
} from '../../features/home/store/actions/composizione-partenza/mezzi-composizione.actions';
import { InsertRichiestaMarker, UpdateRichiestaMarker } from '../../features/home/store/actions/maps/richieste-markers.actions';
import { ComposizionePartenzaState } from '../../features/home/store/states/composizione-partenza/composizione-partenza.state';
import { Composizione } from '../../shared/enum/composizione.enum';
import { SetListaIdPreAccoppiati, UpdateMezzoPreAccoppiatoComposizione } from '../../features/home/store/actions/composizione-partenza/composizione-veloce.actions';
import { SetMezziInServizio, UpdateMezzoInServizio } from 'src/app/features/home/store/actions/mezzi-in-servizio/mezzi-in-servizio.actions';
import { IdPreaccoppiati } from '../../features/home/composizione-partenza/interface/id-preaccoppiati-interface';
import { UpdateMezzoMarker } from '../../features/home/store/actions/maps/mezzi-markers.actions';
import {
    InsertSchedeContatto,
    RemoveSchedeContatto,
    SetContatoriSchedeContatto,
    SetListaSchedeContatto,
    UpdateSchedaContatto
} from 'src/app/features/home/store/actions/schede-contatto/schede-contatto.actions';
import { ContatoriSchedeContatto } from '../../shared/interface/contatori-schede-contatto.interface';
import { SchedaContatto } from '../../shared/interface/scheda-contatto.interface';
import { SuccessAddUtenteGestione, SuccessRemoveUtente, UpdateUtenteGestioneInLista } from '../../features/gestione-utenti/store/actions/gestione-utenti/gestione-utenti.actions';
import { Navigate } from '@ngxs/router-plugin';
import { InterventoInterface } from './interface/intervento.interface';
import { MezzoInServizio } from '../../shared/interface/mezzo-in-servizio.interface';
import { RichiestaMarker } from '../../features/home/maps/maps-model/richiesta-marker.model';
import { MezzoMarker } from '../../features/home/maps/maps-model/mezzo-marker.model';
import { BoxPersonale } from '../../features/home/boxes/boxes-model/box-personale.model';
import { BoxMezzi } from '../../features/home/boxes/boxes-model/box-mezzi.model';
import { BoxInterventi } from '../../features/home/boxes/boxes-model/box-interventi.model';
import { ChiamataMarker } from '../../features/home/maps/maps-model/chiamata-marker.model';
import { SintesiRichiesta } from '../../shared/model/sintesi-richiesta.model';
import { MezzoComposizione } from '../../features/home/composizione-partenza/interface/mezzo-composizione-interface';
import { AuthState } from '../../features/auth/store/auth.state';
import { ClearCurrentUser, UpdateRuoliPersonali } from '../../features/auth/store/auth.actions';
import { ViewComponentState } from '../../features/home/store/states/view/view.state';
import { ResponseAddEnteRubricaInterface, ResponseDeleteEnteRubricaInterface, ResponseUpdateEnteRubricaInterface, Ente } from '../../shared/interface/ente.interface';
import { AddVoceRubrica, DeleteVoceRubrica, UpdateVoceRubrica } from '../../features/rubrica/store/actions/rubrica/rubrica.actions';
import { SetEnti } from '../../shared/store/actions/enti/enti.actions';
import { PatchPagination } from '../../shared/store/actions/pagination/pagination.actions';
import { PaginationState } from '../../shared/store/states/pagination/pagination.state';

const HUB_URL = environment.baseUrl + environment.signalRHub;
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
        this.hubNotification.on('NotifyLogIn', (data: string) => {
            console.log('NotifyLogIn', data);
            // avvisa gli altri client che un utente si è collegato alla sua stessa sede
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Utente collegato:', data, 3, null, true));
        });
        this.hubNotification.on('NotifyLogOut', (data: string) => {
            console.log('NotifyLogOut', data);
            // avvisa gli altri client che un utente si è scollegato alla sua stessa sede
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Utente disconnesso:', data, 3, null, true));
        });

        /**
         * Modifica Richiesta
         */
        this.hubNotification.on('ModifyAndNotifySuccess', (data: InterventoInterface) => {
            console.log('ModifyAndNotifySuccess:', data);
            this.store.dispatch(new UpdateRichiesta(data.chiamata));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Modifica Sintesi Richiesta', null, 3));
        });

        /**
         * Cambiamento Stato Squadra/Mezzi Richiesta
         */
        this.hubNotification.on('ChangeStateSuccess', (data: boolean) => {
            console.log('ChangeStateSuccess:', data);
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Modifica Stato Squadra/Mezzi Richiesta', null, 3));
        });

        /**
         * Mezzi In Servizio
         */
        this.hubNotification.on('NotifyGetListaMezziInServizio', (data: MezzoInServizio[]) => {
            console.log('NotifyGetListaMezziInServizio', data);
            this.store.dispatch(new SetMezziInServizio(data));
            this.store.dispatch(new StopLoadingActionMezzo());
        });
        this.hubNotification.on('NotifyUpdateMezzoInServizio', (data: MezzoInServizio) => {
            console.log('NotifyUpdateMezzoInServizio', data);
            const mezziInServizioActive = this.store.selectSnapshot(ViewComponentState.mezziInServizio);
            const composizionePartenzaActive = this.store.selectSnapshot(ViewComponentState.composizioneStatus);
            if (mezziInServizioActive) {
                this.store.dispatch(new UpdateMezzoInServizio(data));
            } else if (composizionePartenzaActive) {
                this.store.dispatch(new UpdateMezzoComposizione(data.mezzo.mezzo));
            }
            this.store.dispatch(new StopLoadingActionMezzo());
        });

        /**
         * Markers Mappa
         */
        this.hubNotification.on('NotifyGetRichiestaMarker', (data: RichiestaMarker) => {
            console.log('NotifyGetRichiestaMarker', data);
            this.store.dispatch(new InsertRichiestaMarker(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Richiesta Marker ricevute da signalR', null, 5));
        });
        this.hubNotification.on('NotifyGetRichiestaUpdateMarker', (data: RichiestaMarker) => {
            console.log('NotifyGetRichiestaUpdateMarker', data);
            this.store.dispatch(new UpdateRichiestaMarker(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Richiesta Marker ricevute da signalR', null, 5));
        });
        this.hubNotification.on('NotifyGetMezzoUpdateMarker', (data: MezzoMarker) => {
            console.log('NotifyGetMezzoUpdateMarker', data);
            this.store.dispatch(new UpdateMezzoMarker(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Richiesta Marker ricevute da signalR', null, 5));
        });

        /**
         * Box
         */
        this.hubNotification.on('NotifyGetBoxPersonale', (data: BoxPersonale) => {
            console.log('NotifyGetBoxPersonale', data);
            this.store.dispatch(new SetBoxPersonale(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Box Personale ricevute da signalR', null, 5));
        });
        this.hubNotification.on('NotifyGetBoxMezzi', (data: BoxMezzi) => {
            console.log('NotifyGetBoxMezzi', data);
            this.store.dispatch(new SetBoxMezzi(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Box Mezzi ricevute da signalR', null, 5));
        });
        this.hubNotification.on('NotifyGetBoxInterventi', (data: BoxInterventi) => {
            console.log('NotifyGetBoxInterventi', data);

            this.store.dispatch(new SetBoxRichieste(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Box Richieste ricevute da signalR', null, 5));
        });

        /**
         * Chiamata in Corso
         */
        this.hubNotification.on('NotifyChiamataInCorsoMarkerAdd', (data: { addChiamataInCorso: ChiamataMarker }) => {
            console.log('NotifyChiamataInCorsoMarkerAdd', data);
            this.store.dispatch(new InsertChiamataMarker(data.addChiamataInCorso));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Nuova chiamata in corso sulla mappa', null, 3));
        });
        this.hubNotification.on('NotifyChiamataInCorsoMarkerUpdate', (data: { chiamataInCorso: ChiamataMarker }) => {
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
        this.hubNotification.on('NotifyDoppioneChiamataInCorso', (message: string) => {
            console.log('NotifyDoppioneChiamataInCorso', message);
            this.store.dispatch(new ApriModaleRichiestaDuplicata(message));
        });
        this.hubNotification.on('SaveAndNotifySuccessChiamata', (data: SintesiRichiesta) => {
            console.log('SaveAndNotifySuccessChiamata', data);
            this.store.dispatch(new InsertChiamataSuccess(data));
        });

        /**
         * Schede Contatto
         */
        this.hubNotification.on('NotifyGetContatoriSchedeContatto', (data: ContatoriSchedeContatto) => {
            console.log('NotifyGetContatoriSchedeContatto', data);
            this.store.dispatch(new SetContatoriSchedeContatto(data));
        });
        this.hubNotification.on('NotifyGetListaSchedeContatto', (data: SchedaContatto[]) => {
            console.log('NotifyGetListaSchedeContatto', data);
            this.store.dispatch(new SetListaSchedeContatto(data));
        });
        this.hubNotification.on('NotifyInsertSchedeContatto', (data: SchedaContatto[]) => {
            console.log('NotifyGetListaSchedeContatto', data);
            this.store.dispatch(new InsertSchedeContatto(data));
        });
        this.hubNotification.on('NotifyUpdateSchedaContatto', (data: SchedaContatto) => {
            console.log('NotifyUpdateSchedaContatto', data);
            this.store.dispatch(new UpdateSchedaContatto(data));
        });
        this.hubNotification.on('NotifyRemoveSchedeContatto', (data: string[]) => {
            console.log('NotifyRemoveSchedeContatto', data);
            this.store.dispatch(new RemoveSchedeContatto(data));
        });

        /**
         * Allerta Sedi
         */
        this.hubNotification.on('NotifyAllertaAltreSedi', (data: any) => {
            console.log('NotifyAllertaAltreSedi', data);
        });


        /**
         * Composizione Partenza
         */
        this.hubNotification.on('NotifyGetComposizioneMezzi', (data: MezzoComposizione[]) => {
            console.log('NotifyGetComposizioneMezzi', data);
            this.store.dispatch(new SetListaMezziComposizione(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Mezzi Composizione ricevute da signalR', null, 5));
        });

        // Todo: è ancora utilizzato?
        this.hubNotification.on('NotifyGetComposizioneSquadre', (data: any) => {
            console.log('NotifyGetComposizioneSquadre', data);
            // this.store.dispatch(new SetListaSquadreComposizione(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Squadre Composizione ricevute da signalR', null, 5));
        });
        this.hubNotification.on('NotifyGetPreaccoppiati', (data: IdPreaccoppiati[]) => {
            this.store.dispatch(new SetListaIdPreAccoppiati(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Preaccoppiati Composizione ricevute da signalR', null, 5));
        });

        // Todo: tipicizzare
        this.hubNotification.on('NotifyAddPrenotazioneMezzo', (data: any) => {
            if (!data.sbloccaMezzo) {
                const compMode = this.store.selectSnapshot(ComposizionePartenzaState).composizioneMode;
                if (compMode === Composizione.Avanzata) {
                    this.store.dispatch(new AddBookMezzoComposizione(data.codiceMezzo));
                    this.store.dispatch(new RemoveBookingMezzoComposizione(data.codiceMezzo));
                    this.store.dispatch(new UpdateMezzoComposizioneScadenzaByCodiceMezzo(data.codiceMezzo, data.istanteScadenzaSelezione));
                } else if (compMode === Composizione.Veloce) {
                    this.store.dispatch(new UpdateMezzoPreAccoppiatoComposizione(data.codiceMezzo));
                }
                console.log('Mezzo prenotato signalr', data);
            } else if (data.sbloccaMezzo) {
                const compMode = this.store.selectSnapshot(ComposizionePartenzaState).composizioneMode;
                if (compMode === Composizione.Avanzata) {
                    this.store.dispatch(new RemoveBookMezzoComposizione(data.codiceMezzo));
                    this.store.dispatch(new UpdateMezzoComposizioneScadenzaByCodiceMezzo(data.codiceMezzo, null));
                } else if (compMode === Composizione.Veloce) {
                    this.store.dispatch(new UpdateMezzoPreAccoppiatoComposizione(data.codiceMezzo));
                }
                console.log('Mezzo remove prenotato signalr', data);
            }
        });

        /**
         * Gestione Utenti
         */
        this.hubNotification.on('NotifyAddUtente', (codSede: string) => {
            console.log('NotifyAddUtente', codSede);
            this.store.dispatch(new SuccessAddUtenteGestione(codSede));
        });

        this.hubNotification.on('NotifyModificatoRuoloUtente', (idUtente: string) => {
            console.log('NotifyModificatoRuoloUtente', idUtente);
            if (idUtente) {
                const utenteAttuale = this.store.selectSnapshot(AuthState.currentUser);
                if (idUtente === utenteAttuale.id) {
                    this.store.dispatch(new UpdateRuoliPersonali(idUtente));
                } else {
                    this.store.dispatch(new UpdateUtenteGestioneInLista(idUtente));
                }
            }
        });

        this.hubNotification.on('NotifyDeleteUtente', (idUtente: string) => {
            console.log('NotifyDeleteUtente', idUtente);
            const utenteAttuale = this.store.selectSnapshot(AuthState.currentUser);
            if (idUtente && idUtente === utenteAttuale.id) {
                this.store.dispatch(new ClearCurrentUser());
                this.store.dispatch(new Navigate(['/login']));
            }
            this.store.dispatch(new SuccessRemoveUtente(idUtente));
        });

        /**
         * Rubrica
         */
        this.hubNotification.on('NotifyChangeEnti', (enti: Ente[]) => {
            console.log('NotifyChangeEnti', enti);
            this.store.dispatch(new SetEnti(enti));
        });

        this.hubNotification.on('NotifyAddEnte', (response: ResponseAddEnteRubricaInterface) => {
            console.log('NotifyAddEnte', response);
            this.store.dispatch(new AddVoceRubrica());
            const pagination = this.store.selectSnapshot(PaginationState.pagination);
            this.store.dispatch(new PatchPagination({ ...pagination, totalItems: response.pagination.totalItems }));
        });

        this.hubNotification.on('NotifyUpdateEnte', (response: ResponseUpdateEnteRubricaInterface) => {
            console.log('NotifyUpdateEnte', response);
            this.store.dispatch(new UpdateVoceRubrica(response.data));
            const pagination = this.store.selectSnapshot(PaginationState.pagination);
            this.store.dispatch(new PatchPagination({ ...pagination, totalItems: response.pagination.totalItems }));
        });

        this.hubNotification.on('NotifyDeleteEnte', (response: ResponseDeleteEnteRubricaInterface) => {
            console.log('NotifyDeleteEnte', response);
            this.store.dispatch(new DeleteVoceRubrica(response.data));
            const pagination = this.store.selectSnapshot(PaginationState.pagination);
            this.store.dispatch(new PatchPagination({ ...pagination, totalItems: response.pagination.totalItems }));
        });

        /**
         * Disconnessione SignalR
         */
        this.hubNotification.onclose(() => {
            console.log('Hub Subscription Disconnesso');
            this.connectionEstablished.next(false);
            setTimeout(() => {
                this.store.dispatch(new SignalRHubDisconnesso());
            }, 100);
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
                .catch(() => console.error('GetTime Error'));
        }
    }


    addToGroup(notification: SignalRNotification) {
        if (!SIGNALR_BYPASS) {
            console.log('addToGroup', notification);
            this.hubNotification.invoke('AddToGroup', notification).then(
                () => this.store.dispatch(new ShowToastr(ToastrType.Info, 'Connessione al gruppo effettuata con successo', null, 3))
            ).catch(
                () => this.store.dispatch(new ShowToastr(ToastrType.Warning, 'Connessione al gruppo fallita', null, 3))
            );
        }
    }

    removeToGroup(notification: SignalRNotification) {
        if (!SIGNALR_BYPASS) {
            console.log('removeToGroup', notification);
            this.hubNotification.invoke('RemoveToGroup', notification).then(
                () => this.store.dispatch(new ShowToastr(ToastrType.Info, 'Disconnessione al gruppo effettuata con successo', null, 3))
            ).catch(
                () => this.store.dispatch(new ShowToastr(ToastrType.Warning, 'Disconnessione al gruppo fallita', null, 3))
            );
        }
    }

}
