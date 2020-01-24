import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CheckboxInterface } from '../../interface/checkbox.interface';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: [ './checkbox.component.css' ]
})
export class CheckboxComponent {

    @Input() checkboxState: CheckboxInterface = { id: null, status: false };
    @Input() typeName = 'checkBox';
    @Input() tooltipMessage;
    @Output() checkbox = new EventEmitter<CheckboxInterface>();
    @Output() container = new EventEmitter();

    onCheck() {
        this.checkbox.emit({
            id: this.checkboxState.id,
            status: !this.checkboxState.status
        });
    }

    labelFormat() {
        if (this.checkboxState) {
            const label = this.checkboxState.label;
            return label ? label : '&nbsp;';
        }
    }

}
