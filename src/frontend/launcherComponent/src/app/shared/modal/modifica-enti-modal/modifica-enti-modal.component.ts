import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ente } from '../../interface/ente.interface';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { EntiState } from '../../store/states/enti/enti.state';
import { EnteModalComponent } from '../ente-modal/ente-modal.component';
import { ClearFormEnte, RequestAddEnte } from '../../store/actions/enti/enti.actions';

@Component({
    selector: 'app-modifica-enti-modal',
    templateUrl: './modifica-enti-modal.component.html',
    styleUrls: ['./modifica-enti-modal.component.css']
})
export class ModificaEntiModalComponent implements OnInit, OnDestroy {

    @Select(EntiState.enti) enti$: Observable<Ente[]>;
    enti: Ente[];

    listaEntiIntervenuti: Ente[];

    modificaEntiIntervenutiForm: FormGroup;
    submitted: boolean;

    subscription: Subscription = new Subscription();

    constructor(public modal: NgbActiveModal,
                private fb: FormBuilder,
                private modalService: NgbModal,
                private store: Store) {
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngOnInit(): void {
        this.modificaEntiIntervenutiForm = this.fb.group({
            listaEnti: [this.listaEntiIntervenuti ? this.listaEntiIntervenuti.map(e => e.codice) : null],
        });
        this.getEnti();
    }

    getEnti(): void {
        this.subscription.add(
            this.enti$.subscribe((enti: Ente[]) => {
                this.enti = enti;
            })
        );
    }

    aggiungiNuovoEnte(): void {
        const addEnteModal = this.modalService.open(EnteModalComponent, {
            windowClass: 'modal-holder modal-left',
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });
        addEnteModal.result.then(
            (result: { success: boolean }) => {
                if (result.success) {
                    this.store.dispatch(new RequestAddEnte());
                } else if (!result.success) {
                    this.store.dispatch(new ClearFormEnte());
                    console.log('Modal "addEnteModal" chiusa con val ->', result);
                }
            },
            (err) => {
                this.store.dispatch(new ClearFormEnte());
                console.error('Modal chiusa senza bottoni. Err ->', err);
            }
        );
    }

    onSubmit(): void {
        this.submitted = true;

        if (!this.modificaEntiIntervenutiForm.valid) {
            return;
        }

        this.modal.close({ status: 'ok', result: this.modificaEntiIntervenutiForm.value });
    }

    onCancel(): void {
        this.modal.close({ status: 'ko', result: null });
    }
}
