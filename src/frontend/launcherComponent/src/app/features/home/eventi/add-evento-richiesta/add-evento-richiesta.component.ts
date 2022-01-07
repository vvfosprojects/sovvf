import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

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
        const todayNgbDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() } as NgbDate;
        console.log('todayNgbDate', todayNgbDate);

        this.eventoForm = this.formBuilder.group({
            codice: [null, Validators.required],
            text: [null, Validators.required],
            date: [todayNgbDate, Validators.required],
            orario: [{ hour: new Date().getHours(), minute: new Date().getMinutes() }, Validators.required]
        });
    }

    get f(): any {
        return this.eventoForm.controls;
    }

    onSubmit(): void {
        this.addEvento.emit();
    }
}
