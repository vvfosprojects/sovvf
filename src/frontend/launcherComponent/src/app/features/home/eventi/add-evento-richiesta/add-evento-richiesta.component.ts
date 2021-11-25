import { Component, Input, ChangeDetectionStrategy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-add-evento-richiesta',
    templateUrl: './add-evento-richiesta.component.html',
    styleUrls: ['./add-evento-richiesta.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEventoRichiestaComponent implements OnInit {

    @Input() codiceRichiesta: string;
    @Input() loading: boolean;

    @Output() addEvento: EventEmitter<any> = new EventEmitter<any>();

    eventoForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        this.initForm();
    }

    ngOnInit(): void {
        this.f.codice.patchValue(this.codiceRichiesta);
    }

    initForm(): void {
        this.eventoForm = this.formBuilder.group({
            codice: [null, Validators.required],
            text: [null, Validators.required]
        });
    }

    get f(): any {
        return this.eventoForm.controls;
    }

    onSubmit(): void {
        this.addEvento.emit();
    }
}
