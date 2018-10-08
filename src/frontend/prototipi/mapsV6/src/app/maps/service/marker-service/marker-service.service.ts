import {Injectable} from '@angular/core';
import {Subscription} from 'rxjs';
import {MarkedService} from '../marked-service/marked-service.service';
import {Meteo} from '../../../shared/model/meteo.model';
import {MeteoService} from '../../../shared/meteo/meteo-service.service';
import {IconMappe} from './_icone';
import {TipoMappe} from './_typeof';
import {EventiService} from '../../../shared/eventi/eventi.service';

@Injectable({
    providedIn: 'root'
})
export class MarkerService {

    datiMeteo: Meteo;
    icone = new IconMappe();
    tipo = new TipoMappe();

    markerSelezionato: any;
    subscription: Subscription;

    filtro: Array<any>;


    constructor(private markedService: MarkedService,
                private meteoService: MeteoService,
                private eventi: EventiService) {
        this.subscription = this.markedService.getMarked().subscribe(marker => {
            this.markerSelezionato = marker;
        });
    }

    tipoIcona(marker: any): string {
        /**
         * metodo che mi ritorna il tipo di icona da utilizzare
         */
        return this.icone.tipoIcona(marker, this.modelloMarker(marker), this.markerSelezionato);
    }

    modelloMarker(marker): string {
        /**
         * metodo che mi ritorna il modello del marker come stringa
         */
        return this.tipo.markerType(marker);
    }

    trueMarker(marker: any): boolean {
        /**
         * metodo che mi ritorna true, se il marker selezionato è lo stesso che è stato cliccato
         */
        return this.markerSelezionato === marker;
    }

    selezionato(marker: any): void {
        /**
         *  imposto nel service marked lo stato del marker a selezionato
         */
        this.markedService.sendMarked(marker);
        /**
         *  mi arrivano i dati del meteo
         */
        this.getDatiMeteo(marker);
        /**
         * richiamo il metodo action che determina cosa eseguire
         */
        this.action(marker, 'click');
    }

    deseleziona(): void {
        /**
         * deseleziono il marker
         */
        this.eventi.marker.unClick();
        this.markedService.clearMarked();
    }

    hover(marker: any, mouse) {
        /**
         * controllo il tipo di mouse hover ricevuto
         */
        if (mouse === 'in') {
            this.action(marker, 'hover-in');
        } else if (mouse === 'out') {
            this.action(marker, 'hover-out');
        }
    }

    action(marker, mouse) {
        /**
         * controllo il tipo di marker e il suo mouse event
         */
        const modello = this.modelloMarker(marker);
        switch (modello + '|' + mouse) {
            case 'richiesta|hover-in': {
                this.eventi.marker.richiestaHoverIn(marker);
            }
                break;
            case 'richiesta|hover-out': {
                this.eventi.marker.richiestaHoverOut(marker);
            }
                break;
            case 'richiesta|click': {
                this.eventi.marker.richiestaClick(marker);
            }
                break;
            case 'mezzo|click': {
                if (marker.inSoccorso()) {
                    this.eventi.marker.mezzoClick(marker);
                }
            }
                break;
            case 'sede|click': {
                this.eventi.marker.sedeClick(marker);
            }
                break;
            default: {
                // this.eventi.marker.test();
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

    cambioSede() {
        /**
         * evento che cambia la sede
         */
        this.eventi.marker.cambioSede(this.markerSelezionato);
    }
}
