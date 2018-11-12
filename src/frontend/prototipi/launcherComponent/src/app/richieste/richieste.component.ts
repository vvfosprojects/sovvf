import {Component, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';
import {ViewInterface} from '../filterbar/view-mode/view.interface';
import {FilterbarService} from '../filterbar/filterbar-service/filterbar-service.service';

@Component({
    selector: 'app-richieste',
    templateUrl: './richieste.component.html',
    styleUrls: ['./richieste.component.css']
})
export class RichiesteComponent implements OnDestroy {
    subscription = new Subscription();
    viewState: ViewInterface;

    constructor(private viewService: FilterbarService) {
        this.viewState = this.viewService.viewState;
        this.subscription.add(
            this.viewService.getView().subscribe((r: ViewInterface) => {
                this.viewState = r;
            })
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
