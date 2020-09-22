import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import {
    ClearSchedaContattoHover,
    GetListaSchedeContatto, OpenDetailSC,
    SetRangeVisualizzazioneSchedeContatto,
    SetSchedaContattoGestita,
    SetSchedaContattoHover,
    SetSchedaContattoTelefonata,
    SetTabAttivo,
    ToggleCollapsed,
    UndoMergeSchedeContatto
} from '../store/actions/schede-contatto/schede-contatto.actions';
import { SchedeContattoState } from '../store/states/schede-contatto/schede-contatto.state';
import { Observable, Subscription } from 'rxjs';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import { ToggleChiamata, ToggleSchedeContatto } from '../store/actions/view/view.actions';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ContatoriSchedeContatto } from '../../../shared/interface/contatori-schede-contatto.interface';
import { RangeSchedeContattoEnum } from '../../../shared/enum/range-schede-contatto';
import {
    ClearSchedeContattoMarkers,
    GetSchedeContattoMarkers
} from '../store/actions/maps/schede-contatto-markers.actions';
import { MergeSchedeContattoState } from '../store/states/schede-contatto/merge-schede-contatto.state';
import {
    CheckboxError,
    ClearMergeSchedeContatto,
    InitSaveMergeSchedeContatto,
    SetMergeSchedaId,
    ToggleModalitaMerge
} from '../store/actions/schede-contatto/merge-schede-contatto.actions';
import { CheckboxInterface } from '../../../shared/interface/checkbox.interface';
import { ClassificazioneSchedaContatto } from '../../../shared/enum/classificazione-scheda-contatto.enum';
import { LoadingState } from '../../../shared/store/states/loading/loading.state';
import { ConfirmModalComponent } from '../../../shared';
import { AreaMappaState } from '../store/states/maps/area-mappa.state';
import { PermissionFeatures } from '../../../shared/enum/permission-features.enum';

@Component({
    selector: 'app-schede-contatto',
    templateUrl: './schede-contatto.component.html',
    styleUrls: ['./schede-contatto.component.css']
})
export class SchedeContattoComponent implements OnInit, OnDestroy {


    @Select(SchedeContattoState.schedeContatto) schedeContatto$: Observable<SchedaContatto[]>;
    schedeContatto: SchedaContatto[];

    @Select(SchedeContattoState.idSchedeCompetenza) idSchedeCompetenza$: Observable<string[]>;
    @Select(SchedeContattoState.idSchedeConoscenza) idSchedeConoscenza$: Observable<string[]>;
    @Select(SchedeContattoState.idSchedeDifferibili) idSchedeDifferibili$: Observable<string[]>;
    @Select(SchedeContattoState.idVisualizzati) idVisualizzati$: Observable<string[]>;
    @Select(SchedeContattoState.idCollapsed) idCollapsed$: Observable<string[]>;

    @Select(SchedeContattoState.codiceSchedaContattoHover) codiceSchedaContattoHover$: Observable<string>;
    codiceSchedaContattoHover: string;
    @Select(SchedeContattoState.contatoriSchedeContatto) contatoriSchedeContatto$: Observable<ContatoriSchedeContatto>;
    contatoriSchedeContatto: ContatoriSchedeContatto;
    @Select(SchedeContattoState.rangeVisualizzazione) rangeVisualizzazione$: Observable<RangeSchedeContattoEnum>;
    rangeVisualizzazione: RangeSchedeContattoEnum;
    @Select(SchedeContattoState.tabAttivo) tabAttivo$: Observable<ClassificazioneSchedaContatto>;

    @Select(MergeSchedeContattoState.statoModalita) statoModalita$: Observable<boolean>;
    statoModalita: boolean;
    @Select(MergeSchedeContattoState.classificazione) classificazioneMerge$: Observable<ClassificazioneSchedaContatto>;
    classificazioneMerge: ClassificazioneSchedaContatto;
    @Select(MergeSchedeContattoState.schedeSelezionateId) idSelezionatiMerge$: Observable<string[]>;
    idSelezionatiMerge: string[];
    @Select(LoadingState.loading) loading$: Observable<boolean>;

    rangeSchedeContattoEnumValues = Object.values(RangeSchedeContattoEnum);
    RangeVisualizzazione = RangeSchedeContattoEnum;
    private subscription: Subscription = new Subscription();

    ClassificazioneEnum = ClassificazioneSchedaContatto;
    permessiFeature = PermissionFeatures;

