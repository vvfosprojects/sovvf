import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppFeatures } from '../../../../shared/enum/app-features.enum';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import {Select} from '@ngxs/store';
import {ViewportState} from '../../../../shared/store/states/viewport/viewport.state';
import {Observable, Subscription} from 'rxjs';

@Component({
    selector: 'app-view-mode',
    templateUrl: './view-mode.component.html',
    styleUrls: ['./view-mode.component.css']
})
export class ViewModeComponent {

    @Input() colorButtonView = ['btn-outline-secondary', 'btn-secondary', 'btn-outline-secondary'];
    @Input() stateSwitch: boolean;
    @Input() mapStatus: boolean;

    @Output() buttonView = new EventEmitter<AppFeatures>();
    @Output() toggleMeteo: EventEmitter<boolean> = new EventEmitter();

    @Select(ViewportState.sunMode) sunMode$: Observable<boolean>;
    sunMode: boolean;

    AppFeature = AppFeatures;
    public filtriNonImplementati = true;

    private subscription = new Subscription();

    constructor(config: NgbTooltipConfig) {
        config.container = 'body';
        config.placement = 'left';
        this.getSunMode();
    }

    buttonViewMode($event): void {
        this.buttonView.emit($event);
    }

    onChange(): void {
        this.toggleMeteo.emit(!this.stateSwitch);
    }

    getSunMode(): void {
      this.subscription.add(
        this.sunMode$.subscribe((sunMode: boolean) => {
          this.sunMode = sunMode;
        })
      );
    }

}
