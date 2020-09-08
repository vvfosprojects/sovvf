import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { GetListaMezziSquadre } from '../../store/actions/sostituzione-partenza/sostituzione-partenza.actions';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ModificaPartenzaModalState } from '../../store/states/modifica-partenza-modal/modifica-partenza-modal.state';
import { SostituzionePartenzaModalState } from '../../store/states/sostituzione-partenza-modal/sostituzione-partenza-modal.state';
import { MezziComposizioneState } from '../../store/states/mezzi-composizione/mezzi-composizione.state';
import { MezzoComposizione } from '../../interface/mezzo-composizione-interface';
import { SquadreComposizioneState } from '../../store/states/squadre-composizione/squadre-composizione.state';
import { SquadraComposizione } from '../../interface/squadra-composizione-interface';
import { makeCopy } from '../../helper/function';
import { StatoMezzo } from '../../enum/stato-mezzo.enum';
import {
    ClearListaMezziComposizione,
    HoverInMezzoComposizione,
    HoverOutMezzoComposizione,
    ReducerSelectMezzoComposizione,
    UnselectMezzoComposizione
} from '../../../features/home/store/actions/composizione-partenza/mezzi-composizione.actions';
import { AddBoxPartenza, ClearBoxPartenze, RemoveMezzoBoxPartenzaSelezionato, RemoveSquadraBoxPartenza } from '../../../features/home/store/actions/composizione-partenza/box-partenza.actions';
import { squadraComposizioneBusy } from '../../helper/composizione-functions';
import {
    ClearListaSquadreComposizione,
    HoverInSquadraComposizione,
    HoverOutSquadraComposizione,
    SelectSquadraComposizione,
    UnselectSquadraComposizione
} from '../../../features/home/store/actions/composizione-partenza/squadre-composizione.actions';
import { UndoAllBoxes } from '../../../features/home/store/actions/boxes/box-click.actions';
import { ClearPreaccoppiati } from '../../../features/home/store/actions/composizione-partenza/composizione-veloce.actions';
import { ClearFiltriAffini } from '../../../features/home/store/actions/composizione-partenza/composizione-partenza.actions';
import { UnselectMezziAndSquadreComposizioneAvanzata } from '../../../features/home/store/actions/composizione-partenza/composizione-avanzata.actions';

@Component({
    selector: 'app-sostituzione-partenza',
    templateUrl: './sostituzione-partenza-modal.component.html',
    styleUrls: ['./sostituzione-partenza-modal.component.css']
})
export class SostituzionePartenzaModalComponent implements OnInit, OnDestroy {

    @Select(SostituzionePartenzaModalState.formValid) formValid$: Observable<boolean>;
    formValid: boolean;

// Mezzi Composizione
    @Select(MezziComposizioneState.mezziComposizione) mezziComposizione$: Observable<MezzoComposizione[]>;
    mezziComposizione: MezzoComposizione[];
    @Select(MezziComposizioneState.idMezzoComposizioneSelezionato) idMezzoSelezionato$: Observable<string>;
    idMezzoSelezionato: string;
    @Select(MezziComposizioneState.idMezziInPrenotazione) idMezziInPrenotazione$: Observable<string[]>;
    idMezziInPrenotazione: string[];
    @Select(MezziComposizioneState.idMezziPrenotati) idMezziPrenotati$: Observable<string[]>;
    idMezziPrenotati: string[];
    @Select(MezziComposizioneState.idMezziBloccati) idMezziBloccati$: Observable<string[]>;
    idMezziBloccati: string[];
    @Select(MezziComposizioneState.idMezzoHover) idMezzoHover$: Observable<string>;
    idMezzoHover: string;

    // Squadre Composizione
    @Select(SquadreComposizioneState.squadreComposizione) squadraComposizione$: Observable<SquadraComposizione[]>;
    squadreComposizione: SquadraComposizione[];
    @Select(SquadreComposizioneState.idSquadreSelezionate) idSquadreSelezionate$: Observable<string[]>;
    idSquadreSelezionate: Array<string>;
    @Select(SquadreComposizioneState.idSquadraHover) idSquadraHover$: Observable<string>;
    idSquadraHover: string;

    idRichiesta: string;
    sostituzionePartenzaForm: FormGroup;
    submitted: boolean;

    statoMezzo = StatoMezzo;

    subscription: Subscription = new Subscription();

