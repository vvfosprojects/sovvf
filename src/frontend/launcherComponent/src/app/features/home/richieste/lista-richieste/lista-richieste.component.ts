import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { HelperSintesiRichiesta } from '../helper/_helper-sintesi-richiesta';
import { MezzoActionInterface } from '../../../../shared/interface/mezzo-action.interface';
import { StatoRichiesta } from '../../../../shared/enum/stato-richiesta.enum';
import { PermissionFeatures } from '../../../../shared/enum/permission-features.enum';

@Component({
    selector: 'app-lista-richieste',
    templateUrl: './lista-richieste.component.html',
    styleUrls: ['./lista-richieste.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaRichiesteComponent implements OnChanges {

    @Input() ricerca: any;
    @Input() richieste: SintesiRichiesta[] = [];
    @Input() richiestaHover: SintesiRichiesta;
    @Input() idRichiestaSelezionata: string;
    @Input() richiestaFissata: SintesiRichiesta;
    @Input() richiestaGestione: SintesiRichiesta;
    @Input() listHeightClass: string;

    // Loading
    @Input() loading: boolean;
    @Input() needRefresh: boolean;
    @Input() loadingActionRichiesta: string[] = [];
    @Input() loadingEliminaPartenza: boolean;

    // Paginazione
    @Input() page: number;
    @Input() pageSize: number;
    @Input() totalItems: number;

    // FIltri Selezionati
    @Input() codiciFiltriSelezionati: string[];

    // Night Mode
    @Input() nightMode: boolean;

    @Output() statoPartenza = new EventEmitter<boolean>();
    @Output() composizionePartenza = new EventEmitter<SintesiRichiesta>();
    @Output() pageChange = new EventEmitter<number>();
    @Output() refresh = new EventEmitter<boolean>();
    @Output() fissaInAlto = new EventEmitter<SintesiRichiesta>();
    @Output() hoverIn = new EventEmitter<string>();
    @Output() hoverOut = new EventEmitter<boolean>();
    @Output() selezione = new EventEmitter<string>();
    @Output() deselezione = new EventEmitter<boolean>();
    @Output() modificaRichiesta = new EventEmitter<SintesiRichiesta>();
    @Output() gestioneRichiesta = new EventEmitter<SintesiRichiesta>();
    @Output() actionMezzo = new EventEmitter<MezzoActionInterface>();
    @Output() eliminaPartenza = new EventEmitter<{ targaMezzo: string, idRichiesta: string, modalResult: any }>();

    // Permessi
    permessiFeature = PermissionFeatures;

    methods = new HelperSintesiRichiesta();
    scrolling = false;
    statoRichiesta = StatoRichiesta;

    actionRichiestaArray: any[] = [];

    constructor() {
    }

    ngOnChanges(): void {
        if (this.loadingActionRichiesta && !this.actionRichiestaArray.includes(this.loadingActionRichiesta)) {
            this.actionRichiestaArray.push(this.loadingActionRichiesta);
        } else if (!this.loadingActionRichiesta) {
            this.actionRichiestaArray.shift();
        }
    }

    /* Gestisce il singolo click sulla richiesta */
    richiestaClick(richiesta: SintesiRichiesta): void {
        if (richiesta?.id !== this.idRichiestaSelezionata) {
            this.selezione.emit(richiesta.id);
        } else {
            this.deselezione.emit(true);
        }
    }

    /* Gestisce il singolo click sulla richiesta */
    onDeselezionaRichiesta(value: boolean): void {
        this.deselezione.emit(value);
    }

    /* Gestisce il double click sulla richiesta */
    richiestaDoubleClick(richiesta: SintesiRichiesta): void {
        if (richiesta?.id !== this.idRichiestaSelezionata) {
            this.selezione.emit(richiesta.id);
        } else {
            this.deselezione.emit(true);
        }
    }

    /* Fissa in alto la richiesta */
    onFissaInAlto(richiesta: SintesiRichiesta): void {
        if (richiesta) {
            this.fissaInAlto.emit(richiesta);
        }
    }

    /* Apre il componente per la creazione della partenza */
    nuovaPartenza(richiesta: any): void {
        this.composizionePartenza.emit(richiesta);
        this.statoPartenza.emit(true);
    }

    /* Gestisce l'hover in */
    richiestaHoverIn(id: string): void {
        if (id) {
            this.hoverIn.emit(id);
        }
    }

    /* Gestisce l'hover out */
    richiestaHoverOut(id: string): void {
        if (id) {
            this.hoverOut.emit(true);
        }
    }

    onModificaRichiesta(richiesta: SintesiRichiesta): void {
        this.modificaRichiesta.emit(richiesta);
    }

    onGestioneRichiesta(richiesta: SintesiRichiesta): void {
        this.gestioneRichiesta.emit(richiesta);
    }

    heightControl(): string {
        return this.listHeightClass;
    }

    cardClasses(r: SintesiRichiesta): any {
        const richiestaSelezionataId = this.idRichiestaSelezionata ? this.idRichiestaSelezionata : null;
        const richiestaHoverId = this.richiestaHover ? this.richiestaHover.id : null;
        return this.methods.cardClasses(r, richiestaSelezionataId, richiestaHoverId);
    }
}
