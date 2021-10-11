import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { RicercaFilterbarState } from '../../../features/home/store/states/filterbar/ricerca-filterbar.state';
import { Observable, Subscription } from 'rxjs';
import { PaginationState } from '../../store/states/pagination/pagination.state';
import { SchedeContattoState } from '../../../features/home/store/states/schede-contatto/schede-contatto.state';
import { SchedaContatto } from '../../interface/scheda-contatto.interface';
import { ContatoriSchedeContatto } from '../../interface/contatori-schede-contatto.interface';
import { RangeSchedeContattoEnum } from '../../enum/range-schede-contatto';
import { ClassificazioneSchedaContatto } from '../../enum/classificazione-scheda-contatto.enum';
import { MergeSchedeContattoState } from '../../../features/home/store/states/schede-contatto/merge-schede-contatto.state';
import { LoadingState } from '../../store/states/loading/loading.state';
import { PermissionFeatures } from '../../enum/permission-features.enum';
import {
    ClearSchedaContattoHover,
    GetListaSchedeContatto,
    OpenDetailSC,
    SetRangeVisualizzazioneSchedeContatto,
    SetSchedaContattoGestita,
    SetSchedaContattoHover,
    SetSchedaContattoTelefonata,
    SetTabAttivo,
    ToggleCollapsed,
    UndoMergeSchedeContatto
} from '../../../features/home/store/actions/schede-contatto/schede-contatto.actions';
import { ToggleSchedeContatto } from '../../../features/home/store/actions/view/view.actions';
import { CheckboxError, ClearMergeSchedeContatto, InitSaveMergeSchedeContatto, SetMergeSchedaId, ToggleModalitaMerge } from '../../../features/home/store/actions/schede-contatto/merge-schede-contatto.actions';
import { CheckboxInterface } from '../../interface/checkbox.interface';
import { NgbActiveModal, NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { ClearRicercaFilterbar } from '../../../features/home/store/actions/filterbar/ricerca-richieste.actions';
import { AreaMappaState } from '../../../features/home/store/states/maps/area-mappa.state';

@Component({
    selector: 'app-lista-schede-contatto-modal',
    templateUrl: './lista-schede-contatto-modal.component.html',
    styleUrls: ['./lista-schede-contatto-modal.component.scss']
})
export class ListaSchedeContattoModalComponent implements OnInit, OnDestroy {

    @Select(RicercaFilterbarState.ricerca) ricerca$: Observable<string>;
    ricerca: string;
    @Select(PaginationState.pageSize) pageSize$: Observable<number>;
    @Select(PaginationState.pageSizes) pageSizes$: Observable<number[]>;
    @Select(PaginationState.totalItems) totalItems$: Observable<number>;
    @Select(PaginationState.page) page$: Observable<number>;

    @Select(SchedeContattoState.schedeContatto) schedeContatto$: Observable<SchedaContatto[]>;
    schedeContatto: SchedaContatto[];

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
    @Select(SchedeContattoState.loadingSchedeContatto) loadingSchedeContatto$: Observable<boolean>;

    permessiFeature = PermissionFeatures;

    private subscriptions: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbModal,
                private activeModal: NgbActiveModal) {
        this.getRicerca();
        this.getSchedeContatto();
        this.getSchedeContattoMarkers();
        this.getSchedeContattoHover();
        this.getRangeVisualizzazioneContatoriSchedeContatto();
        this.getContatoriSchedeContatto();
        this.subscriptions.add(this.statoModalita$.subscribe((stato: boolean) => this.statoModalita = stato));
        this.subscriptions.add(this.classificazioneMerge$.subscribe((classificazione: ClassificazioneSchedaContatto) => this.classificazioneMerge = classificazione));
        this.subscriptions.add(this.idSelezionatiMerge$.subscribe((idSelezionatiMerge: string[]) => this.idSelezionatiMerge = idSelezionatiMerge));

    }

    ngOnInit(): void {
        console.log('Componente Schede Contatto creato');
    }

    ngOnDestroy(): void {
        this.store.dispatch([
            new ClearMergeSchedeContatto(),
            new ClearRicercaFilterbar()
        ]);
        this.subscriptions.unsubscribe();
        console.log('Componente Schede Contatto distrutto');
    }

    getRicerca(): void {
        this.subscriptions.add(
            this.ricerca$.subscribe((ricerca: string) => {
                if (ricerca !== null) {
                    this.ricerca = ricerca;
                    this.store.dispatch(new GetListaSchedeContatto());
                }
            })
        );
    }

    getSchedeContatto(): void {
        this.store.dispatch(new GetListaSchedeContatto());
        this.subscriptions.add(
            this.schedeContatto$.subscribe((schedeContatto: SchedaContatto[]) => {
                this.schedeContatto = schedeContatto;
            })
        );
    }

    getSchedeContattoMarkers(): void {
        const areaMappa = this.store.selectSnapshot(AreaMappaState.areaMappa);
    }

    getSchedeContattoHover(): void {
        this.subscriptions.add(
            this.codiceSchedaContattoHover$.subscribe((codiceSchedaContatto: string) => {
                this.codiceSchedaContattoHover = codiceSchedaContatto;
            })
        );
    }

    getContatoriSchedeContatto(): void {
        this.subscriptions.add(
            this.contatoriSchedeContatto$.subscribe((contaotoriSchede: ContatoriSchedeContatto) => {
                this.contatoriSchedeContatto = contaotoriSchede;
            })
        );
    }

    getRangeVisualizzazioneContatoriSchedeContatto(): void {
        this.subscriptions.add(
            this.rangeVisualizzazione$.subscribe((range: RangeSchedeContattoEnum) => {
                this.rangeVisualizzazione = range;
            })
        );
    }

    setSchedaContattoGestita(schedaContatto: SchedaContatto, gestita: boolean): void {
        this.store.dispatch(new SetSchedaContattoGestita(schedaContatto, gestita));
    }

    setSchedaContattoTelefonata(schedaContatto: SchedaContatto): void {
        this.store.dispatch(new SetSchedaContattoTelefonata(schedaContatto));
        this.closeModal('ok');
    }

    setFiltroRange(range: RangeSchedeContattoEnum): void {
        this.store.dispatch(new SetRangeVisualizzazioneSchedeContatto(range));
    }

    onDettaglioScheda(idSchedaContatto: string): void {
        this.store.dispatch(new OpenDetailSC(idSchedaContatto));
    }

    onHoverIn(idSchedaContatto: string): void {
        this.store.dispatch(new SetSchedaContattoHover(idSchedaContatto));
    }

    onHoverOut(): void {
        this.store.dispatch(new ClearSchedaContattoHover());
    }

    onTornaIndietro(): void {
        this.store.dispatch(new ToggleSchedeContatto());
    }

    onToggleModalitaMerge(): void {
        this.store.dispatch(new ToggleModalitaMerge());
    }

    onEditSchedaSelezionata($event: CheckboxInterface): void {
        this.store.dispatch(new SetMergeSchedaId($event.object));
    }

    onCheckboxError(): void {
        this.store.dispatch(new CheckboxError());
    }

    onSaveMerge(): void {
        this.store.dispatch(new InitSaveMergeSchedeContatto());
    }

    onPageChange(page: number): void {
        this.store.dispatch(new GetListaSchedeContatto(page));
    }

    onSelectTab($event: NgbTabChangeEvent): void {
        const classificazione = $event.nextId as ClassificazioneSchedaContatto;
        this.store.dispatch(new SetTabAttivo(classificazione));
    }

    onCollapsed($event: string): void {
        this.store.dispatch(new ToggleCollapsed($event));
    }

    onUndoMergeSchedaContatto($event: string): void {
        let modalConfermaAnnulla;
        modalConfermaAnnulla = this.modal.open(ConfirmModalComponent, {
            windowClass: 'modal-holder',
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
        modalConfermaAnnulla.componentInstance.icona = { descrizione: 'trash', colore: 'danger' };
        modalConfermaAnnulla.componentInstance.titolo = 'Annulla Raggruppamento';
        modalConfermaAnnulla.componentInstance.messaggio = 'Sei sicuro di voler annullare il raggruppamento delle schede contatto selezionate?';
        modalConfermaAnnulla.componentInstance.messaggioAttenzione = 'Il raggruppamento sarà eliminato.';

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

    closeModal(res: string): void {
        this.activeModal.dismiss(res);
    }
}
