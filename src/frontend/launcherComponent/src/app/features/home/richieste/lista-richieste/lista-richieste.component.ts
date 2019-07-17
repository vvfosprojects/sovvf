import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

// Model
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';

// Helper methods
import { HelperSintesiRichiesta } from '../helper/_helper-sintesi-richiesta';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MezzoActionInterface } from '../../../../shared/interface/mezzo-action.interface';

export const scrolledItems = 11;

@Component({
    selector: 'app-lista-richieste',
    templateUrl: './lista-richieste.component.html',
    styleUrls: ['./lista-richieste.component.css']
})
export class ListaRichiesteComponent implements OnInit {
    @Input() ricerca: any;
    @Input() _split: boolean;
    @Input() richieste: SintesiRichiesta[] = [];
    @Input() richiestaHover: SintesiRichiesta;
    @Input() richiestaSelezionata: SintesiRichiesta;
    @Input() richiestaFissata: SintesiRichiesta;
    @Input() richiestaGestione: SintesiRichiesta;
    @Input() loaderRichieste = true;
    @Input() loaderNuoveRichieste: boolean;
    @Input() contatoreNuoveRichieste;
    @Input() richiesteTerminate: boolean;
    @Input() itemSize = 10;
    @Input() listHeightClass: string;
    @Input() idRichiesteEspanse: string[] = [];

    @Output() statoPartenza = new EventEmitter<boolean>();
    @Output() composizionePartenza = new EventEmitter<SintesiRichiesta>();
    @Output() nuoveRichieste = new EventEmitter();
    @Output() fissaInAlto = new EventEmitter<string>();
    @Output() hoverIn = new EventEmitter<string>();
    @Output() hoverOut = new EventEmitter<boolean>();
    @Output() selezione = new EventEmitter<string>();
    @Output() deselezione = new EventEmitter<boolean>();
    @Output() eventiRichiesta = new EventEmitter<string>();
    @Output() modificaRichiesta = new EventEmitter<SintesiRichiesta>();
    @Output() gestioneRichiesta = new EventEmitter<SintesiRichiesta>();
    @Output() actionMezzo = new EventEmitter<MezzoActionInterface>();
    @Output() outEspansoId = new EventEmitter<string>();

    methods = new HelperSintesiRichiesta;

    @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

    constructor() {
    }

    ngOnInit() {
        this.viewport.scrolledIndexChange.subscribe(() => {
            const bottomOffset = this.viewport.measureScrollOffset('bottom');
            if (bottomOffset < 100 && this.viewport.getDataLength() >= scrolledItems) {
                this.onNuoveRichieste();
            }
        });
    }

    /* Permette di caricare nuove richieste */
    onNuoveRichieste() {
        this.nuoveRichieste.emit();
    }

    /* Gestisce il singolo click sulla richiesta */
    richiestaClick(richiesta: SintesiRichiesta) {
        if (richiesta !== this.richiestaSelezionata) {
            this.selezione.emit(richiesta.id);
        } else {
            this.deselezione.emit(true);
        }
    }

    /* Gestisce il double click sulla richiesta */
    richiestaDoubleClick(richiesta: SintesiRichiesta) {
        if (richiesta !== this.richiestaSelezionata) {
            this.selezione.emit(richiesta.id);
        } else {
            this.deselezione.emit(true);
        }
    }

    /* Fissa in alto la richiesta */
    onFissaInAlto(richiesta: SintesiRichiesta) {
        if (richiesta) {
            this.fissaInAlto.emit(richiesta.id);
        }
    }

    /* Apre il componente per la creazione della partenza */
    nuovaPartenza(richiesta: any) {
        this.composizionePartenza.emit(richiesta);
        this.statoPartenza.emit(true);
    }

    /* Gestisce l'hover in */
    richiestaHoverIn(id: string) {
        if (id) {
            this.hoverIn.emit(id);
        }
    }

    /* Gestisce l'hover out */
    richiestaHoverOut(id: string) {
        if (id) {
            this.hoverOut.emit(true);
        }
    }

    /* Apre il modal per visualizzare gli eventi relativi alla richiesta cliccata */
    visualizzaEventiRichiesta(idRichiesta: string) {
        this.eventiRichiesta.emit(idRichiesta);
    }

    onModificaRichiesta(richiesta: SintesiRichiesta) {
        this.modificaRichiesta.emit(richiesta);
    }

    onGestioneRichiesta(richiesta: SintesiRichiesta) {
        this.gestioneRichiesta.emit(richiesta);
    }

    /* NgClass List Height */
    heightControl() {
        if (this.richieste.length > 0) {
            return this.listHeightClass;
        } else {
            return 'd-none';
        }
    }

    /* NgClass Card Status */
    cardClasses(r: SintesiRichiesta) {
        const richiestaSelezionataId = this.richiestaSelezionata ? this.richiestaSelezionata.id : null;
        const richiestaHoverId = this.richiestaHover ? this.richiestaHover.id : null;
        return this.methods.cardClasses(r, richiestaSelezionataId, richiestaHoverId);
    }

    isEspanso(id: string) {
        if (this.idRichiesteEspanse && id) {
            return this.idRichiesteEspanse.includes(id);
        }
    }

}
