import { Component, OnInit } from '@angular/core';
import { ViewInterface } from './view-mode/view.interface';
import { Subscription } from 'rxjs';
import { FilterbarService } from './filterbar-service/filterbar-service.service';
import { PartenzaService } from '../composizione-partenza/service/partenza/partenza.service';

@Component({
    selector: 'app-filterbar',
    templateUrl: './filterbar.component.html',
    styleUrls: ['./filterbar.component.css']
})
export class FilterbarComponent implements OnInit {
    subscription = new Subscription();
    viewState: ViewInterface;
    disableViewButtons = false;
    disableSearchBar = false;
    disableFiltri = false;
    col = 'col-5';

    constructor(private viewService: FilterbarService,
        private partenzaS: PartenzaService) {
        this.viewState = this.viewService.viewState;
        this.subscription.add(
            this.viewService.getView().subscribe((r: ViewInterface) => {
                this.viewState = r;
                this.disableViewButtons = r.comp_partenza ? true : false;
                this.disableSearchBar = r.comp_partenza ? true : false;
                this.disableFiltri = r.comp_partenza ? true : false;
                this.col = r.comp_partenza ? 'col-6' : 'col-5';
            })
        );
    }

    ngOnInit() {
    }

    cambioModalita(newMode: string) {
        this.partenzaS.changeCompPartenzaMode(newMode);
    }
}
