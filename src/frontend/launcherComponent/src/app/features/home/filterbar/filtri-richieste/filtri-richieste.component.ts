import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {VoceFiltro} from './voce-filtro.model';
import {NgbActiveModal, NgbDropdownConfig, NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {ModalFiltriTipologiaComponent} from './modal-filtri-tipologia/modal-filtri-tipologia.component';
import {
  ApplyFiltriTipologiaSelezionatiRichieste, ClearFiltroSenzaEsecuzione
} from '../../store/actions/filterbar/filtri-richieste.actions';
import {Select, Store} from '@ngxs/store';
import {ViewportState} from '../../../../shared/store/states/viewport/viewport.state';
import {Observable, Subscription} from 'rxjs';
import {ModalRichiesteChiuseComponent} from './modal-richieste-chiuse/modal-richieste-chiuse.component';
import {ModalZonaEmergenzaComponent} from './modal-zona-emergenza/modal-zona-emergenza.component';
import {
  RemoveFakeStatoRichiesta, RemovePeriodoChiuse, ResetFiltriStatiZone, ResetFiltriZoneSelezionate,
  SetFakeStatoRichiesta, SetPeriodoChiuse,
  SetZoneEmergenzaSelezionate
} from '../../store/actions/filterbar/zone-emergenza.actions';
import {FiltriRichiesteState} from '../../store/states/filterbar/filtri-richieste.state';

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

  specialSelected = [false, false, false];

  @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
  doubleMonitor: boolean;
  @Select(FiltriRichiesteState.filtriRichiesteSelezionati) filtriAttiviToolTip$: Observable<VoceFiltro>;
  filtriAttiviToolTip: VoceFiltro[];

  listaZoneEmergenzaSelezionate: string[] = [];
  periodoChiuse: any = {
    daA: null,
    data: null,
    turno: null,
  };
  onlyOneCheck = false;
  statiRichiesta: VoceFiltro[] = [
      {
      categoria: 'StatiRichiesta',
      codice: 'Assegnata',
      descrizione: 'Assegnati',
      name: 'assegnati',
      star: true,
      statico: true,
    },
    {
      categoria: 'StatiRichiesta',
      codice: 'Sospesa',
      descrizione: 'Sospesi',
      name: 'sospesi',
      star: true,
      statico: true,
    },
    {
      categoria: 'StatiRichiesta',
      codice: 'Presidiata',
      descrizione: 'Presidiati',
      name: 'presidiati',
      star: true,
      statico: true,
    },
    {
      categoria: 'StatiRichiesta',
      codice: 'Chiusa',
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
    this.getFiltriAttiviTooltip();
  }

  getFiltriAttiviTooltip(): void {
    this.subscription.add(
      this.filtriAttiviToolTip$.subscribe((filtri: any) => {
        this.filtriAttiviToolTip = filtri;
      })
    );
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
  } // Da rimuovere

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
    modal.result.then((res: any) => {
      switch (res.status) {
        case 'ok':
          this.periodoChiuse = res.date;
          this.store.dispatch(new SetPeriodoChiuse(res.result));
          this.store.dispatch(new ApplyFiltriTipologiaSelezionatiRichieste());
          break;
        case 'ko':
          this.periodoChiuse = {};
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
      if (res != null) {
        this.listaZoneEmergenzaSelezionate = [];
        if (!res.includes('Nessuna zona emergenza')) {
          res.forEach(x => this.listaZoneEmergenzaSelezionate.push(x));
        } else { this.listaZoneEmergenzaSelezionate[0] = 'Nessuna zona emergenza'; }
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
    if (filtro.categoria !== 'StatiRichiesta' && filtro.categoria !== 'AltriFiltri') {
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
    if (filtro.name === 'chiusi') {
      this.periodoChiuse = {};
      this.store.dispatch(new RemovePeriodoChiuse());
    }
    if (filtro.categoria === 'StatiRichiesta') {
      this.store.dispatch(new RemoveFakeStatoRichiesta(filtro.codice));
      this.filtroDeselezionato.emit(filtro);
    } else {
      this.filtroDeselezionato.emit(filtro);
    }
  }

  resetFiltri(): void {
    this.specialSelected = [false, false, false];
    this.listaZoneEmergenzaSelezionate = [];
    this.periodoChiuse = {};
    this.store.dispatch(new ResetFiltriStatiZone());
    this.store.dispatch(new RemovePeriodoChiuse());
    this.filtriReset.emit();
  }

  checkIndex(index): boolean {
    return !this.specialSelected.filter((x, i) => x && i !== index);
  }
}
