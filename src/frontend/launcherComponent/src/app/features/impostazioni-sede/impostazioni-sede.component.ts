import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetCurrentUrl } from '../../shared/store/actions/app/app.actions';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { SetSediNavbarVisible } from '../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { StopBigLoading } from '../../shared/store/actions/loading/loading.actions';
import { GetTipologie } from '../../shared/store/actions/tipologie/tipologie.actions';
import { ClearRicercaDettagliTipologia } from './store/actions/dettagli-tipologie.actions';

@Component({
    selector: 'app-impostazioni-sede',
    templateUrl: './impostazioni-sede.component.html',
    styleUrls: ['./impostazioni-sede.component.scss']
})
export class ImpostazioniSedeComponent implements OnInit, OnDestroy {

    constructor(private store: Store) {
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
