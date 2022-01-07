import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-add-evento-richiesta',
    templateUrl: './add-evento-richiesta.component.html',
    styleUrls: ['./add-evento-richiesta.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
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
            text: [null, Validators.required],
            istante: [{ hour: new Date().getHours(), minute: new Date().getMinutes() }, Validators.required]
        });
    }

    get f(): any {
        return this.eventoForm.controls;
    }

    onSubmit(): void {
        this.addEvento.emit();
    }
}
