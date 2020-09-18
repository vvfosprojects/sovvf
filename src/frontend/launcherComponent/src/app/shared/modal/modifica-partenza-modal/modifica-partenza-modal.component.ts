import { Component, OnDestroy, OnInit, } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Observable } from 'rxjs';
import { Utente } from '../../model/utente.model';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { AuthState } from 'src/app/features/auth/store/auth.state';
import { ModificaPartenzaModalState } from '../../store/states/modifica-partenza-modal/modifica-partenza-modal.state';
import { Partenza } from './../../model/partenza.model';
import { StatoMezzoSequenze } from '../../enum/stato-mezzo.enum';
import { SostituzionePartenzaModalComponent } from '../sostituzione-partenza-modal/sostituzione-partenza-modal.component';
import { ListaSquadre } from '../../interface/lista-squadre';
import { VisualizzaListaSquadrePartenza } from 'src/app/features/home/store/actions/richieste/richieste.actions';
import { SequenzaValoriSelezionati } from '../../interface/sequenza-modifica-partenza.interface';
import { makeCopy } from '../../helper/function';


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
    public time = { hour: 13, minute: 30, second: 30 };
    listaStatoMezzo: string[];
    statoMezzoSelezionato: string;
    sequenze: SequenzaValoriSelezionati[] = [];
    inSostituzione: boolean = false;
    hideBox: boolean = true;
    boxSostitutivo: boolean = false;
    nuovoMezzo: string;
    nuoveSquadre: string[];
    nonModificabile: boolean = false;
    statiMezzo: any[] = [
        {disabled: false, name: 'In Uscita'},
        {disabled: true, name: 'In Viaggio'},
        {disabled: true, name: 'Sul Posto'},
        {disabled: true, name: 'In Rientro'},
        {disabled: true, name: 'Rientrato'},
    ];
    valid: boolean = false;

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
        this.listaStatoMezzo = Object.values(StatoMezzoSequenze);
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
            dataAnnullamento: new FormControl(),
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
            dataAnnullamento: [null],
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

    onValid() {
        this.valid = true;
    }
 
    onNotValid() {
        this.valid = false;
    }

    getTitle(): string {
        return 'Modifica Partenza Richiesta ' + this.codRichiesta;
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
        this.time.second = d.getSeconds();
    }

    formatTimeForCallBack(): any {
        return { oraEvento: this.sequenze['time'] };
    }

    onAddSequenza(): void {
        this.valid = false;
        const d = new Date();
        let select = makeCopy(this.statiMezzo);
        if (this.sequenze.length > 0 ) {
        select = makeCopy(this.sequenze[this.sequenze.length - 1].select);    
        const i = select.findIndex(x => !x.disabled)
        select[i].disabled = true;
        select[i+1].disabled = false;
        } 
        this.sequenze.push({ stato: undefined, time: { hour: d.getHours(), minute: d.getMinutes(), second: d.getSeconds() }, select });
    }

    onRemoveSequenza(): void {
        this.sequenze.pop();
        if (this.sequenze.length === 0) {
            this.valid = false;
        } 
        if (this.sequenze.length === 1 && !this.f.sequenzaStati[0]) {
            this.valid = false;
        } 
    }

    annullaPartenza() {
        this.hideBox = true;
        this.nonModificabile = false;
    }

    openSostituzioneModal(): void {
        const sostituzioneModal = this.modalService.open(SostituzionePartenzaModalComponent, {
            windowClass: 'modal-holder',
            size: 'lg',
            centered: true,
            backdrop  : 'static',
            keyboard  : false,
        });
        sostituzioneModal.componentInstance.idRichiesta = this.idRichiesta;
        sostituzioneModal.componentInstance.codRichiesta = this.codRichiesta;
        sostituzioneModal.componentInstance.partenza = this.partenza;
        sostituzioneModal.result.then((res: { status: string, result: any }) => {
            switch (res.status) {
                case 'ok' :
                    console.log('RESULT SECONDO MOD ', res.result)
                    this.inSostituzione = true;
                    this.hideBox = false;
                    this.boxSostitutivo = true;
                    this.nonModificabile = true;
                    const nuovaPartenza = res.result;
                    if (nuovaPartenza.mezzo && nuovaPartenza.squadre && nuovaPartenza.squadre.length > 0) {
                        this.f.annullamento.patchValue(true);
                        this.f.mezzo.patchValue(nuovaPartenza.mezzo);
                        this.nuovoMezzo = nuovaPartenza.mezzo.mezzo;
                        this.nuoveSquadre = nuovaPartenza.squadre.map(x => x.squadra);
                        this.f.squadre.patchValue(nuovaPartenza.squadre.map(x => x));
                        this.f.motivazioneAnnullamento.patchValue(nuovaPartenza.motivazioneAnnullamento);
                        this.f.codMezzoDaAnnullare.patchValue(this.partenza.mezzo.codice);
                        this.f.codSquadreDaAnnullare.patchValue(this.partenza.squadre.map(x => x.id));
                        this.f.dataAnnullamento.patchValue(nuovaPartenza.dataAnnullamento);
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
                data.setSeconds(orario.second);
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
                    annullamento: false,
                    codMezzoDaAnnullare: this.f.codMezzoDaAnnullare.value,
                    codSquadreDaAnnullare: this.f.codSquadreDaAnnullare.value,
                    mezzo: this.f.mezzo.value,
                    squadre: this.f.squadre.value,
                    motivazioneAnnullamento: this.f.motivazioneAnnullamento.value,
                    sequenzaStati: sequenze,
                    dataAnnullamento: this.f.dataAnnullamento.value,
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
