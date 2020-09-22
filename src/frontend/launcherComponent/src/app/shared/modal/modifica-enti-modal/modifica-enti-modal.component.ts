import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ente } from '../../interface/ente.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { EntiState } from '../../store/states/enti/enti.state';

@Component({
    selector: 'app-modifica-enti-modal',
    templateUrl: './modifica-enti-modal.component.html',
    styleUrls: ['./modifica-enti-modal.component.css']
})
export class ModificaEntiModalComponent implements OnInit, OnDestroy {

    @Select(EntiState.enti) enti$: Observable<Ente[]>;
    public enti: Ente[] = [];

    listaEntiIntervenuti: Ente[];

    modificaEntiIntervenutiForm: FormGroup;
    submitted: boolean;
    subscription: Subscription;

    constructor(public modal: NgbActiveModal,
                private fb: FormBuilder) {
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngOnInit() {
        this.modificaEntiIntervenutiForm = this.fb.group({
            listaEnti: [this.listaEntiIntervenuti ? this.listaEntiIntervenuti.map(e => e.codice) : null],
        });
        this.enti = [];
        this.subscription = this.enti$.subscribe((r: Ente[]) => {
            if (r && r.length > 0) {
                r.forEach(e => this.enti.push(e));
            }
        });
    }

    onSubmit() {
        this.submitted = true;

        if (!this.modificaEntiIntervenutiForm.valid) {
            return;
        }

        this.modal.close({ status: 'ok', result: this.modificaEntiIntervenutiForm.value });
    }

    onCancel() {
        this.modal.close({ status: 'ko', result: null });
    }
}