    constructor(private store: Store,
                private modal: NgbModal) {
        this.subscription.add(
            this.schedeContatto$.subscribe((schedeContatto: SchedaContatto[]) => {
                this.schedeContatto = schedeContatto;
            })
        );

        this.subscription.add(
            this.codiceSchedaContattoHover$.subscribe((codiceSchedaContatto: string) => {
                this.codiceSchedaContattoHover = codiceSchedaContatto;
            })
        );
        this.subscription.add(
            this.contatoriSchedeContatto$.subscribe((contaotoriSchede: ContatoriSchedeContatto) => {
                this.contatoriSchedeContatto = contaotoriSchede;
            })
        );
        this.subscription.add(
            this.rangeVisualizzazione$.subscribe((range: RangeSchedeContattoEnum) => {
                this.rangeVisualizzazione = range;
            })
        );
        this.subscription.add(this.statoModalita$.subscribe((stato: boolean) => this.statoModalita = stato));
        this.subscription.add(this.classificazioneMerge$.subscribe((classificazione: ClassificazioneSchedaContatto) => this.classificazioneMerge = classificazione));
        this.subscription.add(this.idSelezionatiMerge$.subscribe((idSelezionatiMerge: string[]) => this.idSelezionatiMerge = idSelezionatiMerge));

    }

    ngOnInit(): void {
        isDevMode() && console.log('Componente Schede Contatto creato');
        const areaMappa = this.store.selectSnapshot(AreaMappaState.areaMappa);
        this.store.dispatch([new GetListaSchedeContatto(), new GetSchedeContattoMarkers(areaMappa)]);
    }

    ngOnDestroy(): void {
        this.store.dispatch(new ClearSchedeContattoMarkers());
        this.store.dispatch(new ClearMergeSchedeContatto());
        isDevMode() && console.log('Componente Schede Contatto distrutto');
    }

    setSchedaContattoGestita(schedaContatto: SchedaContatto, gestita: boolean) {
        this.store.dispatch(new SetSchedaContattoGestita(schedaContatto, gestita));
    }

    setSchedaContattoTelefonata(schedaContatto: SchedaContatto) {
        this.store.dispatch(new SetSchedaContattoTelefonata(schedaContatto));
        this.store.dispatch(new ToggleChiamata());
    }

    setFiltroRange(range: RangeSchedeContattoEnum) {
        this.store.dispatch(new SetRangeVisualizzazioneSchedeContatto(range));
    }

    dettaglioScheda(idSchedaContatto: string) {
        this.store.dispatch(new OpenDetailSC(idSchedaContatto));
    }

    hoverIn(idSchedaContatto: string) {
        this.store.dispatch(new SetSchedaContattoHover(idSchedaContatto));
    }

    hoverOut() {
        this.store.dispatch(new ClearSchedaContattoHover());
    }

    tornaIndietro() {
        this.store.dispatch(new ToggleSchedeContatto());
    }

    onToggleModalitaMerge() {
        this.store.dispatch(new ToggleModalitaMerge());
    }

    onEditSchedaSelezionata($event: CheckboxInterface) {
        this.store.dispatch(new SetMergeSchedaId($event.object));
    }

    onCheckboxError() {
        this.store.dispatch(new CheckboxError());
    }

    onSaveMerge() {
        this.store.dispatch(new InitSaveMergeSchedeContatto());
    }

    onSelectTab($event: NgbTabChangeEvent) {
        let classificazione: ClassificazioneSchedaContatto = null;
        if ($event.nextId !== 'Tutte') {
            classificazione = $event.nextId as ClassificazioneSchedaContatto;
        }
        this.store.dispatch(new SetTabAttivo(classificazione));
    }

    onCollapsed($event: string) {
        this.store.dispatch(new ToggleCollapsed($event));
    }

    onUndoMergeSchedaContatto($event: string): void {
        const modalConfermaAnnulla = this.modal.open(ConfirmModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
        modalConfermaAnnulla.componentInstance.icona = { descrizione: 'trash', colore: 'danger' };
        modalConfermaAnnulla.componentInstance.titolo = 'Annulla Raggruppamento';
        modalConfermaAnnulla.componentInstance.messaggio = 'Sei sicuro di voler annullare il raggruppamento delle schede contatto selezionate?';
        modalConfermaAnnulla.componentInstance.messaggioAttenzione = 'Il raggruppamento sarà eliminato.';
        modalConfermaAnnulla.componentInstance.bottoni = [
            { type: 'ko', descrizione: 'Annulla', colore: 'secondary' },
            { type: 'ok', descrizione: 'Conferma', colore: 'danger' },
        ];

        modalConfermaAnnulla.result.then(
            (val) => {
                switch (val) {
                    case 'ok':
                        this.store.dispatch(new UndoMergeSchedeContatto($event));
                        break;
                    case 'ko':
                        this.store.dispatch(new ToggleModalitaMerge());
                        break;
                }
                console.log('Modal chiusa con val ->', val);
            },
            (err) => console.error('Modal chiusa senza bottoni. Err ->', err)
        );
    }

}
