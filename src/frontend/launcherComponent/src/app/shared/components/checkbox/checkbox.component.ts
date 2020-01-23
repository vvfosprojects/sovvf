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
    @Output() checkbox = new EventEmitter<CheckboxInterface>();

    onCheck() {
        this.checkbox.emit({
            id: this.checkboxState.id,
            status: !this.checkboxState.status
        });
    }

}
