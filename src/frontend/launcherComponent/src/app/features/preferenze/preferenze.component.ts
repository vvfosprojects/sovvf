import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
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
    selector: 'app-preferenze',
    templateUrl: './preferenze.component.html',
    styleUrls: ['./preferenze.component.css']
})
export class PreferenzeComponent implements OnInit, OnDestroy {

    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
    doubleMonitor: boolean;

    @Select(ImpostazioniState.listaImpostazioni) listaImpostazioni$: Observable<Impostazione[]>;
    listaImpostazioni: Impostazione[];

    @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;
    sunMode: boolean;

    private subscription: Subscription = new Subscription();

    constructor(private store: Store) {
        this.getDoubleMonitorMode();
        this.getListaImpostazioni();
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

    getNightMode(): void {
        this.subscription.add(
            this.nightMode$.subscribe((nightMode: boolean) => {
                this.sunMode = !nightMode;
            })
        );
    }

    getListaImpostazioni(): void {
        this.subscription.add(
            this.listaImpostazioni$.subscribe((listaImpostazioni: Impostazione[]) => {
                this.listaImpostazioni = makeCopy(listaImpostazioni);
                if (this.listaImpostazioni.length) {
                    this.store.dispatch(new SunMode(!this.listaImpostazioni[2].opzioni[0].singleValue.value));
                }
                this.listaImpostazioni[1].tipo = TipoImpostazione.EventiRichiesta;
                this.listaImpostazioni[2].icona = 'fa-moon';
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
