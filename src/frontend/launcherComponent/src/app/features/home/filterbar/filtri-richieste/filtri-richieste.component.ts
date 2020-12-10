import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {VoceFiltro} from './voce-filtro.model';
import {NgbActiveModal, NgbDropdownConfig, NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {ModalFiltriTipologiaComponent} from './modal-filtri-tipologia/modal-filtri-tipologia.component';
import {ApplyFiltriTipologiaSelezionatiRichieste, SetZoneEmergenza} from '../../store/actions/filterbar/filtri-richieste.actions';
import {Select, Store} from '@ngxs/store';
import {ViewportState} from '../../../../shared/store/states/viewport/viewport.state';
import {Observable, Subscription} from 'rxjs';
import {ModalRichiesteChiuseComponent} from './modal-richieste-chiuse/modal-richieste-chiuse.component';
import {ModalZonaEmergenzaComponent} from './modal-zona-emergenza/modal-zona-emergenza.component';

@Component({
  selector: 'app-filtri-richieste',
  templateUrl: './filtri-richieste.component.html',
  styleUrls: ['./filtri-richieste.component.css']
})
export class FiltriRichiesteComponent {

  @HostBinding('class') classes = 'input-group-append';

  @Input() filtri: VoceFiltro[];
  @Input() filtriSelezionati: VoceFiltro[];
  @Input() disableFilters: boolean;

  @Output() filtroSelezionato: EventEmitter<VoceFiltro> = new EventEmitter();
  @Output() filtroDeselezionato: EventEmitter<VoceFiltro> = new EventEmitter();
  @Output() filtriReset: EventEmitter<any> = new EventEmitter();

  @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
  doubleMonitor: boolean;

  statiRichiesta: VoceFiltro[] = [{
    categoria: 'StatiRichiesta',
    codice: 'Assegnati',
    descrizione: 'Assegnati',
    name: 'assegnati',
    star: true,
    statico: true,
  },
    {
      categoria: 'StatiRichiesta',
      codice: 'Sospesi',
      descrizione: 'Sospesi',
      name: 'sospesi',
      star: true,
      statico: true,
    },
    {
      categoria: 'StatiRichiesta',
      codice: 'Presidiati',
      descrizione: 'Presidiati',
      name: 'presidiati',
      star: true,
      statico: true,
    },
    {
      categoria: 'StatiRichiesta',
      codice: 'Chiusi',
      descrizione: 'Chiusi',
      name: 'chiusi',
      star: true,
      statico: true,
    },
  ];

  altriFiltri: VoceFiltro[] = [{
    categoria: 'AltriFiltri',
    codice: 'ZonaEmergenza',
    descrizione: 'Zona Emergenza',
    name: 'zonaEmergenza',
    star: true,
    statico: true,
  }];

  subscription = new Subscription();

  constructor(private store: Store,
              private modalService: NgbModal,
              private modal: NgbActiveModal,
              dropdownOpts: NgbDropdownConfig) {
    dropdownOpts.placement = 'bottom';
    this.subscription.add(this.doubleMonitor$.subscribe(r => this.doubleMonitor = r));
  }

  openFiltersModal(): void {
    let modalOptions;
    if (this.doubleMonitor) {
      modalOptions = {
        windowClass: 'xlModal modal-left',
        backdrop: 'static',
        backdropClass: 'light-blue-backdrop',
        centered: true,
        keyboard: false
      } as NgbModalOptions;
    } else {
      modalOptions = {
        windowClass: 'xlModal',
        backdrop: 'static',
        backdropClass: 'light-blue-backdrop',
        centered: true,
        keyboard: false
      } as NgbModalOptions;
    }
    const modal = this.modalService.open(ModalFiltriTipologiaComponent, modalOptions);
    modal.result.then((res: string[]) => {
      console.log('TESTTTT*****');
      console.log('TESTTTT', res);
      this.store.dispatch(new SetZoneEmergenza(res));
      this.store.dispatch(new ApplyFiltriTipologiaSelezionatiRichieste());
      /*
      switch (res) {
        case 'ok':
          this.store.dispatch(new ApplyFiltriTipologiaSelezionatiRichieste());
          break;
        case 'ko':
          break;
      }
      */
    });
  }

  openChiusiModal(open: boolean): void {
    let modalOptions;
    if (open) {
      if (this.doubleMonitor) {
        modalOptions = {
          windowClass: 'modal-left',
          backdrop: 'static',
          backdropClass: 'light-blue-backdrop',
          centered: true,
          keyboard: false,
          size: 'lg',
        } as NgbModalOptions;
      } else {
        modalOptions = {
          windowClass: '',
          backdrop: 'static',
          backdropClass: 'light-blue-backdrop',
          centered: true,
          keyboard: false,
          size: 'lg',
        } as NgbModalOptions;
      }
    }
    const modal = this.modalService.open(ModalRichiesteChiuseComponent, modalOptions);
    modal.result.then((res: string) => {
      switch (res) {
        case 'ok':
          this.store.dispatch(new ApplyFiltriTipologiaSelezionatiRichieste());
          break;
        case 'ko':
          break;
      }
    });
  }

  openZonaEmergenzaModal(open: boolean): void {
    let modalOptions;
    if (open) {
      if (this.doubleMonitor) {
        modalOptions = {
          windowClass: 'modal-left',
          backdrop: 'static',
          backdropClass: 'light-blue-backdrop',
          centered: true,
          keyboard: false,
          size: 'lg',
        } as NgbModalOptions;
      } else {
        modalOptions = {
          windowClass: '',
          backdrop: 'static',
          backdropClass: 'light-blue-backdrop',
          centered: true,
          keyboard: false,
          size: 'lg',
        } as NgbModalOptions;
      }
    }
    const modal = this.modalService.open(ModalZonaEmergenzaComponent, modalOptions);
    modal.result.then((res: string[]) => {
      console.log('TESTTTT', res);
      this.store.dispatch(new SetZoneEmergenza(res));
      this.store.dispatch(new ApplyFiltriTipologiaSelezionatiRichieste());
    });
  }

  onSelezioneFiltro(filtro: VoceFiltro): void {
    this.filtroSelezionato.emit(filtro);
  }

  onDeselezioneFiltro(filtro: VoceFiltro): void {
    this.filtroDeselezionato.emit(filtro);
  }

  resetFiltri(): void {
    this.filtriReset.emit();
  }
}
