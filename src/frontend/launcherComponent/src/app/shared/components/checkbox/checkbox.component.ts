import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CheckboxInterface } from '../../interface/checkbox.interface';
import {Select} from '@ngxs/store';
import {ViewComponentState} from '../../../features/home/store/states/view/view.state';
import {Observable, Subscription} from 'rxjs';
import {Composizione} from '../../enum/composizione.enum';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent {

    @Select(ViewComponentState.composizioneStatus) composizioneMode$: Observable<Composizione>;
    composizioneMode: boolean;

    @Input() checkboxState: CheckboxInterface = { id: null, status: false, label: '' };
    @Input() typeName = 'checkBox';
    @Input() tooltipMessage;
    @Output() checkbox = new EventEmitter<CheckboxInterface>();
    @Output() container = new EventEmitter();
    subscription: Subscription = new Subscription();

    constructor() {
      this.subscription.add(
        this.composizioneMode$.subscribe((cM: any) => {
          this.composizioneMode = cM;
          if (this.composizioneMode) {
            this.checkbox.emit({
              id: this.checkboxState.id,
              status: true
            });
          } else {
            this.checkbox.emit({
              id: this.checkboxState.id,
              status: false
            });
          }
        })
      );
    }

    onCheck(): void {
        this.checkbox.emit({
            id: this.checkboxState.id,
            status: !this.checkboxState.status
        });
    }

    labelFormat(): string {
        if (this.checkboxState) {
            const id = this.checkboxState.id;
            return id ? this.checkboxState.label : '&nbsp;';
        }
    }

}
