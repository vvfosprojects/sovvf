import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VoceFiltro } from '../../../features/home/filterbar/filtri-richieste/voce-filtro.model';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { ClearCodCategoriaAreaDocumentale, ClearDescCategoriaAreaDocumentale, SetCodCategoriaAreaDocumentale, SetDescCategoriaAreaDocumentale } from '../../../features/area-documentale/store/actions/area-documentale/area-documentale.actions';
import { RoutesPath } from '../../enum/routes-path.enum';

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
        console.log('filtriAreaDocumentale', this.filtriAreaDocumentale);
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    visalizzaDocumentiByCategoria(codCategoria: string): void {
        this.close('ok');
        this.store.dispatch([
            new Navigate(['/area-documentale']),
            new ClearDescCategoriaAreaDocumentale(),
            new ClearCodCategoriaAreaDocumentale(),
            new SetDescCategoriaAreaDocumentale(codCategoria),
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
