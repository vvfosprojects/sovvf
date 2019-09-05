import { Component, Input, OnInit } from '@angular/core';
import { ToggleSchedeContatto } from '../../store/actions/view/view.actions';
import { Store } from '@ngxs/store';

@Component({
    selector: 'app-tasto-schede-contatto',
    templateUrl: './tasto-schede-contatto.component.html',
    styleUrls: ['./tasto-schede-contatto.component.css']
})
export class TastoSchedeContattoComponent implements OnInit {

  @Input() active: boolean;
  @Input() disabled: boolean;

    constructor(private store: Store) {
    }

    ngOnInit() {
    }

    toggleSchedeContatto() {
        this.store.dispatch(new ToggleSchedeContatto());
    }

    coloreTasto() {
        let _returnClass = 'btn-outline-success';
        if (this.active) {
            _returnClass = 'btn-success';
        }
        if(this.disabled) {
          _returnClass = 'btn-outline-secondary cursor-not-allowed';
        }
        return _returnClass;
    }
}
