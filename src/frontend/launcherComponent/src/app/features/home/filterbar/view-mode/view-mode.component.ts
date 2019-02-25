import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppFeatures } from '../../../../shared/enum/app-features.enum';

@Component({
    selector: 'app-view-mode',
    templateUrl: './view-mode.component.html',
    styleUrls: ['./view-mode.component.css']
})
export class ViewModeComponent {

    @Input() colorButtonView = ['btn-outline-secondary', 'btn-secondary', 'btn-outline-secondary'];
    @Output() buttonView = new EventEmitter<AppFeatures>();
    AppFeature = AppFeatures;

    buttonViewMode($event) {
        this.buttonView.emit($event);
    }

}
