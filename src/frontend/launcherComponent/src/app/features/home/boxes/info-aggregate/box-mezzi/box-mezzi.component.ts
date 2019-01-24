import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BoxMezzi } from '../../boxes-model/box-mezzi.model';
import { BoxClickService } from '../box-service/box-click.service';
import { BoxClickInterface } from '../box-service/box-click-interface';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-box-mezzi',
    templateUrl: './box-mezzi.component.html',
    styleUrls: ['./box-mezzi.component.css']
})
export class BoxMezziComponent implements OnInit, OnDestroy {
    @Input() mezzi: BoxMezzi;

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

    clickMezzi(tipo: string) {
        if (tipo !== 'tutti') {
            this.boxClick.mezzi[tipo] = !this.boxClick.mezzi[tipo];
        } else {
            const keysBoxClick = Object.keys(this.boxClick.mezzi);
            keysBoxClick.forEach( r => {
                this.boxClick.mezzi[r] = false;
            });
        }
        this.boxClickService.sendBoxClick(this.boxClick);
    }

}
