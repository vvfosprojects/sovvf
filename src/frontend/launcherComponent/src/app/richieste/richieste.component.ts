import {Component, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';

// Interface
import {ViewInterface} from '../filterbar/view-mode/view.interface';

// Service
import {ViewService} from '../filterbar/view-service/view-service.service';

@Component({
    selector: 'app-richieste',
    templateUrl: './richieste.component.html',
    styleUrls: ['./richieste.component.css']
})
export class RichiesteComponent implements OnDestroy {
    subscription = new Subscription();
    viewState: ViewInterface;

    constructor(private viewService: ViewService) {
        this.viewState = viewService.viewState;
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
