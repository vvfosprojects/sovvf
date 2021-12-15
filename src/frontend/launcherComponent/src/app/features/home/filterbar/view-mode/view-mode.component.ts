import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AppFeatures } from '../../../../shared/enum/app-features.enum';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { ViewLayouts } from '../../../../shared/interface/view.interface';

@Component({
    selector: 'app-view-mode',
    templateUrl: './view-mode.component.html',
    styleUrls: ['./view-mode.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewModeComponent implements OnChanges {

    @Input() colorButtonView = ['btn-outline-secondary', 'btn-secondary', 'btn-outline-secondary'];
    @Input() mapStatus: boolean;
    @Input() nightMode: boolean;
    @Input() viewState: ViewLayouts;
    backupView: ViewLayouts;

    @Output() buttonView = new EventEmitter<AppFeatures>();

    AppFeature = AppFeatures;

    constructor(config: NgbTooltipConfig) {
        config.container = 'body';
        config.placement = 'left';
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.viewState?.currentValue && changes.viewState?.currentValue.mappa.active) {
            this.backupView = changes.viewState.previousValue;
        }
    }

    buttonViewMode($event): void {
        this.buttonView.emit($event);
    }

}
