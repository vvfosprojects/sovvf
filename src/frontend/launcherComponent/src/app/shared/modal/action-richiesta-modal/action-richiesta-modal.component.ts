import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
    selector: 'app-action-richiesta-modal',
    templateUrl: './action-richiesta-modal.component.html',
    styleUrls: ['./action-richiesta-modal.component.css']
})
export class ActionRichiestaModalComponent implements OnInit {

    @Input() icona: any;
    @Input() titolo: string;
    @Input() messaggio: string;
    @Input() messaggioAttenzione: string;
    @Input() bottoni: any[];

    actionRichiestaForm: FormGroup;

    constructor(public modal: NgbActiveModal,
        private formBuilder: FormBuilder) {
        this.actionRichiestaForm = this.formBuilder.group({
            note: new FormControl()
        });
    }

    get f() { return this.actionRichiestaForm.controls; }

    ngOnInit() {
        this.actionRichiestaForm = this.formBuilder.group({
            note: ['']
        });
    }

    close(esito: string) {
        const obj = {
            'esito': esito,
            'note': this.f.note.value ? this.f.note.value : null
        };
        this.modal.close(obj);
    }
}
