import { Component, EventEmitter, HostBinding, Input, OnDestroy, Output } from '@angular/core';
import { VoceFiltro } from './voce-filtro.model';
import { NgbActiveModal, NgbDropdownConfig, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalFiltriTipologiaComponent } from './modal-filtri-tipologia/modal-filtri-tipologia.component';
import {
    ApplyFiltriTipologiaSelezionatiRichieste,
    ClearFiltroSenzaEsecuzione,
    RemoveChiuseRichiesta, RemoveFakeStatoRichiesta,
    RemovePeriodoChiuse,
    ResetFiltriSelezionatiRichieste,
    SetChiuseRichiesta,
    SetFakeStatoRichiesta,
    SetPeriodoChiuse
} from '../../store/actions/filterbar/filtri-richieste.actions';
import { Select, Store } from '@ngxs/store';
import { ModalRichiesteChiuseComponent } from './modal-richieste-chiuse/modal-richieste-chiuse.component';
import { ModalZonaEmergenzaComponent } from './modal-zona-emergenza/modal-zona-emergenza.component';
import {
    ResetFiltriStatiZone, ResetFiltriZoneSelezionate,
    SetZoneEmergenzaSelezionate
} from '../../store/actions/filterbar/zone-emergenza.actions';
import { Observable, Subscription } from 'rxjs';
import { FiltriRichiesteState } from '../../store/states/filterbar/filtri-richieste.state';

@Component({
    selector: 'app-filtri-richieste',
    templateUrl: './filtri-richieste.component.html',
    styleUrls: ['./filtri-richieste.component.css']
})
export class FiltriRichiesteComponent implements OnDestroy {

    @HostBinding('class') classes = 'input-group-append';

    @Input() filtri: VoceFiltro[];
    @Input() statiRichiesta: VoceFiltro[];
    @Input() chiuse: VoceFiltro[];
    @Input() filtriSelezionati: VoceFiltro[];
    @Input() disableFilters: boolean;
    @Input() nightMode: boolean;
    @Input() filtriAttiviToolTip: VoceFiltro[];

    @Output() filtroSelezionato: EventEmitter<VoceFiltro> = new EventEmitter();
    @Output() filtroDeselezionato: EventEmitter<VoceFiltro> = new EventEmitter();
    @Output() filtriReset: EventEmitter<any> = new EventEmitter();

    @Select(FiltriRichiesteState.disableFiltri) lockFiltri$: Observable<boolean>;
    lockFiltri: boolean;

    specialSelected = [false, false, false];

    listaZoneEmergenzaSelezionate: string[] = [];
    periodoChiuseChiamate: any = {
        daA: null,
        data: null,
        turno: null,
    };
    periodoChiusiInterventi: any = {
        daA: null,
        data: null,
        turno: null,
    };
    onlyOneCheck = false;
    altriFiltri: VoceFiltro[] = [{
        categoria: 'AltriFiltri',
        codice: 'ZonaEmergenza',
        descrizione: 'Zona Emergenza',
        name: 'zonaEmergenza',
        star: true,
        statico: true,
    }];

    private subscriptions: Subscription = new Subscription();

