import { Component, OnDestroy, OnInit } from '@angular/core';
import { Partenza } from '../../model/partenza.model';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { SostituzionePartenzeFineTurnoModalState } from '../../store/states/sostituzione-partenze-fine-turno-modal/sostituzione-partenze-fine-turno-modal.state';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SostituzioneInterface } from '../../interface/sostituzione.interface';
import {
    ClearSostituzioneFineTurno,
    SetIdRichiestaSostituzioneFineTurno,
    SetPartenzaMontante,
    UpdateSostituzione
} from '../../store/actions/modifica-partenzef-fine-turno-modal/sostituzione-partenze-fine-turno.actions';
import { StatoMezzo } from '../../enum/stato-mezzo.enum';

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
    @Select(SostituzionePartenzeFineTurnoModalState.sostituzioni) sostituzioni$: Observable<SostituzioneInterface[]>;
    sostituzioni: SostituzioneInterface[];
    @Select(SostituzionePartenzeFineTurnoModalState.disableButtonConferma) disableButtonConferma$: Observable<boolean>;
    disableButtonConferma: boolean;

    idRichiesta: string;
    codRichiesta: string;

    private subscriptions: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbActiveModal) {
        this.getPartenze();
        this.getPartenzaMontante();
        this.getSostituzioni();
        this.getDisableButtonConferma();
    }

    ngOnInit(): void {
        this.store.dispatch(new SetIdRichiestaSostituzioneFineTurno(this.idRichiesta));
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
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

    getSostituzioni(): void {
        this.subscriptions.add(
            this.sostituzioni$.subscribe((sostituzioni: SostituzioneInterface[]) => {
                this.sostituzioni = sostituzioni;
            })
        );
    }

    getDisableButtonConferma(): void {
        this.subscriptions.add(
            this.disableButtonConferma$.subscribe((disable: boolean) => {
                this.disableButtonConferma = disable;
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
        return this.partenze.filter((p: Partenza) => p.mezzo.codice !== this.partenzaMontante.mezzo.codice && p.mezzo.stato === StatoMezzo.SulPosto).map((p: Partenza) => p.squadre);
    }

    getPartenzeSostituzione(): Partenza[] {
        return this.partenze.filter((p: Partenza) => p.mezzo.codice !== this.partenzaMontante.mezzo.codice && p.mezzo.stato === StatoMezzo.SulPosto);
    }

    getSostituzioneBySquadraMontante(squadraMontante: string): SostituzioneInterface {
        if (this.sostituzioni?.length <= 0) {
            return null;
        }
        return this.sostituzioni.filter((s: SostituzioneInterface) => s.squadreMontanti.includes(squadraMontante))[0];
    }

    getSquadraSmontanteBySquadraMontante(squadraMontante: string): string {
        if (this.sostituzioni?.length <= 0) {
            return null;
        }
        const sostituzione = this.sostituzioni.filter((s: SostituzioneInterface) => s.squadreMontanti.includes(squadraMontante))[0];
        if (sostituzione?.squadreSmontanti?.length > 0) {
            return sostituzione.squadreSmontanti[0];
        }
    }

    onSelezioneSquadraSmontate(squadraMontante: string, squadraSmontante: string, codMezzoSmontante: string): void {
        this.store.dispatch(new UpdateSostituzione(squadraMontante, squadraSmontante, codMezzoSmontante));
    }

    onDeselezioneSquadraSmontate(squadraMontante: string): void {
        this.store.dispatch(new UpdateSostituzione(squadraMontante, null, null));
    }

    getTitle(): string {
        return 'Sostituzione Fine Turno - Richiesta ' + this.codRichiesta;
    }

    onDismiss(): void {
        this.store.dispatch(new ClearSostituzioneFineTurno());
        this.modal.close({ status: 'ko' });
    }

    closeModal(type: string): void {
        this.store.dispatch(new ClearSostituzioneFineTurno());
        this.modal.close({ status: type });
    }

    onConferma(): void {
        if (this.disableButtonConferma) {
            return;
        }

        this.modal.close({
            status: 'ok'
        });
    }

}
