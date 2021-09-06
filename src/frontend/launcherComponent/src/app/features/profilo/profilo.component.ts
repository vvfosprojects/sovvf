import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { RuoliUtenteLoggatoState } from '../../shared/store/states/ruoli-utente-loggato/ruoli-utente-loggato.state';
import { Observable, Subscription } from 'rxjs';
import { Ruolo, Utente } from '../../shared/model/utente.model';
import { AuthState } from '../auth/store/auth.state';
import { ImpostazioniState } from '../../shared/store/states/impostazioni/impostazioni.state';
import { Impostazione, OpzioneImpostazione, TipoImpostazione } from '../../shared/interface/impostazioni.interface';
import { PatchImpostazioni } from '../../shared/store/actions/impostazioni/impostazioni.actions';
import { makeCopy } from '../../shared/helper/function-generiche';
import { SetCurrentUrl } from '../../shared/store/actions/app/app.actions';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { SetSediNavbarVisible } from '../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { StopBigLoading } from '../../shared/store/actions/loading/loading.actions';
import { SunMode } from '../../shared/store/actions/viewport/viewport.actions';
import { ViewportState } from 'src/app/shared/store/states/viewport/viewport.state';

@Component({
    selector: 'app-profilo',
    templateUrl: './profilo.component.html',
    styleUrls: ['./profilo.component.css']
})
export class ProfiloComponent implements OnInit, OnDestroy {

    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
    doubleMonitor: boolean;

    @Select(RuoliUtenteLoggatoState.ruoliFiltrati) ruoliUtenteLoggato$: Observable<Ruolo[]>;
    ruoliUtenteLoggato: Ruolo[];
    @Select(AuthState.currentUser) user$: Observable<Utente>;
    utente: Utente;

    @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;
    sunMode: boolean;

    private subscription: Subscription = new Subscription();

    constructor(private store: Store) {
        this.getDoubleMonitorMode();
        this.getUtente();
        this.getRuoliUtenteLoggato();
    }

    ngOnInit(): void {
        console.log('Componente Impostazioni creato');
        this.store.dispatch([
            new SetCurrentUrl(RoutesPath.Profilo),
            new SetSediNavbarVisible(false),
            new StopBigLoading()
        ]);
    }

    ngOnDestroy(): void {
        console.log('Componente Impostazioni distrutto');
        this.store.dispatch([
            new SetSediNavbarVisible()
        ]);
        this.subscription.unsubscribe();
    }

    getDoubleMonitorMode(): void {
        this.subscription.add(
            this.doubleMonitor$.subscribe((doubleMonitor: boolean) => {
                this.doubleMonitor = doubleMonitor;
            })
        );
    }

    getRuoliUtenteLoggato(): void {
        this.subscription.add(
            this.ruoliUtenteLoggato$.subscribe((ruoli: Ruolo[]) => {
                this.ruoliUtenteLoggato = ruoli;
            })
        );
    }

    getNightMode(): void {
        this.subscription.add(
            this.nightMode$.subscribe((nightMode: boolean) => {
                this.sunMode = !nightMode;
            })
        );
    }

    getUtente(): void {
        this.subscription.add(
            this.user$.subscribe((user: Utente) => {
                this.utente = user;
            })
        );
    }
}
