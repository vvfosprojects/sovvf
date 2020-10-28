import { Component, OnDestroy, OnInit } from '@angular/core';
import { Partenza } from '../../model/partenza.model';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { SostituzionePartenzeFineTurnoModalState } from '../../store/states/sostituzione-partenze-fine-turno-modal/sostituzione-partenze-fine-turno-modal.state';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClearSostituzioneFineTurno, SetPartenzaMontante } from '../../store/actions/modifica-partenzef-fine-turno-modal/sostituzione-partenze-fine-turno.actions';

@Component({
    selector: 'app-sostituzione-partenze-modal',
    templateUrl: './sostituzione-partenze-fine-turno-modal.component.html',
    styleUrls: ['./sostituzione-partenze-fine.turno-modal.component.scss']
})
export class SostituzionePartenzeFineTunoModalComponent implements OnInit, OnDestroy {

    @Select(SostituzionePartenzeFineTurnoModalState.partenze) partenze$: Observable<Partenza[]>;
    partenze: Partenza[];
    @Select(SostituzionePartenzeFineTurnoModalState.partenzaMontante) partenzaMontante$: Observable<Partenza>;
    partenzaMontante: Partenza;

    codRichiesta: string;

    private subscriptions: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbActiveModal) {
        this.getPartenze();
        this.getPartenzaMontante();
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.store.dispatch(new ClearSostituzioneFineTurno());
    }

    getPartenze(): void {
        this.subscriptions.add(
            this.partenze$.subscribe((partenze: Partenza[]) => {
                this.partenze = partenze;
            })
        );
    }

    getPartenzaMontante(): void {
        this.subscriptions.add(
            this.partenzaMontante$.subscribe((partenzaMontante: Partenza) => {
                this.partenzaMontante = partenzaMontante;
            })
        );
    }

    onSelezionePartenza(p: Partenza): void {
        this.store.dispatch(new SetPartenzaMontante(p));
    }

    onModificaPartenzaMontante(): void {
        this.store.dispatch(new SetPartenzaMontante(null));
    }

    getSquadrePartenze(): any[] {
        return this.partenze.filter((p: Partenza) => p.mezzo.codice !== this.partenzaMontante.mezzo.codice).map((p: Partenza) => p.squadre);
    }

    getPartenzeSostituzione(): Partenza[] {
        return this.partenze.filter((p: Partenza) => p.mezzo.codice !== this.partenzaMontante.mezzo.codice);
    }

    getTitle(): string {
        return 'Sostituzione Fine Turno - Richiesta ' + this.codRichiesta;
    }

    onDismiss(): void {
        this.modal.close({ status: 'ko' });
    }

    closeModal(type: string): void {
        this.modal.close({ status: type });
    }

}
