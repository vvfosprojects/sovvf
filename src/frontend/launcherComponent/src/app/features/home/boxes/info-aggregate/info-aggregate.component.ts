import { Component, OnDestroy, OnInit } from '@angular/core';
import {BoxManagerService} from '../../../../core/manager/boxes-manager/box-manager-service.service';
import {BoxInterventi} from '../boxes-model/box-interventi.model';
import {BoxMezzi} from '../boxes-model/box-mezzi.model';
import {BoxPersonale} from '../boxes-model/box-personale.model';
import { BoxClickService } from './box-service/box-click.service';
import { BoxClickInterface } from './box-service/box-click-interface';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-info-aggregate',
    templateUrl: './info-aggregate.component.html',
    styleUrls: ['./info-aggregate.component.css']
})
export class InfoAggregateComponent implements OnInit, OnDestroy {
    interventi: BoxInterventi;
    mezzi: BoxMezzi;
    personale: BoxPersonale;

    boxClick: BoxClickInterface;
    subscription = new Subscription();

    constructor(private boxManager: BoxManagerService,
                private boxClickService: BoxClickService) {
        this.boxClick = this.boxClickService.boxClickState;
        this.subscription.add(this.boxClickService.getBoxClick().subscribe((boxClick: BoxClickInterface) => {
                this.boxClick = boxClick;
            }
        ));
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
            keysBoxClick.forEach( r => {
                this.boxClick.richieste[r] = false;
            });
        }
        this.boxClickService.sendBoxClick(this.boxClick);
    }
}
