import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Observable } from 'rxjs';
import { Utente } from '../../model/utente.model';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { AuthState } from 'src/app/features/auth/store/auth.state';
import { ModificaPartenzaModalState } from '../../store/states/modifica-partenza-modal/modifica-partenza-modal.state';
import { Partenza } from './../../model/partenza.model';
import { StatoMezzo } from '../../enum/stato-mezzo.enum';
import { SostituzionePartenzaModalComponent } from '../sostituzione-partenza-modal/sostituzione-partenza-modal.component';
import { ListaSquadre } from '../../interface/lista-squadre';
import { VisualizzaListaSquadrePartenza } from 'src/app/features/home/store/actions/richieste/richieste.actions';
import { SequenzaValoriSelezionati } from '../../interface/sequenza-modifica-partenza.interface';


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
    codRichiesta: string;
    public time = { hour: 13, minute: 30 };
    listaStatoMezzo: any[];
    statoMezzoSelezionato: string;
    sequenze: SequenzaValoriSelezionati[] = [];
    inSostituzione: boolean = false;
    hideBox: boolean = true;
    boxSostitutivo: boolean = false;
    nuovoMezzo: string;
    nuoveSquadre: string[];

    modificaPartenzaForm: FormGroup;
    submitted: boolean;

    subscription: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbActiveModal,
                private fb: FormBuilder,
                private modalService: NgbModal) {
        this.initForm();
        this.getFormValid();
        this.inizializzaUser();
        this.formatTime();
    }

    ngOnInit(): void {
        this.listaStatoMezzo = Object.values(StatoMezzo);
        this.modificaPartenzaForm.reset();
        this.f.codRichiesta.patchValue(this.codRichiesta);
        this.f.mezzo.patchValue(this.partenza.mezzo);
        this.f.squadre.patchValue(this.partenza.squadre);
    }

    initForm(): void {
        this.modificaPartenzaForm = new FormGroup({
            operatore: new FormControl(),
            sede: new FormControl(),
            codRichiesta: new FormControl(),
            annullamento: new FormControl(),
            codMezzoDaAnnullare: new FormControl(),
            codSquadreDaAnnullare: new FormControl(),
            mezzo: new FormControl(),
            squadre: new FormControl(),
            motivazioneAnnullamento: new FormControl(),
            sequenzaStati: new FormControl(),
        });
        this.modificaPartenzaForm = this.fb.group({
            operatore: [null],
            sede: [null],
            codRichiesta: [null],
            annullamento: [false],
            codMezzoDaAnnullare: [null],
            codSquadreDaAnnullare: [null],
            mezzo: [null],
            squadre: [null],
            motivazioneAnnullamento: [null],
            sequenzaStati: [null],
        });
    }

    get f(): any {
        return this.modificaPartenzaForm.controls;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getFormValid(): void {
        this.subscription.add(
            this.formValid$.subscribe((valid: boolean) => {
                this.formValid = valid;
            })
        );
    }


    getTitle(): string {
        return 'Modifica Partenza Richiesta ' + this.partenza.mezzo['idRichiesta'];
    }

    inizializzaUser(): void {
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

    formatTime(): void {
        const d = new Date();
        this.time.hour = d.getHours();
        this.time.minute = d.getMinutes();
    }

    formatTimeForCallBack(): any {
        return { oraEvento: this.sequenze['time'] };
    }

    onAddSequenza(): void {
        const d = new Date();
        this.sequenze.push({ stato: undefined, time: { hour: d.getHours(), minute: d.getMinutes() } });
    }

    onRemoveSequenza(): void {
        this.sequenze.pop();
    }

    openSostituzioneModal(): void {
        const sostituzioneModal = this.modalService.open(SostituzionePartenzaModalComponent, {
            windowClass: 'modal-holder',
            size: 'lg',
            centered: true
        });
        sostituzioneModal.componentInstance.idRichiesta = this.idRichiesta;
        sostituzioneModal.componentInstance.codRichiesta = this.codRichiesta;
        sostituzioneModal.componentInstance.partenza = this.partenza;
        sostituzioneModal.result.then((res: { status: string, result: any }) => {
            switch (res.status) {
                case 'ok' :
                    this.inSostituzione = true;
                    this.hideBox = false;
                    this.boxSostitutivo = true;
                    const nuovaPartenza = res.result;
                    if (nuovaPartenza.mezzo && nuovaPartenza.squadre && nuovaPartenza.squadre.length > 0) {
                        this.f.annullamento.patchValue(true);
                        this.f.mezzo.patchValue(nuovaPartenza.mezzo);
                        this.nuovoMezzo = nuovaPartenza.mezzo.mezzo['descrizione'];
                        this.nuoveSquadre = nuovaPartenza.squadre.map(x => x.squadra);
                        console.log('VALORE NUOVO SQUADRE ', this.nuoveSquadre)
                        this.f.squadre.patchValue(nuovaPartenza.squadre.map(x => x));
                        this.f.motivazioneAnnullamento.patchValue(nuovaPartenza.motivazioneAnnullamento);
                        this.f.codMezzoDaAnnullare.patchValue(this.partenza.mezzo.codice);
                        this.f.codSquadreDaAnnullare.patchValue(this.partenza.squadre.map(x => x.id));
                    }
                    break;
                case 'ko':
                    break;
            }
        });
    }

    onListaSquadrePartenza(): void {
        const listaSquadre = {} as ListaSquadre;
        listaSquadre.idPartenza = this.partenza.id;
        listaSquadre.squadre = this.partenza.squadre;
        this.store.dispatch(new VisualizzaListaSquadrePartenza(listaSquadre));
    }

    onConferma(): void {
        this.submitted = true;

        if (!this.modificaPartenzaForm.valid) {
            return;
        }

        this.formatTimeForCallBack();
        this.f.sequenzaStati.patchValue(this.sequenze);
        if (!this.f.codMezzoDaAnnullare.value) {
            this.f.mezzo.patchValue(this.partenza.mezzo);
        }
        if (!this.f.codSquadreDaAnnullare.value || this.f.codSquadreDaAnnullare.value.length <= 0) {
            this.f.squadre.patchValue(this.partenza.squadre);
        }
        const sequenze = this.f.sequenzaStati.value;
        if (sequenze) {
            sequenze.forEach((s: SequenzaValoriSelezionati) => {
                let data = new Date();
                const orario = s.time;
                data.setHours(orario.hour);
                data.setMinutes(orario.minute);
                data.setSeconds(0);
                data.setMilliseconds(0);
                data = new Date(data.getTime());
                s.dataOraAggiornamento = data;
            });
        }
        this.store.dispatch(new UpdateFormValue({
            value: {
                operatore: this.f.operatore.value,
                sede: this.f.sede.value,
                codRichiesta: this.f.codRichiesta.value,
                annullamento: this.f.annullamento.value,
                codMezzoDaAnnullare: this.f.codMezzoDaAnnullare.value,
                codSquadreDaAnnullare: this.f.codSquadreDaAnnullare.value,
                mezzo: this.f.mezzo.value,
                squadre: this.f.squadre.value,
                motivazioneAnnullamento: this.f.motivazioneAnnullamento.value,
                sequenzaStati: sequenze
            },
            path: 'modificaPartenzaModal.modificaPartenzaForm'
        }));
        this.modal.close({ status: 'ok' });
    }

    onDismiss(): void {
        this.modal.dismiss({ status: 'ko' });
    }

    closeModal(type: string): void {
        this.modal.close({ status: type });
    }
}
