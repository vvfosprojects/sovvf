import { Component, OnDestroy, OnInit } from '@angular/core';
import { DettaglioPartenza, Partenza } from '../../model/partenza.model';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { SostituzionePartenzeFineTurnoModalState } from '../../store/states/sostituzione-partenze-fine-turno-modal/sostituzione-partenze-fine-turno-modal.state';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SostituzioneInterface } from '../../interface/sostituzione.interface';
import {
    ClearSostituzioneFineTurno,
    SetIdRichiestaSostituzioneFineTurno,
    SetPartenzaMontante,
    UpdateSostituzione,
    StartLoadingSostituzioneFineTurno,
    StopLoadingSostituzioneFineTurno
} from '../../store/actions/modifica-partenzef-fine-turno-modal/sostituzione-partenze-fine-turno.actions';
import { StatoMezzo } from '../../enum/stato-mezzo.enum';
import { SostituzionePartenzaFineTurnoDto } from '../../interface/dto/partenze/sostituzione-partenza-fine-turno-dto.interface';
import { RemoveAnnullaStatoMezzi } from '../../store/actions/loading/loading.actions';
import { ModificaPartenzaService } from '../../../core/service/modifica-partenza/modifica-partenza.service';

@Component({
    selector: 'app-sostituzione-partenze-modal',
    templateUrl: './sostituzione-partenze-fine-turno-modal.component.html',
    styleUrls: ['./sostituzione-partenze-fine.turno-modal.component.scss']
})
export class SostituzionePartenzeFineTunoModalComponent implements OnInit, OnDestroy {

    @Select(SostituzionePartenzeFineTurnoModalState.partenze) partenze$: Observable<Partenza[]>;
    partenze: Partenza[];
    @Select(SostituzionePartenzeFineTurnoModalState.partenzaMontante) partenzaMontante$: Observable<Partenza>;
    partenzaMontante: DettaglioPartenza;
    @Select(SostituzionePartenzeFineTurnoModalState.sostituzioni) sostituzioni$: Observable<SostituzioneInterface[]>;
    sostituzioni: SostituzioneInterface[];
    @Select(SostituzionePartenzeFineTurnoModalState.disableButtonConferma) disableButtonConferma$: Observable<boolean>;
    disableButtonConferma: boolean;
    @Select(SostituzionePartenzeFineTurnoModalState.loading) loading$: Observable<boolean>;
    loading: boolean;

    idRichiesta: string;
    codRichiesta: string;
    squadraSmontanteCheck = [];

    private subscriptions: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbActiveModal,
                private modificaPartenzaService: ModificaPartenzaService) {
        this.getPartenze();
        this.getPartenzaMontante();
        this.getSostituzioni();
        this.getDisableButtonConferma();
        this.getLoading();
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
                if (partenzaMontante) {
                    this.partenzaMontante = partenzaMontante.partenza;
                }
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

    getLoading(): void {
        this.subscriptions.add(
            this.loading$.subscribe((loading: boolean) => {
                this.loading = loading;
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
        return this.partenze?.filter((p: Partenza) => p.partenza.mezzo.codice !== this.partenzaMontante.mezzo.codice && p.partenza.mezzo.stato === StatoMezzo.SulPosto).map((p: Partenza) => p.partenza.squadre);
    }

    getPartenzeSostituzione(): Partenza[] {
        return this.partenze?.filter((p: Partenza) => p.partenza.mezzo.codice !== this.partenzaMontante.mezzo.codice && p.partenza.mezzo.stato === StatoMezzo.SulPosto);
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
        this.squadraSmontanteCheck.push(squadraSmontante);
        this.store.dispatch(new UpdateSostituzione(squadraMontante, squadraSmontante, codMezzoSmontante));
    }

    onDeselezioneSquadraSmontate(squadraMontante: string, squadraSmontante: string): void {
        this.squadraSmontanteCheck = this.squadraSmontanteCheck.filter(x => x !== squadraSmontante);
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

        const idRichiesta = this.idRichiesta;
        const sostituzioni = makeCopy(this.sostituzioni);
        const sostituzioniMapped = [];
        sostituzioni?.forEach((s: SostituzioneInterface) => {
            const mezzoIsInSostituzioniMapped = sostituzioniMapped.filter((sostituzione: any) => sostituzione.codMezzo === s.codMezzoMontante)[0];
            if (!mezzoIsInSostituzioniMapped) {
                sostituzioniMapped.push({ codMezzo: s.codMezzoMontante, codSquadre: s.squadreSmontanti });
            } else {
                mezzoIsInSostituzioniMapped.codSquadre = [...mezzoIsInSostituzioniMapped.codSquadre, ...s.squadreSmontanti];
            }
        });
        sostituzioni?.forEach((s: SostituzioneInterface) => {
            const mezzoIsInSostituzioniMapped = sostituzioniMapped.filter((sostituzione: any) => sostituzione.codMezzo === s.codMezzoSmontante)[0];
            if (!mezzoIsInSostituzioniMapped) {
                sostituzioniMapped.push({ codMezzo: s.codMezzoSmontante, codSquadre: s.squadreMontanti });
            } else {
                mezzoIsInSostituzioniMapped.codSquadre = [...mezzoIsInSostituzioniMapped.codSquadre, ...s.squadreMontanti];
            }
        });
        const obj = {
            idRichiesta,
            sostituzioni: sostituzioniMapped,
            dataOraOperazione: new Date()
        } as SostituzionePartenzaFineTurnoDto;
        const codMezziSmontanti = sostituzioni.map((s: SostituzioneInterface) => s.codMezzoSmontante);
        const codMezziMontanti = sostituzioni.map((s: SostituzioneInterface) => s.codMezzoMontante);
        const codMezziRemoveAnnullaStato = [...codMezziSmontanti, ...codMezziMontanti];
        this.store.dispatch(new StartLoadingSostituzioneFineTurno());
        this.modificaPartenzaService.addSostituzioneFineTurno(obj).subscribe(() => {
            this.store.dispatch([
                new RemoveAnnullaStatoMezzi(codMezziRemoveAnnullaStato),
                new ClearSostituzioneFineTurno(),
                new StopLoadingSostituzioneFineTurno()
            ]);
            this.modal.close({ status: 'ok' });
        }, () => {
            this.store.dispatch([
                new ClearSostituzioneFineTurno(),
                new StopLoadingSostituzioneFineTurno()
            ]);
            this.modal.close({ status: 'ko' });
        });
    }

}
