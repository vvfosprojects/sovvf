import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { Subject } from 'rxjs';
import { Store } from '@ngxs/store';
import { SetConnectionId, SignalRHubConnesso, SignalRHubDisconnesso } from './store/signalR.actions';
import { ShowToastr } from '../../shared/store/actions/toastr/toastr.actions';
import { GetListaRichieste, UpdateRichiesta } from '../../features/home/store/actions/richieste/richieste.actions';
import { SignalRNotification } from './model/signalr-notification.model';
import { SetTimeSync } from '../../shared/store/actions/app/app.actions';
import { SetBoxPersonale } from '../../features/home/store/actions/boxes/box-personale.actions';
import { SetBoxMezzi } from '../../features/home/store/actions/boxes/box-mezzi.actions';
import { SetBoxRichieste } from '../../features/home/store/actions/boxes/box-richieste.actions';
import { environment } from '../../../environments/environment';
import { ToastrType } from '../../shared/enum/toastr';
import { InsertChiamataSuccess } from '../../features/home/store/actions/form-richiesta/scheda-telefonata.actions';
import { UpdateMezzoComposizione } from '../../shared/store/actions/mezzi-composizione/mezzi-composizione.actions';
import { SetListaPreaccoppiati } from '../../features/home/store/actions/composizione-partenza/composizione-veloce.actions';
import { SetMezziInServizio, StopLoadingMezziInServizio, UpdateMezzoInServizio } from 'src/app/features/home/store/actions/mezzi-in-servizio/mezzi-in-servizio.actions';
import { GetContatoriSchedeContatto, GetListaSchedeContatto, SetContatoriSchedeContatto, SetListaSchedeContatto, UpdateSchedaContatto } from 'src/app/features/home/store/actions/schede-contatto/schede-contatto.actions';
import { ContatoriSchedeContatto } from '../../shared/interface/contatori-schede-contatto.interface';
import { SchedaContatto } from '../../shared/interface/scheda-contatto.interface';
import { SuccessAddUtenteGestione, SuccessRemoveUtente, UpdateUtenteGestioneInLista } from '../../features/gestione-utenti/store/actions/gestione-utenti/gestione-utenti.actions';
import { Navigate } from '@ngxs/router-plugin';
import { InterventoInterface } from './interface/intervento.interface';
import { MezzoInServizio } from '../../shared/interface/mezzo-in-servizio.interface';
import { BoxPersonale } from '../../features/home/boxes/boxes-model/box-personale.model';
import { BoxMezzi } from '../../features/home/boxes/boxes-model/box-mezzi.model';
import { BoxInterventi } from '../../features/home/boxes/boxes-model/box-interventi.model';
import { ChiamataMarker } from '../../features/maps/maps-model/chiamata-marker.model';
import { SintesiRichiesta } from '../../shared/model/sintesi-richiesta.model';
import { AuthState } from '../../features/auth/store/auth.state';
import { ClearCurrentUser, UpdateRuoliPersonali } from '../../features/auth/store/auth.actions';
import { ViewComponentState } from '../../features/home/store/states/view/view.state';
import { EnteInterface, ResponseAddEnteRubricaInterface, ResponseDeleteEnteRubricaInterface, ResponseUpdateEnteRubricaInterface } from '../../shared/interface/ente.interface';
import { AddVoceRubrica, DeleteVoceRubrica, UpdateVoceRubrica } from '../../features/rubrica/store/actions/rubrica/rubrica.actions';
import { SetEnti } from '../../shared/store/actions/enti/enti.actions';
import { PatchPagination } from '../../shared/store/actions/pagination/pagination.actions';
import { PaginationState } from '../../shared/store/states/pagination/pagination.state';
import { AddNotifica } from '../../shared/store/actions/notifiche/notifiche.actions';
import { NotificaInterface } from '../../shared/interface/notifica.interface';
import { ResponseAddTrasferimentoInterface } from '../../shared/interface/trasferimento-chiamata.interface';
import { AddTrasferimentoChiamata } from '../../features/trasferimento-chiamata/store/actions/trasferimento-chiamata/trasferimento-chiamata.actions';
import { BoxPartenzaPreAccoppiati } from '../../features/home/composizione-partenza/interface/box-partenza-interface';
import { AddDettaglioTipologia, DeleteDettaglioTipologia, UpdateDettaglioTipologia } from '../../shared/store/actions/dettagli-tipologie/dettagli-tipologie.actions';
import {
    AddChiamateDistaccamentoCodaChiamate,
    AddSquadreLibereDistaccamentoCodaChiamate,
    AddSquadreOccupateDistaccamentoCodaChiamate,
    RemoveChiamateDistaccamentoCodaChiamate,
    RemoveSquadreLibereDistaccamentoCodaChiamate,
    RemoveSquadreOccupateDistaccamentoCodaChiamate
} from '../../features/home/store/actions/coda-chiamate/coda-chiamate.actions';
import { ChangeCodaChiamate } from '../../shared/interface/change-coda-chiamate.interface';
import { InsertChiamataMarker, RemoveChiamataMarker, UpdateItemChiamataMarker } from '../../features/maps/store/actions/chiamate-markers.actions';
import { GetZonaEmergenzaById, GetZoneEmergenza } from '../../features/zone-emergenza/store/actions/zone-emergenza/zone-emergenza.actions';
import { ZonaEmergenza } from '../../features/zone-emergenza/model/zona-emergenza.model';
import { GetConcorrenza } from '../../shared/store/actions/concorrenza/concorrenza.actions';

