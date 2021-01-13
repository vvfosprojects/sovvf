import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { ReducerFilterListeComposizione, RichiestaComposizione } from '../../../features/home/store/actions/composizione-partenza/composizione-partenza.actions';
import { ComposizionePartenzaState } from '../../../features/home/store/states/composizione-partenza/composizione-partenza.state';
import { TurnOffComposizione, SwitchComposizione } from '../../../features/home/store/actions/view/view.actions';
import { Composizione } from 'src/app/shared/enum/composizione.enum';
import { ViewComponentState } from '../../../features/home/store/states/view/view.state';
import {Observable, Subscription} from 'rxjs';
import { iconaStatiClass } from '../../helper/composizione-functions';
import {
  AddFiltroSelezionatoComposizione,
  ClearFiltriComposizione,
  ResetFiltriComposizione,
  SetFiltriDistaccamentoDefault
} from '../../store/actions/filtri-composizione/filtri-composizione.actions';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { SetMarkerRichiestaSelezionato } from 'src/app/features/home/store/actions/maps/marker.actions';
import { SostituzionePartenzaModalState } from '../../store/states/sostituzione-partenza-modal/sostituzione-partenza-modal.state';
import { GetListaMezziSquadre, StartListaComposizioneLoading } from '../../store/actions/sostituzione-partenza/sostituzione-partenza.actions';
import { ListaTipologicheMezzi } from '../../../features/home/composizione-partenza/interface/filtri/lista-filtri-composizione-interface';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import {ViewLayouts} from '../../interface/view.interface';
import {Sede} from '../../model/sede.model';

@Component({
    selector: 'app-filterbar-composizione',
    templateUrl: './filterbar-composizione.component.html',
    styleUrls: ['./filterbar-composizione.component.css']
})
export class FilterbarComposizioneComponent implements OnDestroy {

    @Input() filtri: ListaTipologicheMezzi;
    @Input() prenotato: any;
    @Input() disableComposizioneMode: boolean;
    @Input() nascondiTornaIndietro: boolean;
    @Input() nascondiCambiaComposizioneMode: boolean;
    @Input() composizionePartenza: boolean;
    @Input() sostituzionePartenza: boolean;
    @Input() competenze: Sede[];

    @Output() confirmPrenota = new EventEmitter<boolean>();

    @Select(ViewComponentState.composizioneMode) composizioneMode$: Observable<Composizione>;
    @Select(ViewComponentState.viewComponent) viewState$: Observable<ViewLayouts>;


  private subscription = new Subscription();

    richiesta: SintesiRichiesta;
    notFoundText = 'Nessun Filtro Trovato';
    viewState: ViewLayouts;
    codCompetenzeDefault: string[] = [];

    constructor(private store: Store,
                private dropdownConfig: NgbDropdownConfig) {
        dropdownConfig.placement = 'right';
        this.richiesta = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione);
        this.richiesta.competenze.forEach(x => this.codCompetenzeDefault.push(x.codice));
        this.store.dispatch(new SetFiltriDistaccamentoDefault(this.codCompetenzeDefault));
        this.getViewState();
    }

    ngOnDestroy(): void {
        this.store.dispatch(new ClearFiltriComposizione());
    }

    getViewState(): void {
      this.subscription.add(this.viewState$.subscribe(r => this.viewState = r));
    }

    addFiltro(event: any, tipo: string): void {
      this.store.dispatch(new StartListaComposizioneLoading());
      if (event) {
          if (event?.id || event?.descrizione) {
              this.store.dispatch(new AddFiltroSelezionatoComposizione(event.id || event.descrizione, tipo));
          } else {
              this.store.dispatch(new AddFiltroSelezionatoComposizione(event, tipo));
          }
          this.nuovaPartenza(this.richiesta);
          this.update();
      }
    }

    clearFiltri(tipo: string): void {
        this.store.dispatch(new ResetFiltriComposizione(tipo));
        if (tipo === 'codiceDistaccamento') {
          this.store.dispatch(new SetFiltriDistaccamentoDefault(this.codCompetenzeDefault));
          this.update();
        } else { this.update(); }
    }

    resetFiltri(): void {
      this.store.dispatch(new ClearFiltriComposizione());
      this.store.dispatch(new SetFiltriDistaccamentoDefault(this.codCompetenzeDefault));
      this.update();
    }

    update(): void {
        if (this.composizionePartenza) {
            this.store.dispatch(new ReducerFilterListeComposizione());
        } else if (this.sostituzionePartenza) {
            this.store.dispatch(new GetListaMezziSquadre());
        }
    }

    turnOffComposizione(): void {
        this.store.dispatch(new TurnOffComposizione());
    }

    compPartenzaSwitch(event: Composizione): void {
        this.store.dispatch(new SwitchComposizione(event));
    }

    _iconaStatiClass(statoMezzo: string): string {
        return iconaStatiClass(statoMezzo);
    }

    _confirmPrenota(): void {
        const value = !this.prenotato;
        this.confirmPrenota.emit(value);
    }

    nuovaPartenza(richiesta: SintesiRichiesta): void {
        if (this.store.selectSnapshot(SostituzionePartenzaModalState.idRichiestaSostituzione)) {
            const idRichiesta = this.store.selectSnapshot(SostituzionePartenzaModalState.idRichiestaSostituzione);
            this.store.dispatch([
                new SetMarkerRichiestaSelezionato(idRichiesta),
                new RichiestaComposizione(richiesta)
            ]);
        } else {
            this.store.dispatch([
                new SetMarkerRichiestaSelezionato(richiesta.id),
                new RichiestaComposizione(richiesta)
            ]);
        }

    }
}
