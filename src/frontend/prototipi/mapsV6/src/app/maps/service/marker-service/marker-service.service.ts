import {Injectable} from '@angular/core';
import {Subscription} from 'rxjs';
import {MarkedService} from '../marked-service/marked-service.service';
import {Meteo} from '../../../shared/model/meteo.model';
import {MeteoService} from '../../../shared/meteo/meteo-service.service';
import {IconMappe} from './_icone';
import {TipoMappe} from './_typeof';
import {TipoColori} from './_color';
import {AgmService} from '../../agm/agm-service.service';
import {UnitaOperativaService} from '../../../navbar/navbar-service/unita-operativa-service/unita-operativa.service';
import {ListaRichiesteService} from '../../../richieste/lista-richieste-service/lista-richieste-service.service';
import {MapManagerService} from '../../../dispatcher/manager/maps-manager/map-manager-service.service';


@Injectable({
    providedIn: 'root'
})
export class MarkerService {

    datiMeteo: Meteo;
    icone = new IconMappe();
    tipo = new TipoMappe();
    colori = new TipoColori();
    coloreStato: string;

    markerColorato: boolean;
    markerSelezionato: any;
    markerZIndex: any;
    subscription: Subscription;

    filtro: Array<any>;


    constructor(private markedService: MarkedService,
                private meteoService: MeteoService,
                private agmService: AgmService,
                private richiesteService: ListaRichiesteService,
                private mapsManager: MapManagerService,
                private fakeCambioSede: UnitaOperativaService) {
        this.subscription = this.markedService.getMarked().subscribe(marker => {
            this.markerSelezionato = marker;
        });
        this.filtro = ['richiesta'];
    }

    tipoIcona(marker: any, tipoSede: boolean): string {
        /**
         * metodo che mi ritorna il tipo di icona da utilizzare
         */
        if (!tipoSede) {
            return this.icone.tipoIcona(marker, this.modelloMarker(marker), this.iconaSelezionata(marker));
        } else {
            return this.icone.tipoIcona(marker, 'tipo-sede', this.iconaSelezionata(marker));
        }
    }

    modelloMarker(marker): string {
        /**
         * metodo che mi ritorna il modello del marker come stringa
         */
        return this.tipo.markerType(marker);
    }

    trueMarker(marker?: any, cross?: boolean): boolean {
        /**
         * metodo che mi ritorna true, se il marker selezionato è lo stesso che è stato cliccato
         */
        if (cross) {
            return true;
        } else {
            return this.markerSelezionato === marker;
        }
    }

    iconaSelezionata(marker): boolean {
        if (this.markerSelezionato === marker) {
            return true;
        } else if (this.markerColorato === marker) {
            return true;
        }
    }

    zIndex(marker): number {
        if (this.markerZIndex === marker) {
            return 99999;
        }
    }

    cliccato(marker: any): void {
        /**
         *  imposto nel service marked lo stato del marker a selezionato
         */
        this.selezionato(marker);
        /**
         *  mi arrivano i dati del meteo
         */
        this.getDatiMeteo(marker);
        /**
         * richiamo i metodi per modficare il centro e lo zoom del marker cliccato
         */
        this.agmService.centraMappa(marker.getCoordinate());
        this.agmService.cambiaZoom(18);
    }

    selezionato(marker: any): void {
        /**
         *  imposto nel service marked lo stato del marker a selezionato
         */
        this.markedService.sendMarked(marker);
    }

    deseleziona(): void {
        /**
         * deseleziono il marker
         */
        this.markedService.clearMarked();
    }

    action(marker, mouse) {
        /**
         * controllo il tipo di marker e il suo mouse event
         */
        const modello = this.modelloMarker(marker);
        switch (modello + '|' + mouse) {
            case 'richiesta|hover-in': {
                this.markerColorato = marker;
                this.markerZIndex = marker;
                this.richiesteService.hoverIn(marker.id);
            }
                break;
            case 'richiesta|hover-out': {
                this.markerColorato = null;
                this.markerZIndex = null;
                this.richiesteService.hoverOut();
            }
                break;
            case 'richiesta|click': {
                this.cliccato(marker);
                this.coloreStato = this.colori.markerColor(marker.getStato());
                this.richiesteService.fissata(marker.id, true);
                this.richiesteService.deselezionata();
            }
                break;
            case 'mezzo|hover-in': {
                this.markerZIndex = marker;
                this.markerColorato = marker;
            }
                break;
            case 'mezzo|hover-out': {
                this.markerZIndex = null;
                this.markerColorato = null;
            }
                break;
            case 'mezzo|click': {
                this.cliccato(marker);
                if (marker.inSoccorso()) {
                    /**
                     * lanciare azione solo quando il mezzo è in soccorso
                     */
                    this.coloreStato = this.colori.markerColor(marker.getStato());
                }
            }
                break;
            case 'sede|click': {
                this.cliccato(marker);
            }
                break;
            case 'sede|hover-in': {
                this.markerZIndex = marker;
                this.markerColorato = marker;
            }
                break;
            case 'sede|hover-out': {
                this.markerZIndex = null;
                this.markerColorato = null;
            }
                break;
            default: {
                this.noAction();
                this.richiesteService.defissata();
            }
                break;
        }
    }


    visibile(marker: any, selected?: any): boolean {
        /**
         * metodo che nasconde o mostra i marker sulla mappa
         */
        if (selected) {
            return (this.modelloMarker(marker).includes(selected));
        }
        if (this.filtro && this.filtro.length > 0) {
            return this.filtro.includes(this.modelloMarker(marker));
        }
        return true;
    }

    getDatiMeteo(marker: any): void {
        /**
         *  faccio una chiamata all'api del servizio meteo e aspetto i dati del marker selezionato
         */
        this.meteoService.getMeteoData(marker.getCoordinate())
            .subscribe({
                next: data => this.datiMeteo = data,
                error: data => console.log(`Errore: ${data}`)
            });
    }

    filtroMarker(filtro) {
        /**
         * metodo che riceve il filtro selezionato dal menu
         */
        this.filtro = filtro;
    }

    cambioSede(sede) {
        /**
         * evento che cambia la sede
         */
        this.fakeCambioSede.sendUnitaOperativaAttuale(sede);
    }

    noAction() {
        if (this.markerSelezionato) {
            this.agmService.cambiaZoom(11);
            this.deseleziona();
        }
    }

    actionById(id, mouse) {
        let marker: any;
        marker = this.getMarkerFromId(id);
        switch (mouse) {
            case 'hover-in': {
                this.markerColorato = marker;
                this.markerZIndex = marker;
            }
                break;
            case 'hover-out': {
                this.markerColorato = null;
                this.markerZIndex = null;
            }
                break;
            case 'click': {
                this.cliccato(marker);
            }
                break;
        }
    }


    getMarkerFromId(id) {
        return this.mapsManager.getMarkerFromId(id);
    }
}
