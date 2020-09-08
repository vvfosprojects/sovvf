import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Observable } from 'rxjs';
import { Utente } from '../../model/utente.model';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { AuthState } from 'src/app/features/auth/store/auth.state';
import { ModificaPartenzaModalState } from '../../store/states/modifica-partenza-modal/modifica-partenza-modal.state';
import { Partenza } from './../../model/partenza.model';
import { statoMezzoColor } from '../../helper/function';
import { StatoMezzo } from '../../enum/stato-mezzo.enum';
import { SostituzionePartenzaModalComponent } from '../sostituzione-partenza-modal/sostituzione-partenza-modal.component';

export interface ValoriSelezionati {
    stato: string;
    time: { hour: number, minute: number };
}

@Component({
    selector: 'app-modifica-partenza-modal',
    templateUrl: './modifica-partenza-modal.component.html',
    styleUrls: ['./modifica-partenza-modal.component.css']
})
export class ModificaPartenzaModalComponent implements OnInit, OnDestroy {

    @Select(AuthState.currentUser) user$: Observable<Utente>;
    user: Utente;
    @Select(ModificaPartenzaModalState.formValid) formValid$: Observable<boolean>;
    formValid: boolean;

    operatore: string;
    sede: string;
    partenza: Partenza;
    idRichiesta: string;
    public time = { hour: 13, minute: 30 };
    listaStatoMezzo: any[];
    statoMezzoSelezionato: string;
    numeroSequenze: ValoriSelezionati[] = [];

    modificaPartenzaForm: FormGroup;
    submitted: boolean;

    subscription: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbActiveModal,
                private fb: FormBuilder,
                private modalService: NgbModal,
                public activeModal: NgbActiveModal) {
        this.initForm();
        this.getFormValid();
        this.inizializzaUser();
        this.formatTime();
    }

    ngOnInit() {
        this.listaStatoMezzo = Object.values(StatoMezzo).map(x => ({ id: x, name: x }));
    }

    initForm() {
        this.modificaPartenzaForm = new FormGroup({
            operatore: new FormControl(),
            sede: new FormControl(),
            codMezzo: new FormControl(),
            codSquadre: new FormControl(),
            sequenza: new FormControl(),
        });
        this.modificaPartenzaForm = this.fb.group({
            operatore: [null, Validators.required],
            sede: [null, Validators.required],
            codMezzo: [null, Validators.required],
            codSquadre: [null, Validators.required],
            sequenza: [null, Validators.required],
        });
        this.f.operatore.disable();
        this.f.sede.disable();
    }

    get f() {
        return this.modificaPartenzaForm.controls;
    }

    ngOnDestroy(): void {
        this.modificaPartenzaForm.reset();
        this.subscription.unsubscribe();
    }


    getFormValid() {
        this.subscription.add(
            this.formValid$.subscribe((valid: boolean) => {
                this.formValid = valid;
            })
        );
    }


    getTitle(): string {
        const title = 'Modifica Partenza Richiesta ' + this.partenza.mezzo['idRichiesta'];
        return title;
    }

    inizializzaUser() {
        this.subscription.add(
            this.user$.subscribe((user: Utente) => {
                console.log('inizializzaUser', user);
                this.store.dispatch(
                    new UpdateFormValue({
                        path: 'modificaPartenzaModal.modificaPartenzaForm',
                        value: {
                            operatore: user.nome + ' ' + user.cognome,
                            sede: user.sede.descrizione
                        }
                    })
                );
            })
        );
    }

    onConferma() {
        this.submitted = true;

        if (!this.modificaPartenzaForm.valid) {
            return;
        }

        this.modal.close({ success: true, result: this.modificaPartenzaForm.value });
        // formatTimeForCallBack();
    }

    onDismiss(): void {
        this.modal.dismiss('ko');
    }

    closeModal(type: string) {
        this.modal.close(type);
    }

    formatTime() {
        const d = new Date();
        this.time.hour = d.getHours();
        this.time.minute = d.getMinutes();
    }

    /*
    formatTimeForCallBack(): any {
      return { oraEvento: this.time };
    }
    */

    statoMezzoColor(stato: StatoMezzo) {
        return statoMezzoColor(stato);
    }


    onAddSequenza() {
        const d = new Date();
        this.numeroSequenze.push({ stato: undefined, time: { hour: d.getHours(), minute: d.getMinutes() } });
    }

    onRemoveSequenza() {
        this.numeroSequenze.pop();
    }

    open() {
        const sostituzioneModal = this.modalService.open(SostituzionePartenzaModalComponent, {
            windowClass: 'modal-holder',
            size: 'lg',
            centered: true
        });
        sostituzioneModal.componentInstance.idRichiesta = this.idRichiesta;
    }

}
