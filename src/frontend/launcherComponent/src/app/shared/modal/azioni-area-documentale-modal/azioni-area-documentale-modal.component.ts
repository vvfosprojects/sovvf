import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VoceFiltro } from '../../../features/home/filterbar/filtri-richieste/voce-filtro.model';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { SetCodCategoriaAreaDocumentale } from '../../../features/area-documentale/store/actions/area-documentale/area-documentale.actions';
import { RoutesPath } from '../../enum/routes-path.enum';
import { LSNAME } from '../../../core/settings/config';

@Component({
    selector: 'app-azioni-area-documentale-modal',
    templateUrl: './azioni-area-documentale-modal.component.html',
    styleUrls: ['./azioni-area-documentale-modal.component.css']
})

export class AzioniAreaDocumentaleModalComponent implements OnInit, OnDestroy {

    filtriAreaDocumentale: VoceFiltro[];

    private subscriptions: Subscription = new Subscription();

    constructor(private modal: NgbActiveModal,
                private store: Store) {
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    visalizzaDocumentiByCategoria(codCategoria: string): void {
        localStorage.setItem(LSNAME.areaDocumentale, codCategoria);
        this.close('ok');
        this.store.dispatch([
            new Navigate(['/area-documentale']),
            new SetCodCategoriaAreaDocumentale(codCategoria),
        ]);
    }

    goToPos(): void {
        this.close('ok');
        this.store.dispatch(new Navigate(['/', RoutesPath.POS]));
    }

    close(type: string): void {
        this.modal.close(type);
    }
}
