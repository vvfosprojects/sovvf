import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { RuoliUtenteLoggatoState } from '../../shared/store/states/ruoli-utente-loggato/ruoli-utente-loggato.state';
import { Observable, Subscription } from 'rxjs';
import { Ruolo, Utente } from '../../shared/model/utente.model';
import { AuthState } from '../auth/store/auth.state';
import { ImpostazioniState } from '../../shared/store/states/impostazioni/impostazioni.state';
import { Impostazione, OpzioneImpostazione, TipoImpostazione } from '../../shared/interface/impostazioni.interface';
import { PatchImpostazioni } from '../../shared/store/actions/impostazioni/impostazioni.actions';
import { makeCopy } from '../../shared/helper/function';
import { SetCurrentUrl } from '../../shared/store/actions/app/app.actions';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { SetSediNavbarVisible } from '../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { StopBigLoading } from '../../shared/store/actions/loading/loading.actions';
import { ViewportState } from '../../shared/store/states/viewport/viewport.state';
import { SunMode } from '../../shared/store/actions/viewport/viewport.actions';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-impostazioni',
    templateUrl: './impostazioni.component.html',
    styleUrls: ['./impostazioni.component.css']
})
export class ImpostazioniComponent implements OnInit, OnDestroy {

    @Select(RuoliUtenteLoggatoState.ruoliFiltrati) ruoliUtenteLoggato$: Observable<Ruolo[]>;
    ruoliUtenteLoggato: Ruolo[];
    @Select(AuthState.currentUser) user$: Observable<Utente>;
    utente: Utente;

    @Select(ImpostazioniState.listaImpostazioni) listaImpostazioni$: Observable<Impostazione[]>;
    listaImpostazioni: Impostazione[];

    @Select(ViewportState.sunMode) nightMode$: Observable<boolean>;
    sunMode: boolean;

    private subscription: Subscription = new Subscription();

    constructor(private ngbAccordionconfig: NgbAccordionConfig,
                private store: Store) {
        ngbAccordionconfig.type = 'dark';
        this.getUtente();
        this.getRuoliUtenteLoggato();
        this.getListaImpostazioni();
    }

    ngOnInit(): void {
        console.log('Componente Impostazioni creato');
        this.store.dispatch([
            new SetCurrentUrl(RoutesPath.Impostazioni),
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

    getListaImpostazioni(): void {
        this.subscription.add(
            this.listaImpostazioni$.subscribe((listaImpostazioni: Impostazione[]) => {
                this.listaImpostazioni = listaImpostazioni;
                if (this.listaImpostazioni.length) {
                    this.store.dispatch(new SunMode(!this.listaImpostazioni[2].opzioni[0].singleValue.value));
                }
            })
        );
    }

    setImpostazione(tipo: TipoImpostazione, opzioneLabel: string, value: any): void {
        const listaImpostazioni = makeCopy(this.listaImpostazioni);
        const impostazione = listaImpostazioni.filter((i: Impostazione) => i.tipo === tipo)[0] as Impostazione;
        if (!impostazione) {
            return;
        }
        const opzione = impostazione.opzioni.filter((o: OpzioneImpostazione) => o.label === opzioneLabel)[0] as OpzioneImpostazione;
        if (!opzione) {
            return;
        }
        opzione.singleValue ? opzione.singleValue.value = value : opzione.select.selected = value;
        this.store.dispatch(new PatchImpostazioni(impostazione));
        if (tipo === 'Modalità Notte') {
            this.store.dispatch(new SunMode(!impostazione.opzioni[0].singleValue.value));
        }
    }
}
