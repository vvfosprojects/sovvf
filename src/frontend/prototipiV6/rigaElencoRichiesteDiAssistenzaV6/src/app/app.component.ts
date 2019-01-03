import { Component, OnDestroy } from '@angular/core';
import { ViewService } from './filterbar/view-service/view-service.service';
import { ViewInterface } from './filterbar/view-mode/view.interface';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

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
