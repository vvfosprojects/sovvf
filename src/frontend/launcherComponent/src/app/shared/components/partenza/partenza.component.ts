import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DettaglioPartenza, Partenza } from '../../model/partenza.model';
import { ListaSquadre } from '../../interface/lista-squadre';
import { MezzoActionInterface } from '../../interface/mezzo-action.interface';
import { StatoRichiesta } from '../../enum/stato-richiesta.enum';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { EventoMezzo } from '../../interface/evento-mezzo.interface';
import { iconaStatiClass, nomeStatiSquadra } from '../../helper/function-composizione';
import { Store } from '@ngxs/store';
import { RemoveAnnullaStatoMezzi } from '../../store/actions/loading/loading.actions';
import { SintesiRichiesteService } from '../../../core/service/lista-richieste-service/lista-richieste.service';
import { Mezzo } from '../../model/mezzo.model';
import { TipoConcorrenzaEnum } from '../../enum/tipo-concorrenza.enum';
import { LockedConcorrenzaService } from '../../../core/service/concorrenza-service/locked-concorrenza.service';
import { StartLoadingActionMezzo, StopLoadingActionMezzo } from '../../../features/home/store/actions/richieste/richieste.actions';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { StatoMezzo } from '../../enum/stato-mezzo.enum';

@Component({
    selector: 'app-partenza',
    templateUrl: './partenza.component.html',
    styleUrls: ['./partenza.component.css']
})

export class PartenzaComponent implements OnInit {

    @Input() richiesta: SintesiRichiesta;
    @Input() idDaSganciare: string;
    @Input() partenza: DettaglioPartenza;
    @Input() codicePartenza: string;
    @Input() infoPartenza: Partenza;
    @Input() inGestione: boolean;
    @Input() index: string;
    @Input() annullaStatoMezzo: boolean;
    @Input() disabledModificaStatoMezzo: boolean;
    @Input() hideGestisciPartenza: boolean;

    @Output() listaSquadre: EventEmitter<{ codiceMezzo: string, listaSquadre: ListaSquadre }> = new EventEmitter<{ codiceMezzo: string, listaSquadre: ListaSquadre }>();
    @Output() actionMezzo: EventEmitter<MezzoActionInterface> = new EventEmitter<MezzoActionInterface>();
    @Output() modificaPartenza: EventEmitter<string> = new EventEmitter<string>();
    @Output() selezioneMezzo: EventEmitter<Mezzo> = new EventEmitter<Mezzo>();

    statoRichiestaEnum = StatoRichiesta;
    tipoConcorrenzaEnum = TipoConcorrenzaEnum;

    listaEventiMezzo: EventoMezzo[] = [];

    constructor(private config: NgbDropdownConfig,
                private store: Store,
                private richiesteService: SintesiRichiesteService,
                private lockedConcorrenzaService: LockedConcorrenzaService) {
        config.placement = 'bottom-left';
    }

    ngOnInit(): void {
        this.checkListaEventiMezzo();
    }

    getUltimoStatoMezzo(codMezzo: string): StatoMezzo {
        const eventoCodMezzo = this.richiesta.eventi.filter((evento: EventoMezzo) => evento.codiceMezzo === codMezzo);
        if (eventoCodMezzo) {
            const eventoUltimoStatoMezzo = eventoCodMezzo[eventoCodMezzo?.length - 1];
            return eventoUltimoStatoMezzo.stato;
        }
    }

    onAnnullaStato(codiceMezzo: string, statoMezzo: StatoMezzo): void {
        const obj = {
            codiceRichiesta: this.infoPartenza ? this.infoPartenza.codiceRichiesta : null,
            codicePartenza: this.infoPartenza ? this.infoPartenza.codicePartenza : null,
            targaMezzo: this.infoPartenza.codiceMezzo ? this.infoPartenza.codiceMezzo : null,
        };
        this.store.dispatch(new StartLoadingActionMezzo(codiceMezzo));
        this.richiesteService.eliminaPartenzaRichiesta(obj).subscribe(() => {
            this.store.dispatch([
                new RemoveAnnullaStatoMezzi([codiceMezzo], statoMezzo),
                new StopLoadingActionMezzo(codiceMezzo)
            ]);
        }, () => {
            console.error('Richiesta di annullamento cambio stato fallita');
            this.store.dispatch(new StopLoadingActionMezzo(codiceMezzo));
        });
    }

    checkListaEventiMezzo(): void {
        this.listaEventiMezzo = this.richiesta?.eventi?.filter((x: EventoMezzo) => x.codiceMezzo === this.partenza.mezzo.codice && (x.stato === 'In Viaggio' || x.stato === 'Sul Posto' || x.stato === 'In Rientro'));
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
        this.listaSquadre.emit({ codiceMezzo: this.partenza.mezzo.codice, listaSquadre });
    }

    onActionMezzo(mezzoAction: MezzoActionInterface): void {
        this.actionMezzo.emit(mezzoAction);
    }

    onModificaPartenza(): void {
        if (!this.lockedConcorrenzaService.getLockedConcorrenza(TipoConcorrenzaEnum.GestisciPartenza, [this.partenza.mezzo.codice])) {
            this.modificaPartenza.emit(this.index);
        }
    }

    _iconaStatiClass(statoMezzo: any): string {
        return iconaStatiClass(statoMezzo);
    }

    _nomeStatiSquadra(statoSquadra: number): string {
        return nomeStatiSquadra(statoSquadra);
    }
}