//const HUB_URL = environment.baseUrl + environment.signalRHub;
const HUB_URL = "https://localhost:44381/SubHub";

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

    checkConnection(): any {
        return this.connectionEstablished.asObservable();
    }

    private createSubscriptionConnection(): void {
        this.hubNotification = new HubConnectionBuilder()
            .withUrl(HUB_URL)
            .build();

        this.hubNotification.serverTimeoutInMilliseconds = 28800000;
    }

    private startSubscriptionConnection(): void {
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
            // this.store.dispatch(new ShowToastr(ToastrType.Info, 'Utente collegato:', data, 3, null, true));
        });
        this.hubNotification.on('NotifyLogOut', (data: string) => {
            console.log('NotifyLogOut', data);
            // avvisa gli altri client che un utente si è scollegato alla sua stessa sede
            // this.store.dispatch(new ShowToastr(ToastrType.Info, 'Utente disconnesso:', data, 3, null, true));
        });

        /**
         * Notifiche Navbar
         */
        this.hubNotification.on('NotifyNavbar', (data: NotificaInterface) => {
            this.store.dispatch(new AddNotifica(data));
        });

        /**
         * Modifica Richiesta
         */
        this.hubNotification.on('ModifyAndNotifySuccess', (data: InterventoInterface) => {
            console.log('ModifyAndNotifySuccess:', data);
            const updateRichiesta = data.chiamata ? data.chiamata : data.richiesta;
            this.store.dispatch(new UpdateRichiesta(updateRichiesta));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Modifica Sintesi Richiesta', null, 3));
        });

        /**
         * Soccorso Aereo
         */
        // Todo: tipicizzare
        this.hubNotification.on('NotifySuccessAFM', (data: any) => {
            console.log('NotifySuccessAFM', data);
            this.store.dispatch(new UpdateRichiesta(data.richiesta));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Richiesta Soccorso AFM inserita con successo', null, 3));
        });

        this.hubNotification.on('NotifyErrorAFM', (data: string) => {
            console.log('NotifyErrorAFM:', data);
            this.store.dispatch(new ShowToastr(ToastrType.Error, data, null, 3));
        });

        this.hubNotification.on('NotifySuccessAnnullamentoAFM', (data: any) => {
            console.log('NotifySuccessAnnullamentoAFM:', data);
            this.store.dispatch(new UpdateRichiesta(data.richiesta));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Richiesta Soccorso AFM annullata con successo', null, 3));
        });

        this.hubNotification.on('NotifyErrorAnnullamentoAFM', (data: string) => {
            console.log('NotifyErrorAnnullamentoAFM:', data);
            this.store.dispatch(new ShowToastr(ToastrType.Error, data, null, 3));
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
            this.store.dispatch(new StopLoadingMezziInServizio());
        });
        this.hubNotification.on('NotifyUpdateMezzoInServizio', (data: MezzoInServizio) => {
            console.log('NotifyUpdateMezzoInServizio', data);
            const mezziInServizioActive = this.store.selectSnapshot(ViewComponentState.mezziInServizioStatus);
            const composizionePartenzaActive = this.store.selectSnapshot(ViewComponentState.composizioneStatus);
            if (mezziInServizioActive) {
                this.store.dispatch(new UpdateMezzoInServizio(data));
            } else if (composizionePartenzaActive) {
                this.store.dispatch(new UpdateMezzoComposizione(data.mezzo.mezzo));
            }
            this.store.dispatch(new StopLoadingMezziInServizio());
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
        this.hubNotification.on('SaveAndNotifySuccessChiamata', (data: SintesiRichiesta) => {
            console.log('SaveAndNotifySuccessChiamata', data);
            this.store.dispatch([
                new InsertChiamataSuccess(data)
            ]);
        });
        this.hubNotification.on('SaveAndNotifySuccessChiamataTrasferita', (data: SintesiRichiesta) => {
            console.log('SaveAndNotifySuccessChiamataTrasferita', data);
            this.store.dispatch([
                new InsertChiamataSuccess(data, { trasferimento: true }),
            ]);
        });

        /**
         * Schede Contatto
         */
        this.hubNotification.on('NotifySetContatoriSchedeContatto', (data: ContatoriSchedeContatto) => {
            console.log('NotifySetContatoriSchedeContatto', data);
            this.store.dispatch(new SetContatoriSchedeContatto(data));
        });
        this.hubNotification.on('NotifyGetListaSchedeContatto', (data: SchedaContatto[]) => {
            console.log('NotifyGetListaSchedeContatto', data);
            this.store.dispatch(new SetListaSchedeContatto(data));
        });
        this.hubNotification.on('NotifyInsertSchedeContatto', (data: SchedaContatto[]) => {
            console.log('NotifyInsertSchedeContatto', data);
            this.store.dispatch(new GetListaSchedeContatto());
        });
        this.hubNotification.on('NotifyUpdateSchedaContatto', (data: SchedaContatto) => {
            console.log('NotifyUpdateSchedaContatto', data);
            this.store.dispatch(new UpdateSchedaContatto(data));
        });
        this.hubNotification.on('NotifyRemoveSchedeContatto', (data: string[]) => {
            console.log('NotifyRemoveSchedeContatto', data);
            this.store.dispatch(new GetListaSchedeContatto());
        });
        this.hubNotification.on('NotifyNewSchedaContatto', (data: SchedaContatto) => {
            console.log('NotifyNewSchedaContatto', data);
            this.store.dispatch([
                new GetContatoriSchedeContatto(),
                new GetListaSchedeContatto()
            ]);
        });

        /**
         * Allerta Sedi
         */
        this.hubNotification.on('NotifyAllertaAltreSedi', () => {
            console.log('NotifyAllertaAltreSedi');
            this.store.dispatch(new GetListaRichieste());
        });
        this.hubNotification.on('NotifyDeleteAllertaAltreSedi', () => {
            console.log('NotifyDeleteAllertaAltreSedi');
            this.store.dispatch(new GetListaRichieste());
        });

        /**
         * Composizione Partenza
         */
        this.hubNotification.on('NotifyGetPreaccoppiati', (data: BoxPartenzaPreAccoppiati[]) => {
            this.store.dispatch(new SetListaPreaccoppiati(data));
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Preaccoppiati Composizione ricevute da signalR', null, 5));
        });

        /**
         * Coda Chiamate
         */
        this.hubNotification.on('NotifyAddChiamateCodaChiamate', (changes: ChangeCodaChiamate) => {
            console.log('NotifyAddChiamateCodaChiamate', changes);
            this.store.dispatch(new AddChiamateDistaccamentoCodaChiamate(changes));
        });
        this.hubNotification.on('NotifyAddSquadreLibereCodaChiamate', (changes: ChangeCodaChiamate) => {
            console.log('NotifyAddSquadreLibereCodaChiamate', changes);
            this.store.dispatch(new AddSquadreLibereDistaccamentoCodaChiamate(changes));
        });
        this.hubNotification.on('NotifyAddSquadreOccupateCodaChiamate', (changes: ChangeCodaChiamate) => {
            console.log('NotifyAddSquadreOccupateCodaChiamate', changes);
            this.store.dispatch(new AddSquadreOccupateDistaccamentoCodaChiamate(changes));
        });
        this.hubNotification.on('NotifyRemoveChiamateCodaChiamate', (changes: ChangeCodaChiamate) => {
            console.log('NotifyRemoveChiamateCodaChiamate', changes);
            this.store.dispatch(new RemoveChiamateDistaccamentoCodaChiamate(changes));
        });
        this.hubNotification.on('NotifyRemoveSquadreLibereCodaChiamate', (changes: ChangeCodaChiamate) => {
            console.log('NotifyRemoveSquadreLibereCodaChiamate', changes);
            this.store.dispatch(new RemoveSquadreLibereDistaccamentoCodaChiamate(changes));
        });
        this.hubNotification.on('NotifyRemoveSquadreOccupateCodaChiamate', (changes: ChangeCodaChiamate) => {
            console.log('NotifyRemoveSquadreOccupateCodaChiamate', changes);
            this.store.dispatch(new RemoveSquadreOccupateDistaccamentoCodaChiamate(changes));
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
                this.store.dispatch(new UpdateUtenteGestioneInLista(idUtente));

                const utenteAttuale = this.store.selectSnapshot(AuthState.currentUser);
                if (idUtente === utenteAttuale.id) {
                    this.store.dispatch(new UpdateRuoliPersonali(idUtente));
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
         * Zone Emergenza
         */
        this.hubNotification.on('NotifyCreazioneEmergenza', (emergenza: ZonaEmergenza) => {
            console.log('NotifyCreazioneEmergenza', emergenza);
            const pagination = this.store.selectSnapshot(PaginationState.pagination);
            const page = pagination?.page ? pagination.page : null;
            this.store.dispatch(new GetZoneEmergenza(page));
        });
        this.hubNotification.on('NotifyModificaEmergenza', (emergenza: ZonaEmergenza) => {
            console.log('NotifyModificaEmergenza', emergenza);
            const pagination = this.store.selectSnapshot(PaginationState.pagination);
            const page = pagination?.page ? pagination.page : null;
            this.store.dispatch([
                new GetZoneEmergenza(page),
                new GetZonaEmergenzaById(emergenza.id)
            ]);
        });
        this.hubNotification.on('NotifyAllertaEmergenza', (emergenza: ZonaEmergenza) => {
            console.log('NotifyAllertaEmergenza', emergenza);
            const pagination = this.store.selectSnapshot(PaginationState.pagination);
            const page = pagination?.page ? pagination.page : null;
            this.store.dispatch(new GetZoneEmergenza(page));
        });

        /**
         * Rubrica
         */
        this.hubNotification.on('NotifyChangeEnti', (enti: EnteInterface[]) => {
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
         * Trasferimenti
         */
        this.hubNotification.on('NotifyAddTrasferimento', (response: ResponseAddTrasferimentoInterface) => {
            console.log('NotifyAddTrasferimento', response);
            this.store.dispatch(new AddTrasferimentoChiamata());
            const pagination = this.store.selectSnapshot(PaginationState.pagination);
            this.store.dispatch(new PatchPagination({ ...pagination, totalItems: response.pagination.totalItems }));
        });
        this.hubNotification.on('NotifyDeleteChiamata', (idRichiesta: string) => {
            console.log('NotifyDeleteChiamata', idRichiesta);
            this.store.dispatch(new GetListaRichieste());
        });

        /**
         * Dettagli Tipologie
         */
        this.hubNotification.on('NotifyAddDettaglioTipologia', (response: any) => {
            console.log('NotifyAddDettaglioTipologia', response);
            this.store.dispatch(new AddDettaglioTipologia());
            const pagination = this.store.selectSnapshot(PaginationState.pagination);
            this.store.dispatch(new PatchPagination({ ...pagination, totalItems: response.pagination.totalItems }));
        });
        this.hubNotification.on('NotifyModifyDettaglioTipologia', (response: any) => {
            console.log('NotifyModifyDettaglioTipologia', response);
            this.store.dispatch(new UpdateDettaglioTipologia(response.data.dettaglioTipologia));
            const pagination = this.store.selectSnapshot(PaginationState.pagination);
            this.store.dispatch(new PatchPagination({ ...pagination, totalItems: response.pagination.totalItems }));
        });
        this.hubNotification.on('NotifyDeleteDettaglioTipologia', (response: any) => {
            console.log('NotifyDeleteDettaglioTipologia', response);
            this.store.dispatch(new DeleteDettaglioTipologia(response.data));
            const pagination = this.store.selectSnapshot(PaginationState.pagination);
            this.store.dispatch(new PatchPagination({ ...pagination, totalItems: response.pagination.totalItems }));
        });

        /**
         * Concorrenza
         */
        this.hubNotification.on('NotifyConcorrenza', (response: any) => {
            console.log('NotifyConcorrenza', response);
            this.store.dispatch(new GetConcorrenza());
        });

        /**
         * Disconnessione SignalR
         */
        this.hubNotification.onclose((error: Error) => {
            console.error('Hub Subscription Disconnesso', error);
            this.connectionEstablished.next(false);
            this.store.dispatch(new SignalRHubDisconnesso());
            setTimeout(() => this.startSubscriptionConnection(), 1);
        });
    }

    byPassSignalR(): void {
        this.connectionEstablished.next(true);
        this.store.dispatch(new SignalRHubConnesso());
        this.store.dispatch(new SetConnectionId('N{[=sE=2\\_A/y"J7v;ZMEDcGZ3a$K53dmn9UJ]mR{PXd8rx\\M\\tdeE>:2NPH<3!n:s^2;'));
    }

    getContextId(): void {
        if (!SIGNALR_BYPASS) {
            this.hubNotification.invoke('GetConnectionId').then(connectionId => {
                this.store.dispatch(new SetConnectionId(connectionId));
            });
        }
    }

    startGetTime(): void {
        if (!SIGNALR_BYPASS) {
            this.hubNotification.invoke('GetDateTime')
                .then((data: any) => {
                    this.store.dispatch(new SetTimeSync(data));
                })
                .catch(() => console.error('GetTime Error'));
        }
    }

    addToGroup(notification: SignalRNotification): void {
        if (!SIGNALR_BYPASS) {
            console.warn('addToGroup', notification,notification.codiciSede[0]);
            this.hubNotification.invoke('AddToGroup', notification,notification.codiciSede[0]).then(
                () => this.store.dispatch(new ShowToastr(ToastrType.Info, 'Connessione al gruppo effettuata con successo', null, 3))
            ).catch(
                () => this.store.dispatch(new ShowToastr(ToastrType.Warning, 'Connessione al gruppo fallita', null, 3))
            );
        }
    }

    removeToGroup(notification: SignalRNotification): void {
        if (!SIGNALR_BYPASS) {
            console.warn('removeToGroup', notification,notification.codiciSede[0]);
            this.hubNotification.invoke('RemoveToGroup', notification,notification.codiciSede[0]).then(
                () => this.store.dispatch(new ShowToastr(ToastrType.Info, 'Disconnessione al gruppo effettuata con successo', null, 3))
            ).catch(
                () => this.store.dispatch(new ShowToastr(ToastrType.Warning, 'Disconnessione al gruppo fallita', null, 3))
            );
        }
    }
}
