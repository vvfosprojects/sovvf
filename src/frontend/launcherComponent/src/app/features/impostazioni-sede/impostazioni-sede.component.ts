import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { SetCurrentUrl } from '../../shared/store/actions/app/app.actions';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { SetSediNavbarVisible } from '../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { StopBigLoading } from '../../shared/store/actions/loading/loading.actions';
import { GetTipologie } from '../../shared/store/actions/tipologie/tipologie.actions';
import { ClearRicercaDettagliTipologia } from '../../shared/store/actions/dettagli-tipologie/dettagli-tipologie.actions';
import { ViewportState } from '../../shared/store/states/viewport/viewport.state';
import { Observable } from 'rxjs';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-impostazioni-sede',
    templateUrl: './impostazioni-sede.component.html',
    styleUrls: ['./impostazioni-sede.component.scss']
})
export class ImpostazioniSedeComponent implements OnInit, OnDestroy {

    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;

    constructor(private ngbAccordionconfig: NgbAccordionConfig,
                private store: Store) {
        ngbAccordionconfig.type = 'dark';
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
        this.store.dispatch([
            new ClearRicercaDettagliTipologia(),
            new SetSediNavbarVisible()
        ]);
    }

    fetchTipologie(): void {
        this.store.dispatch(new GetTipologie());
    }

}
