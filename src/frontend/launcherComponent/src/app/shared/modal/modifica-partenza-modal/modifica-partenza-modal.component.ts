import { Component, OnDestroy, OnInit, } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Observable } from 'rxjs';
import { Utente } from '../../model/utente.model';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { AuthState } from 'src/app/features/auth/store/auth.state';
import { ModificaPartenzaModalState } from '../../store/states/modifica-partenza-modal/modifica-partenza-modal.state';
import { Partenza } from '../../model/partenza.model';
import { StatoMezzoSequenze } from '../../enum/stato-mezzo.enum';
import { SostituzionePartenzaModalComponent } from '../sostituzione-partenza-modal/sostituzione-partenza-modal.component';
import { ListaSquadre } from '../../interface/lista-squadre';
import { VisualizzaListaSquadrePartenza } from 'src/app/features/home/store/actions/richieste/richieste.actions';
import { SequenzaValoriSelezionati } from '../../interface/sequenza-modifica-partenza.interface';
import { makeCopy } from '../../helper/function-generiche';
import { ModificaPartenzaDto } from '../../interface/dto/modifica-partenza-dto.interface';
import { ModificaPartenzaService } from '../../../core/service/modifica-partenza/modifica-partenza.service';
import { Mezzo } from '../../model/mezzo.model';
import { Squadra } from '../../model/squadra.model';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';

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
    richiesta: SintesiRichiesta;
    idRichiesta: string;
    codRichiesta: string;
    public time = { hour: 13, minute: 30, second: 30 };
    public timeAnnullamento = { hour: 13, minute: 30 };
    listaStatoMezzo: string[];
    sequenze: SequenzaValoriSelezionati[] = [];
    inSostituzione = false;
    hideBox = true;
    boxSostitutivo = false;
    nuovoMezzo: Mezzo;
    nuoveSquadre: Squadra[];
    nonModificabile = false;
    statiMezzo: any[] = [
        { name: 'In Uscita' },
        { name: 'In Viaggio' },
        { name: 'Sul Posto' },
        { name: 'In Rientro' },
        { name: 'Rientrato' },
    ];
    valid = false;
    sequenzeValid = true;

    modificaPartenzaForm: FormGroup;
    submitted: boolean;

    subscription: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbActiveModal,
                private fb: FormBuilder,
                private modalService: NgbModal,
                private modificaPartenzaService: ModificaPartenzaService) {
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
        this.checkStatoMezzoSequenza();
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
            annullamento: [null],
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

    checkStatoMezzoSequenza(): void {
        for (let i = 0; i < this.statiMezzo.length - 2; i++) {
            if (this.partenza.mezzo.stato === this.statiMezzo[i].name) {
                this.statiMezzo[i + 1].disabled = false;
                this.statiMezzo.splice(0, i + 1);
            }
        }
    }

    getTitle(): string {
        return 'Modifica Partenza - Richiesta ' + this.codRichiesta;
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
        this.valid = true;
        const d = new Date();
        const select = makeCopy(this.statiMezzo);
        const statoResult = this.statiMezzo[this.sequenze.length].name;
        if (statoResult === 'Rientrato') {
            this.sequenzeValid = false;
        }
        this.sequenze.push({
            stato: statoResult,
            time: { hour: d.getHours(), minute: d.getMinutes(), second: d.getSeconds() },
            select,
            codMezzo: this.inSostituzione ? this.nuovoMezzo : this.f.mezzo.value
        });
    }

    onRemoveSequenza(): void {
        this.sequenze.pop();
        this.sequenzeValid = true;
        if (this.sequenze.length === 0) {
            this.valid = false;
            this.sequenzeValid = true;
        }
    }

    annullaPartenza(): void {
        this.hideBox = true;
        this.nonModificabile = false;
        this.inSostituzione = false;
        this.store.dispatch(new UpdateFormValue({
            value: {
                annullamento: false,
                codMezzoDaAnnullare: null,
                codSquadreDaAnnullare: null,
                motivazioneAnnullamento: null,
                mezzo: this.partenza.mezzo,
                squadre: this.partenza.squadre,
                sequenzaStati: [],
                dataAnnullamento: null,
            },
            path: 'modificaPartenzaModal.modificaPartenzaForm'
        }));
        this.sequenze = [];
        this.sequenzeValid = true;
        this.valid = false;
    }

    openSostituzioneModal(): void {
        let sostituzioneModal;
        sostituzioneModal = this.modalService.open(SostituzionePartenzaModalComponent, {
            windowClass: 'modal-holder',
            size: 'lg',
            centered: true,
            backdrop: 'static',
            keyboard: false,
        });
        sostituzioneModal.componentInstance.idRichiesta = this.idRichiesta;
        sostituzioneModal.componentInstance.richiesta = this.richiesta;
        sostituzioneModal.componentInstance.codRichiesta = this.codRichiesta;
        sostituzioneModal.componentInstance.partenza = this.partenza;
        sostituzioneModal.result.then((res: { status: string, result: any }) => {
            switch (res.status) {
                case 'ok' :
                    const nuovaPartenza = res.result;
                    this.valid = true;
                    this.inSostituzione = true;
                    this.hideBox = false;
                    this.boxSostitutivo = true;
                    this.nonModificabile = true;
                    this.timeAnnullamento = nuovaPartenza.time;
                    if (nuovaPartenza.mezzo && nuovaPartenza.squadre && nuovaPartenza.squadre.length > 0) {
                        this.f.annullamento.patchValue(true);
                        this.f.mezzo.patchValue(nuovaPartenza.mezzo);
                        this.nuovoMezzo = nuovaPartenza.mezzo.mezzo;
                        this.nuoveSquadre = nuovaPartenza.squadre.map(x => x);
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

    onListaSquadrePartenzaSostitutiva(): void {
        const listaSquadre = {
            idPartenza: '',
            squadre: [],
        };
        listaSquadre.idPartenza = this.partenza.id;
        listaSquadre.squadre = this.nuoveSquadre;
        this.store.dispatch(new VisualizzaListaSquadrePartenza(listaSquadre));
    }

    onConferma(): void {
        this.submitted = true;

        if (!this.modificaPartenzaForm.valid) {
            return;
        }

        this.formatTimeForCallBack();
        this.f.sequenzaStati.patchValue(makeCopy(this.sequenze));
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
                annullamento: !!this.f.annullamento.value,
                codMezzoDaAnnullare: this.f.codMezzoDaAnnullare.value,
                codSquadreDaAnnullare: this.f.codSquadreDaAnnullare.value,
                mezzo: !this.f.sede.annullamento ? this.f.mezzo.value : this.partenza.mezzo,
                squadre: !this.f.sede.annullamento ? this.f.squadre.value : this.partenza.squadre,
                motivazioneAnnullamento: this.f.motivazioneAnnullamento.value,
                sequenzaStati: sequenze,
                dataAnnullamento: this.f.dataAnnullamento.value,
            },
            path: 'modificaPartenzaModal.modificaPartenzaForm'
        }));
        const form = this.store.selectSnapshot(ModificaPartenzaModalState.formValue);
        const obj = {
            codRichiesta: form.codRichiesta,
            annullamento: form.annullamento,
            codMezzoDaAnnullare: form.codMezzoDaAnnullare,
            codSquadreDaAnnullare: form.codSquadreDaAnnullare,
            mezzo: form.mezzo.mezzo ? form.mezzo.mezzo : form.mezzo,
            squadre: form.squadre,
            motivazioneAnnullamento: form.motivazioneAnnullamento,
            sequenzaStati: form.sequenzaStati.map(x => ({
                dataOraAggiornamento: x.dataOraAggiornamento,
                stato: x.stato ? x.stato : undefined,
                codMezzo: x.codMezzo ? x.codMezzo.codice : undefined,
            })),
            dataAnnullamento: form.dataAnnullamento,
        } as ModificaPartenzaDto;
        console.log('RequestAddModificaPartenza FORM', obj);
        this.modificaPartenzaService.addModificaPartenza(obj).subscribe(() => {
            this.modal.close({ status: 'ok' });
        }, () => this.submitted = false);
    }

    onDismiss(): void {
        this.modal.dismiss({ status: 'ko' });
    }

    closeModal(type: string): void {
        this.modal.close({ status: type });
    }
}
