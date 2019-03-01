import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Model
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';

// Service
import { MarkerService } from '../../maps/service/marker-service/marker-service.service';

// Helper methods
import { HelperSintesiRichiesta } from '../helper/_helper-sintesi-richiesta';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { SetIdRichiestaEventi } from '../../eventi/store/actions/eventi-richiesta.actions';
import { Store } from '@ngxs/store';

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
    @Input() loaderRichieste = true;
    @Input() loaderNuoveRichieste: boolean;
    @Input() contatoreNuoveRichieste = 0;
    @Input() richiesteTerminate: boolean;
    @Input() itemSize = 95;
    @Input() listHeightClass: string;

    @Output() statoPartenza = new EventEmitter<boolean>();
    @Output() composizionePartenza = new EventEmitter<SintesiRichiesta>();
    @Output() nuoveRichieste = new EventEmitter();
    @Output() fissaInAlto = new EventEmitter<any>();
    @Output() hoverIn = new EventEmitter<string>();
    @Output() hoverOut = new EventEmitter<boolean>();
    @Output() selezione = new EventEmitter<string>();
    @Output() deselezione = new EventEmitter<boolean>();
    @Output() eventiRichiesta: EventEmitter<string> = new EventEmitter();

    methods = new HelperSintesiRichiesta;

    @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

    constructor(private markerS: MarkerService) {
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
            this.markerS.actionById(richiesta.id, 'click', false);
            this.selezione.emit(richiesta.codice);
        } else {
            this.markerS.actionById(richiesta.id, 'click', true);
            this.deselezione.emit(true);
        }
    }

    /* Gestisce il double click sulla richiesta */
    richiestaDoubleClick(richiesta: SintesiRichiesta) {
        if (richiesta !== this.richiestaSelezionata) {
            this.markerS.actionById(richiesta.id, 'click', false);
            this.selezione.emit(richiesta.codice);
            // TEST
            // console.log('Doppio click su', richiesta);
        } else {
            this.markerS.actionById(richiesta.id, 'click', true);
            this.deselezione.emit(true);
        }
    }

    /* Fissa in alto la richiesta */
    onFissaInAlto(richiesta: SintesiRichiesta) {
        if (richiesta) {
            this.markerS.actionById(richiesta.id, 'click');

            this.fissaInAlto.emit(richiesta.codice);
        }
    }

    /* Apre il componente per la creazione della partenza */
    nuovaPartenza(richiesta: any) {
        this.markerS.actionById(richiesta.id, 'click');
        this.composizionePartenza.emit(richiesta);
        this.statoPartenza.emit(true);
    }

    /* Gestisce l'hover in */
    richiestaHoverIn(richiesta: SintesiRichiesta) {
        if (richiesta) {
            this.markerS.actionById(richiesta.id, 'hover-in');

            this.hoverIn.emit(richiesta.codice);
        }
    }

    /* Gestisce l'hover out */
    richiestaHoverOut(richiesta: SintesiRichiesta) {
        if (richiesta) {
            this.markerS.actionById(richiesta.id, 'hover-out');

            this.hoverOut.emit(true);
        }
    }

    /* Apre il modal per visualizzare gli eventi relativi alla richiesta cliccata */
    visualizzaEventiRichiesta(idRichiesta: string) {
        this.eventiRichiesta.emit(idRichiesta);
        /* this.store.dispatch(new SetIdRichiestaEventi(idRichiesta));
        this.modalService.open(EventiRichiestaComponent, { size: 'lg', centered: true }); */
    }

    /* Ritorna true se le parole matchano almeno in parte */
    match(word1: string, word2: string) {
        const word1San = word1.toLowerCase().substr(0, word1.length - 1);
        const word2San = word2.toLowerCase().substr(0, word2.length - 1);
        if (word1San === word2San) {
            return true;
        }
        return false;
    }

    /* NgClass List Height */
    HeightControl() {
        return this.listHeightClass;
    }

    /* NgClass Card Status */
    CardClasses(r: any) {
        return this.methods.CardClasses(r, this.richiestaSelezionata, this.richiestaHover);
    }
}
