import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { VoceFiltro } from '../filtri-richieste/voce-filtro.model';
import { CategoriaFiltriSchedeContatto as Categoria } from 'src/app/shared/enum/categoria-filtri-schede-contatto';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import {Select} from '@ngxs/store';
import {ImpostazioniState} from '../../../../shared/store/states/impostazioni/impostazioni.state';
import {Observable, Subscription} from 'rxjs';

@Component({
    selector: 'app-filtri-schede-contatto',
    templateUrl: './filtri-schede-contatto.component.html',
    styleUrls: ['./filtri-schede-contatto.component.css']
})
export class FiltriSchedeContattoComponent {

    @HostBinding('class') classes = 'input-group-append';

    @Input() filtri: VoceFiltro[];
    @Input() filtriSelezionati: VoceFiltro[];
    @Input() disableFilters: boolean;

    @Output() filtroSelezionato: EventEmitter<VoceFiltro> = new EventEmitter();
    @Output() filtriReset: EventEmitter<any> = new EventEmitter();

    @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;
    nightMode: boolean;

    Categoria = Categoria;

    subscription = new Subscription();


    constructor(private dropdownConfig: NgbDropdownConfig) {
        dropdownConfig.placement = 'bottom-right';
        this.getNightMode();
    }

    onSelezioneFiltro(filtro: VoceFiltro): void {
        console.log('filtriSelezionati', this.filtriSelezionati);
        this.filtriSelezionati.forEach((f: VoceFiltro) => {
            if (f !== filtro && f.categoria === filtro.categoria) {
                this.filtroSelezionato.emit(f);
            }
        });
        this.filtroSelezionato.emit(filtro);
    }

    getNightMode(): void {
      this.subscription.add(
        this.nightMode$.subscribe((nightMode: boolean) => {
          this.nightMode = nightMode;
        })
      );
    }

    eliminaFiltriAttivi(): void {
        this.filtriReset.emit();
    }


    _isSelezionato(filtro: VoceFiltro): boolean {
        return this.filtriSelezionati.filter((f: VoceFiltro) => f.codice === filtro.codice).length > 0;
    }

}
