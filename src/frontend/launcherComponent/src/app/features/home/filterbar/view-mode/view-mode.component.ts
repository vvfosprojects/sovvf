import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AppFeatures } from '../../../../shared/enum/app-features.enum';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-view-mode',
    templateUrl: './view-mode.component.html',
    styleUrls: ['./view-mode.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewModeComponent {

    @Input() colorButtonView = ['btn-outline-secondary', 'btn-secondary', 'btn-outline-secondary'];
    @Input() mapStatus: boolean;
    @Input() nightMode: boolean;

    @Output() buttonView = new EventEmitter<AppFeatures>();

    AppFeature = AppFeatures;

    constructor(config: NgbTooltipConfig) {
        config.container = 'body';
        config.placement = 'left';
    }

    buttonViewMode($event): void {
        this.buttonView.emit($event);
    }

}
