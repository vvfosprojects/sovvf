import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Partenza } from '../../model/partenza.model';
import { ListaSquadre } from '../../interface/lista-squadre';
import { MezzoActionInterface } from '../../interface/mezzo-action.interface';
import { StatoRichiesta } from '../../enum/stato-richiesta.enum';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { EventoMezzo } from '../../interface/evento-mezzo.interface';
import { iconaStatiClass, nomeStatiSquadra } from '../../helper/function-composizione';

@Component({
    selector: 'app-partenza',
    templateUrl: './partenza.component.html',
    styleUrls: ['./partenza.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class PartenzaComponent implements OnInit {

    @Input() idDaSganciare: string;
    @Input() partenza: Partenza;
    @Input() listaEventi: EventoMezzo[];
    @Input() inGestione: boolean;
    @Input() statoRichiesta: StatoRichiesta;
    @Input() index: string;

    @Output() listaSquadre = new EventEmitter<ListaSquadre>();
    @Output() actionMezzo: EventEmitter<MezzoActionInterface> = new EventEmitter();
    @Output() eliminaPartenza: EventEmitter<string> = new EventEmitter();
    @Output() modificaPartenza: EventEmitter<string> = new EventEmitter<string>();

    statoRichiestaEnum = StatoRichiesta;
    listaEventiMezzo: EventoMezzo[] = [];

    constructor(config: NgbDropdownConfig) {
        config.placement = 'bottom-left';
    }

    ngOnInit(): void {
        this.checkListaEventiMezzo();
    }

    checkListaEventiMezzo(): void {
        this.listaEventiMezzo = this.listaEventi?.filter((x: EventoMezzo) => x.codiceMezzo === this.partenza.mezzo.codice && (x.stato === 'In Viaggio' || x.stato === 'Sul Posto' || x.stato === 'In Rientro'));
        const statiMezzo = [];
        if (this.listaEventiMezzo?.length) {
            this.listaEventiMezzo.forEach(x => statiMezzo.push(x.stato));
            this.listaEventiMezzo = this.listaEventiMezzo.slice(statiMezzo.lastIndexOf('In Viaggio'));
        }
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

    _iconaStatiClass(statoMezzo: any): string {
        return iconaStatiClass(statoMezzo);
    }

    _nomeStatiSquadra(statoSquadra: number): string {
        return nomeStatiSquadra(statoSquadra);
    }
}
