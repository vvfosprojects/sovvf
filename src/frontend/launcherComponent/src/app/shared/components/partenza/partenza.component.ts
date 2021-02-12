import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Partenza } from '../../model/partenza.model';
import { ListaSquadre } from '../../interface/lista-squadre';
import { MezzoActionInterface } from '../../interface/mezzo-action.interface';
import { StatoRichiesta } from '../../enum/stato-richiesta.enum';


export interface ListaEventiMezzo {
  codiceMezzo: string;
  note: string;
  ora: string;
  stato: any;
}

@Component({
    selector: 'app-partenza',
    templateUrl: './partenza.component.html',
    styleUrls: ['./partenza.component.css']
})

export class PartenzaComponent implements OnInit {

    @Input() idDaSganciare: string;
    @Input() partenza: Partenza;
    @Input() listaEventi: any;
    @Input() inGestione: boolean;
    @Input() statoRichiesta: StatoRichiesta;
    @Input() index: string;

    @Output() listaSquadre = new EventEmitter<ListaSquadre>();
    @Output() actionMezzo: EventEmitter<MezzoActionInterface> = new EventEmitter();
    @Output() eliminaPartenza: EventEmitter<string> = new EventEmitter();
    @Output() modificaPartenza: EventEmitter<string> = new EventEmitter<string>();

    statoRichiestaEnum = StatoRichiesta;
    listaEventiMezzo: ListaEventiMezzo[] = [];

    ngOnInit(): void {
      this.listaEventi.forEach(x => x.codiceMezzo === this.partenza.mezzo.codice && (x.stato === 'In Uscita' || x.stato === 'Sul Posto' || x.stato === 'In Rientro') ? this.listaEventiMezzo.push(x) : null);
    }

    onListaSquadrePartenza(): void {
        const listaSquadre = {} as ListaSquadre;
        listaSquadre.idPartenza = this.partenza.id;
        listaSquadre.squadre = this.partenza.squadre;
        this.listaSquadre.emit(listaSquadre);
    }

    onActionMezzo(mezzoAction: MezzoActionInterface): void {
        this.actionMezzo.emit(mezzoAction);
    }
}
