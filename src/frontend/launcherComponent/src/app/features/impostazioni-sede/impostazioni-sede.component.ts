import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { SetCurrentUrl } from '../../shared/store/actions/app/app.actions';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { SetSediNavbarVisible } from '../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { StopBigLoading } from '../../shared/store/actions/loading/loading.actions';
import { GetTipologie } from '../../shared/store/actions/tipologie/tipologie.actions';
import { ClearRicercaDettagliTipologia } from '../../shared/store/actions/dettagli-tipologie/dettagli-tipologie.actions';
import { Observable, Subscription } from 'rxjs';
import { ViewportState } from 'src/app/shared/store/states/viewport/viewport.state';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-impostazioni-sede',
    templateUrl: './impostazioni-sede.component.html',
    styleUrls: ['./impostazioni-sede.component.scss']
})

export class ImpostazioniSedeComponent implements OnInit, OnDestroy {

    @ViewChild('acc') accordionComponent: NgbAccordion;
    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
    doubleMonitor: boolean;

    private subscriptions: Subscription = new Subscription();

    constructor(private store: Store) {
        this.getDoubleMonitorMode();
        this.fetchTipologie();
    }

    ngOnInit(): void {
        console.log('Componente Impostazioni Sede creato');
        this.store.dispatch([
            new SetCurrentUrl(RoutesPath.ImpostazioniSede),
            new SetSediNavbarVisible(false),
            new StopBigLoading()
        ]);
    }

    ngOnDestroy(): void {
        console.log('Componente Impostazioni Sede distrutto');
        this.store.dispatch([
            new ClearRicercaDettagliTipologia(),
            new SetSediNavbarVisible()
        ]);
        this.subscriptions.unsubscribe();
    }

    getDoubleMonitorMode(): void {
        this.subscriptions.add(
            this.doubleMonitor$.subscribe((doubleMonitor: boolean) => {
                this.doubleMonitor = doubleMonitor;
            })
        );
    }

    fetchTipologie(): void {
        this.store.dispatch(new GetTipologie());
    }

    accordionExpandAll(): void {
        if (this.accordionComponent.activeIds.length === 2) {
            this.accordionComponent.collapseAll();
        } else {
            this.accordionComponent.expandAll();
        }
    }

    getTesto(): string {
        if (this.accordionComponent?.activeIds?.length > 0 && this.accordionComponent?.activeIds?.length === 2) {
            return 'Chiudi tutto';
        } else {
            return 'Espandi tutto';
        }
    }

    getExpand(id: string): boolean {
        return this.accordionComponent?.activeIds.indexOf(id) !== -1;
    }
}