    constructor(private store: Store,
                private modalService: NgbModal,
                private modal: NgbActiveModal,
                dropdownOpts: NgbDropdownConfig) {
        dropdownOpts.placement = 'bottom';
        this.subscriptions.add(
            this.lockFiltri$.subscribe((lockFiltri: boolean) => {
                this.lockFiltri = lockFiltri;
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    openFiltersModal(): void {
        let modalOptions;
        modalOptions = {
            windowClass: 'xlModal',
            backdrop: 'static',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            keyboard: false
        } as NgbModalOptions;
        const modal = this.modalService.open(ModalFiltriTipologiaComponent, modalOptions);
        modal.result.then((res: string[]) => {
            this.store.dispatch(new ApplyFiltriTipologiaSelezionatiRichieste());
        });
    } // Da rimuovere

    openChiusiModal(event: any): void {
        let modalOptions;
        if (event.value) {
            modalOptions = {
                windowClass: '',
                backdrop: 'static',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                keyboard: false,
                size: 'lg',
            } as NgbModalOptions;
        }
        const modal = this.modalService.open(ModalRichiesteChiuseComponent, modalOptions);
        modal.result.then((res: any) => {
            switch (res.status) {
                case 'ok':
                    this.store.dispatch(new SetPeriodoChiuse(res.result, event.richiesta));
                    this.store.dispatch(new ApplyFiltriTipologiaSelezionatiRichieste());
                    if (event.richiesta === 'Chiamate') {
                        this.periodoChiuseChiamate = res.date;
                    } else if (event.richiesta === 'Interventi') {
                        this.periodoChiusiInterventi = res.date;
                    }
                    break;
                case 'ko':
                    if (event.richiesta === 'Chiamate') {
                        this.periodoChiuseChiamate = {};
                    } else if (event.richiesta === 'Interventi') {
                        this.periodoChiusiInterventi = {};
                    }
                    break;
            }
        });
    }

    openZonaEmergenzaModal(open: boolean): void {
        let modalOptions;
        if (open) {
            modalOptions = {
                windowClass: '',
                backdrop: 'static',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                keyboard: false,
                size: 'lg',
            } as NgbModalOptions;
        }
        const modal = this.modalService.open(ModalZonaEmergenzaComponent, modalOptions);
        modal.result.then((res: string[]) => {
            if (res != null) {
                this.listaZoneEmergenzaSelezionate = [];
                if (!res.includes('Nessuna zona emergenza')) {
                    res.forEach(x => this.listaZoneEmergenzaSelezionate.push(x));
                } else {
                    this.listaZoneEmergenzaSelezionate[0] = 'Nessuna zona emergenza';
                }
                this.store.dispatch(new SetZoneEmergenzaSelezionate(res));
                this.store.dispatch(new ApplyFiltriTipologiaSelezionatiRichieste());
            } else {
                const filtro = {
                    categoria: 'AltriFiltri',
                    codice: 'ZonaEmergenza',
                    descrizione: 'Zona Emergenza',
                    name: 'zonaEmergenza',
                    star: true,
                    statico: true,
                };
                this.filtroDeselezionato.emit(filtro);
                this.listaZoneEmergenzaSelezionate = [];
            }
        });
    }

    onSelezioneFiltro(filtro: VoceFiltro): void {
        const index = this.filtri.findIndex(e => e.name === filtro.name);
        if (filtro.categoria !== 'StatiRichiesta' && filtro.categoria !== 'AltriFiltri' && filtro.categoria !== 'Chiuse') {
            this.specialSelected = [false, false, false];
            this.specialSelected[index] = true;
            this.filtri.forEach((e, i) => {
                if (i !== index && i < 3) {
                    this.store.dispatch(new ClearFiltroSenzaEsecuzione(filtro));
                }
            });
        }
        if (filtro.categoria === 'StatiRichiesta') {
            this.store.dispatch(new SetFakeStatoRichiesta(filtro.codice));
            this.filtroSelezionato.emit(filtro);
        } else if (filtro.categoria === 'Chiuse') {
            if (!this.lockFiltri) {
                this.resetFiltri(true);
            }
            this.store.dispatch(new SetChiuseRichiesta(filtro.codice));
            this.filtroSelezionato.emit(filtro);
        } else {
            this.filtroSelezionato.emit(filtro);
        }
    }

    onDeselezioneFiltro(filtro: VoceFiltro): void {
        const index = this.filtri.findIndex(e => e.name === filtro.name);
        this.specialSelected[index] = false;
        if (filtro.categoria === 'AltriFiltri') {
            this.store.dispatch(new ResetFiltriZoneSelezionate());
            this.listaZoneEmergenzaSelezionate = [];
        }
        if (filtro.categoria === 'StatiRichiesta') {
            this.store.dispatch(new RemoveFakeStatoRichiesta(filtro.codice));
            this.filtroDeselezionato.emit(filtro);
        } else if (filtro.categoria === 'Chiuse') {
            if (filtro.descrizione === 'Chiamate') {
                this.periodoChiuseChiamate = {};
            } else if (filtro.descrizione === 'Interventi') {
                this.periodoChiusiInterventi = {};
            }
            this.store.dispatch(new RemovePeriodoChiuse(filtro.descrizione));
            this.store.dispatch(new RemoveChiuseRichiesta(filtro.codice));
            this.filtroDeselezionato.emit(filtro);
        } else {
            this.filtroDeselezionato.emit(filtro);
        }
    }

    resetFiltri(chiuse?: boolean): void {
        this.specialSelected = [false, false, false];
        this.listaZoneEmergenzaSelezionate = [];
        this.periodoChiuseChiamate = {};
        this.periodoChiusiInterventi = {};
        this.store.dispatch(new ResetFiltriStatiZone());
        this.store.dispatch(new RemovePeriodoChiuse());
        if (!chiuse) {
            this.filtriReset.emit();
        } else {
            this.store.dispatch(new ResetFiltriSelezionatiRichieste({ preventGetList: true }));
        }
    }

    nightModeStyle(): string {
        let value = '';
        if (!this.nightMode) {
            value = 'cod-int';
        } else if (this.nightMode) {
            value = 'moon-cod';
        }
        return value;
    }

    checkIndex(index): boolean {
        return !this.specialSelected.filter((x, i) => x && i !== index);
    }
}
