import { Component, OnDestroy, OnInit } from '@angular/core';
import { BoxManagerService } from '../../../../core/manager/boxes-manager/box-manager-service.service';
import { BoxInterventi } from '../boxes-model/box-interventi.model';
import { BoxMezzi } from '../boxes-model/box-mezzi.model';
import { BoxPersonale } from '../boxes-model/box-personale.model';
import { BoxClickService } from './box-service/box-click.service';
import { BoxClickInterface } from './box-service/box-click-interface';
import { Subscription } from 'rxjs';
import { ModalServiziComponent } from './modal-servizi/modal-servizi.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MeteoService } from '../../../../shared/meteo/meteo-service.service';
import { Meteo } from '../../../../shared/model/meteo.model';
import { Coordinate } from '../../../../shared/model/coordinate.model';

@Component({
    selector: 'app-info-aggregate',
    templateUrl: './info-aggregate.component.html',
    styleUrls: ['./info-aggregate.component.css']
})
export class InfoAggregateComponent implements OnInit, OnDestroy {
    interventi: BoxInterventi;
    mezzi: BoxMezzi;
    personale: BoxPersonale;
    datimeteo: Meteo;

    boxClick: BoxClickInterface;
    subscription = new Subscription();

    constructor(private boxManager: BoxManagerService,
                private boxClickService: BoxClickService,
                private modalService: NgbModal,
                private meteoService: MeteoService) {
        this.boxClick = this.boxClickService.boxClickState;
        this.subscription.add(this.boxClickService.getBoxClick().subscribe((boxClick: BoxClickInterface) => {
                this.boxClick = boxClick;
            }
        ));
        this.startMeteo();
    }

    ngOnInit() {
        this.boxManager.getBoxInterventi().subscribe((r: BoxInterventi) => {
            this.interventi = r;
        });
        this.boxManager.getBoxMezzi().subscribe((r: BoxMezzi) => {
            this.mezzi = r;
        });
        this.boxManager.getBoxPersonale().subscribe((r: BoxPersonale) => {
            this.personale = r;
        });
    }


    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    clickRichieste(tipo: string) {
        if (tipo !== 'tutti') {
            this.boxClick.richieste[tipo] = !this.boxClick.richieste[tipo];
        } else {
            const keysBoxClick = Object.keys(this.boxClick.richieste);
            keysBoxClick.forEach(r => {
                this.boxClick.richieste[r] = false;
            });
        }
        this.boxClickService.sendBoxClick(this.boxClick);
    }

    clickMezzi(tipo: string) {
        if (tipo !== 'tutti') {
            this.boxClick.mezzi[tipo] = !this.boxClick.mezzi[tipo];
        } else {
            const keysBoxClick = Object.keys(this.boxClick.mezzi);
            keysBoxClick.forEach(r => {
                this.boxClick.mezzi[r] = false;
            });
        }
        this.boxClickService.sendBoxClick(this.boxClick);
    }

    clickServizi(tipo: string) {
        if (tipo === 'openModal') {
            this.modalService.open(ModalServiziComponent, { size: 'lg', centered: true });
        }
    }

    startMeteo() {
        /**
         * Dati coordinate fake in attesa di quelle passate dal servizio località utente
         */
        const coordinate = new Coordinate(41.899940, 12.491270);
        this.getMeteoData(coordinate);
        setInterval(() => {
            this.datimeteo = undefined;
            this.getMeteoData(coordinate);
        }, 300000);
    }

    getMeteoData(coords: Coordinate) {
        setTimeout(() => {
            this.meteoService.getMeteoData(coords)
                .subscribe(data => {
                    this.datimeteo = data;
                });
        }, 100);
    }
}
