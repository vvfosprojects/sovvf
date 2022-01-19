import { Component, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Select } from '@ngxs/store';
import { GestisciSchedaContattoModalState } from '../../store/states/gestisci-scheda-contatto-modal/gestisci-scheda-contatto-modal.state';
import { Observable, Subscription } from 'rxjs';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-gestisci-scheda-contatto-modal',
    templateUrl: './gestisci-scheda-contatto-modal.component.html',
    styleUrls: ['./gestisci-scheda-contatto-modal.component.css']
})
export class GestisciSchedaContattoModalComponent implements OnDestroy {

    @Select(GestisciSchedaContattoModalState.codiciRichieste) codiciRichieste$: Observable<string[]>;
    codiciRichieste: string[];

    gestisciSchedaContattoForm: FormGroup;
    submitted: boolean;

    private subscriptions: Subscription = new Subscription();

    constructor(private modal: NgbActiveModal,
                private fb: FormBuilder) {
        this.initForm();
        this.getCodiciRichieste();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getCodiciRichieste(): void {
        this.subscriptions.add(
            this.codiciRichieste$.subscribe((codiciRichieste: string[]) => {
                this.codiciRichieste = codiciRichieste;
            })
        );
    }

    get f(): { [key: string]: AbstractControl } {
        return this.gestisciSchedaContattoForm.controls;
    }

    initForm(): void {
        this.gestisciSchedaContattoForm = new FormGroup({
            codiceRichiesta: new FormControl()
        });
        this.gestisciSchedaContattoForm = this.fb.group({
            codiceRichiesta: [null, Validators.required]
        });
    }

    close(type: string): void {
        this.modal.close(type);
    }

}
