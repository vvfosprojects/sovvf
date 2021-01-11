import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetCurrentUrl } from '../../shared/store/actions/app/app.actions';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { SetSediNavbarVisible } from '../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { StopBigLoading } from '../../shared/store/actions/loading/loading.actions';

@Component({
    selector: 'app-impostazioni-sede',
    templateUrl: './impostazioni-sede.component.html',
    styleUrls: ['./impostazioni-sede.component.scss']
})
export class ImpostazioniSedeComponent implements OnInit {

    constructor(private store: Store) {
    }

    ngOnInit(): void {
        console.log('Componente Impostazioni Sede creato');
        this.store.dispatch([
            new SetCurrentUrl(RoutesPath.ImpostazioniSede),
            new SetSediNavbarVisible(false),
            new StopBigLoading()
        ]);
    }

}
