import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BoxInterventi } from '../../boxes-model/box-interventi.model';
import { BoxClickService } from '../box-service/box-click.service';
import { BoxClickInterface } from '../box-service/box-click-interface';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-box-interventi',
    templateUrl: './box-interventi.component.html',
    styleUrls: ['./box-interventi.component.css']
})
export class BoxInterventiComponent implements OnInit, OnDestroy {
    @Input() interventi: BoxInterventi;

    boxClick: BoxClickInterface;

    subscription = new Subscription();

    constructor(private boxClickService: BoxClickService) {
        this.boxClick = this.boxClickService.boxClickState;
        this.subscription.add(this.boxClickService.getBoxClick().subscribe((boxClick: BoxClickInterface) => {
                this.boxClick = boxClick;
            }
        ));
    }

    ngOnInit() {
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
