import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppFeatures } from '../../../../shared/enum/app-features.enum';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

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

    AppFeature = AppFeatures;
    public filtriNonImplementati = true;

    constructor(config: NgbTooltipConfig) {
        config.container = 'body';
        config.placement = 'left';
    }

    buttonViewMode($event): void {
        this.buttonView.emit($event);
    }

    onChange(): void {
        this.toggleMeteo.emit(!this.stateSwitch);
    }


}