    constructor(private modal: NgbActiveModal,
                private fb: FormBuilder,
                private store: Store) {
        // Prendo i mezzi da visualizzare nella lista
        this.subscription.add(
            this.mezziComposizione$.subscribe((mezziComp: MezzoComposizione[]) => {
                this.mezziComposizione = mezziComp;
            })
        );
        // Prendo il mezzo selezionato
        this.subscription.add(
            this.idMezzoSelezionato$.subscribe((idMezzo: string) => {
                this.idMezzoSelezionato = idMezzo;
            })
        );
        // Prendo i mezzi in prenotazione
        this.subscription.add(
            this.idMezziInPrenotazione$.subscribe((idMezzi: string[]) => {
                this.idMezziInPrenotazione = idMezzi;
            })
        );
        // Prendo i mezzi prenotati
        this.subscription.add(
            this.idMezziPrenotati$.subscribe((idMezzi: string[]) => {
                this.idMezziPrenotati = idMezzi;
            })
        );
        // Prendo il mezzo hover
        this.subscription.add(
            this.idMezzoHover$.subscribe((idMezzo: string) => {
                this.idMezzoHover = idMezzo;
            })
        );
        // Prendo il mezzo bloccato
        this.subscription.add(
            this.idMezziBloccati$.subscribe((idMezzi: string[]) => {
                this.idMezziBloccati = idMezzi;
            })
        );

        // Prendo le squadre da visualizzare nella lista
        this.subscription.add(
            this.squadraComposizione$.subscribe((squadreComp: SquadraComposizione[]) => {
                this.squadreComposizione = makeCopy(squadreComp);
            })
        );
        // Prendo la squadra selezionata
        this.subscription.add(
            this.idSquadreSelezionate$.subscribe((idSquadre: string[]) => {
                this.idSquadreSelezionate = idSquadre;
            })
        );
        // Prendo la squadra hover
        this.subscription.add(
            this.idSquadraHover$.subscribe((idSquadra: string) => {
                this.idSquadraHover = idSquadra;
            })
        );
    }

    ngOnInit(): void {
        this.store.dispatch(new GetListaMezziSquadre(this.idRichiesta));
    }

    ngOnDestroy(): void {
        this.store.dispatch([
            new ClearListaMezziComposizione(),
            new ClearListaSquadreComposizione(),
            new ClearFiltriAffini(),
            new UnselectMezziAndSquadreComposizioneAvanzata(),
            new ClearBoxPartenze()
        ]);
    }

    initForm() {
        this.sostituzionePartenzaForm = new FormGroup({
            codMezzo: new FormControl(),
            codSquadre: new FormControl(),
        });
        this.sostituzionePartenzaForm = this.fb.group({
            codMezzo: [null, Validators.required],
            codSquadre: [null, Validators.required],
        });
        this.f.operatore.disable();
        this.f.sede.disable();
    }

    get f() {
        return this.sostituzionePartenzaForm.controls;
    }

    mezzoSelezionato(mezzoComposizione: MezzoComposizione) {
        this.store.dispatch([
            new ReducerSelectMezzoComposizione(mezzoComposizione),
        ]);
    }

    mezzoDeselezionato(mezzoComposizione: MezzoComposizione) {
        this.store.dispatch(new UnselectMezzoComposizione());
    }

    mezzoHoverIn(mezzoComposizione: MezzoComposizione) {
        this.store.dispatch([
            new HoverInMezzoComposizione(mezzoComposizione.id, mezzoComposizione.mezzo.coordinateFake),
        ]);
    }

    mezzoHoverOut() {
        this.store.dispatch([
            new HoverOutMezzoComposizione(),
        ]);
    }

    squadraSelezionata(squadraComposizione: SquadraComposizione) {
        if (squadraComposizione && !squadraComposizioneBusy(squadraComposizione.squadra.stato)) {
            this.store.dispatch(new SelectSquadraComposizione(squadraComposizione));
        }
    }

    squadraDeselezionata(squadraComposizione: SquadraComposizione) {
        this.store.dispatch(new UnselectSquadraComposizione(squadraComposizione));
    }

    squadraHoverIn(squadraComposizione: SquadraComposizione) {
        this.store.dispatch(new HoverInSquadraComposizione(squadraComposizione.id));
    }

    squadraHoverOut(squadraComposizione: SquadraComposizione) {
        this.store.dispatch(new HoverOutSquadraComposizione(squadraComposizione.id));
    }

    checkSquadraSelezione(idSquadra: string) {
        let selected = false;
        this.idSquadreSelezionate.forEach((id: string) => {
            if (id === idSquadra) {
                selected = true;
            }
        });
        return selected;
    }

    getTitle(): string {
        return 'Modifica Partenza Richiesta ' + this.idRichiesta;
    }

    onDismiss(): void {
        this.modal.dismiss('ko');
    }

    closeModal(type: string) {
        this.modal.close(type);
    }

    onConferma() {
        this.submitted = true;

        if (!this.sostituzionePartenzaForm.valid) {
            return;
        }

        this.modal.close({ success: true, result: this.sostituzionePartenzaForm.value });
        // formatTimeForCallBack();
    }
}
