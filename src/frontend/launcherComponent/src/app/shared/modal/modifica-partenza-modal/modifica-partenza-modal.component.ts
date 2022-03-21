import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { NgbActiveModal, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Observable } from 'rxjs';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { ModificaPartenzaModalState } from '../../store/states/modifica-partenza-modal/modifica-partenza-modal.state';
import { Partenza } from '../../model/partenza.model';
import { SostituzionePartenzaModalComponent } from '../sostituzione-partenza-modal/sostituzione-partenza-modal.component';
import { ListaSquadre } from '../../interface/lista-squadre';
import { VisualizzaListaSquadrePartenza } from 'src/app/features/home/store/actions/richieste/richieste.actions';
import { SequenzaValoriSelezionati } from '../../interface/sequenza-modifica-partenza.interface';
import { makeCopy } from '../../helper/function-generiche';
import { ModificaPartenzaDto } from '../../interface/dto/partenze/modifica-partenza-dto.interface';
import { ModificaPartenzaService } from '../../../core/service/modifica-partenza/modifica-partenza.service';
import { Mezzo } from '../../model/mezzo.model';
import { Squadra } from '../../model/squadra.model';
import { SintesiRichiesta } from '../../model/sintesi-richiesta.model';
import { NgbTime } from '@ng-bootstrap/ng-bootstrap/timepicker/ngb-time';
import { ClockService } from '../../../features/navbar/clock/clock-service/clock.service';

@Component({
    selector: 'app-modifica-partenza-modal',
    templateUrl: './modifica-partenza-modal.component.html',
    styleUrls: ['./modifica-partenza-modal.component.css']
})
export class ModificaPartenzaModalComponent implements OnInit, OnDestroy {

    @Select(ModificaPartenzaModalState.formValid) formValid$: Observable<boolean>;
    formValid: boolean;

    loading: boolean;

    dateSync: Date;
    todayDate: any;
    dateNow: any;

    singolaPartenza: Partenza;
    richiesta: SintesiRichiesta;
    codRichiesta: string;
    time = { hour: 13, minute: 30, second: 30 };
    timeAnnullamento = { hour: 13, minute: 30 };
    sequenze: SequenzaValoriSelezionati[] = [];
    inSostituzione = false;
    hideBox = true;
    boxSostitutivo = false;
    nuovoMezzo: Mezzo;
    nuoveSquadre: Squadra[];
    nonModificabile = false;
    statiMezzo: any[] = [
        { name: 'In Viaggio' },
        { name: 'Sul Posto' },
        { name: 'In Rientro' },
        { name: 'Rientrato' }
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
                private modificaPartenzaService: ModificaPartenzaService,
                private clockService: ClockService) {
        this.initForm();
        this.getFormValid();
        this.formatTime();
    }

    ngOnInit(): void {
        this.getClock();
        this.modificaPartenzaForm.reset();
        this.f.codRichiesta.patchValue(this.codRichiesta);
        this.f.mezzo.patchValue(this.singolaPartenza.partenza.mezzo);
        this.f.squadre.patchValue(this.singolaPartenza.partenza.squadre);
        this.checkStatoMezzoSequenza();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    initForm(): void {
        this.modificaPartenzaForm = new FormGroup({
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

    getFormValid(): void {
        this.subscription.add(
            this.formValid$.subscribe((valid: boolean) => {
                this.formValid = valid;
            })
        );
    }

    checkStatoMezzoSequenza(): void {
        for (let i = 0; i < this.statiMezzo.length - 1; i++) {
            if (this.singolaPartenza.partenza.mezzo.stato === this.statiMezzo[i].name) {
                this.statiMezzo[i + 1].disabled = false;
                this.statiMezzo.splice(0, i + 1);
            }
        }
    }

    getTitle(): string {
        return 'Modifica Partenza - Intervento ' + this.codRichiesta;
    }

    getClock(): void {
        this.subscription.add(
            this.clockService.getClock().subscribe((dateSync: Date) => {
                if (dateSync) {
                    this.dateSync = dateSync;
                    if (!this.todayDate) {
                        this.todayDate = { year: this.dateSync.getFullYear(), month: (+this.dateSync.getMonth() + 1), day: this.dateSync.getDate() } as NgbDate;
                    }
                    if (!this.dateNow) {
                        this.dateNow = { year: this.dateSync.getFullYear(), month: (+this.dateSync.getMonth() + 1), day: this.dateSync.getDate() } as NgbDate;
                    }
                    if (this.time === { hour: 13, minute: 30, second: 0 }) {
                        this.time = { hour: this.dateSync.getHours(), minute: this.dateSync.getMinutes(), second: this.dateSync.getSeconds() } as NgbTime;
                    }
                }
            })
        );
    }

    checkInvalidTimeSequenza(sequenza: SequenzaValoriSelezionati): boolean {
        let isInvalid = true;
        if (this.dateSync) {
            // ORARIO
            const timeSequenza = sequenza.time;
            const timeSelected = new Date();
            timeSelected.setHours(timeSequenza.hour);
            timeSelected.setMinutes(timeSequenza.minute);
            timeSelected.setSeconds(0);
            const todayTime = this.dateSync;
            isInvalid = timeSelected > todayTime;
        }
        return isInvalid;
    }

    checkInvalidTimeSequenze(): boolean {
        return this.sequenze.map((s: SequenzaValoriSelezionati) => this.checkInvalidTimeSequenza(s)).filter((value: boolean) => value === true)?.length > 0;
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
                mezzo: this.singolaPartenza.partenza.mezzo,
                squadre: this.singolaPartenza.partenza.squadre,
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
        sostituzioneModal.componentInstance.idRichiesta = this.richiesta.id;
        sostituzioneModal.componentInstance.richiesta = this.richiesta;
        sostituzioneModal.componentInstance.codRichiesta = this.codRichiesta;
        sostituzioneModal.componentInstance.partenza = this.singolaPartenza;
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
                        this.f.codMezzoDaAnnullare.patchValue(this.singolaPartenza.partenza.mezzo.codice);
                        this.f.codSquadreDaAnnullare.patchValue(this.singolaPartenza.partenza.squadre.map(x => x.id));
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
        listaSquadre.idPartenza = this.singolaPartenza.partenza.id;
        listaSquadre.squadre = this.singolaPartenza.partenza.squadre;
        this.store.dispatch(new VisualizzaListaSquadrePartenza(this.singolaPartenza.partenza.mezzo.codice, listaSquadre));
    }

    onListaSquadrePartenzaSostitutiva(): void {
        const listaSquadre = {
            idPartenza: '',
            squadre: [],
        };
        listaSquadre.idPartenza = this.singolaPartenza.partenza.id;
        listaSquadre.squadre = this.nuoveSquadre;
        this.store.dispatch(new VisualizzaListaSquadrePartenza(this.singolaPartenza.partenza.mezzo.codice, listaSquadre));
    }

    onConferma(): void {
        this.submitted = true;
        this.loading = true;

        if (!this.modificaPartenzaForm.valid) {
            return;
        }

        this.formatTimeForCallBack();
        this.f.sequenzaStati.patchValue(makeCopy(this.sequenze));
        if (!this.f.codMezzoDaAnnullare.value) {
            this.f.mezzo.patchValue(this.singolaPartenza.partenza.mezzo);
        }
        if (!this.f.codSquadreDaAnnullare.value || this.f.codSquadreDaAnnullare.value.length <= 0) {
            this.f.squadre.patchValue(this.singolaPartenza.partenza.squadre);
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
        this.modificaPartenzaForm.patchValue({
            codRichiesta: this.codRichiesta,
            annullamento: !!this.f.annullamento.value,
            codMezzoDaAnnullare: this.f.codMezzoDaAnnullare.value,
            codSquadreDaAnnullare: this.f.codSquadreDaAnnullare.value,
            mezzo: !this.f.annullamento ? this.f.mezzo.value : this.singolaPartenza.partenza.mezzo,
            squadre: !this.f.annullamento ? this.f.squadre.value : this.singolaPartenza.partenza.squadre,
            motivazioneAnnullamento: this.f.motivazioneAnnullamento.value,
            sequenzaStati: sequenze,
            dataAnnullamento: this.f.dataAnnullamento.value,
        });
        const obj = {
            codRichiesta: this.codRichiesta,
            annullamento: this.f.annullamento.value,
            codMezzoDaAnnullare: this.f.codMezzoDaAnnullare.value,
            codSquadreDaAnnullare: this.f.codSquadreDaAnnullare.value,
            mezzo: this.f.mezzo?.mezzo?.value ? this.f.mezzo.mezzo.value : this.f.mezzo.value,
            squadre: this.f.squadre.value,
            motivazioneAnnullamento: this.f.motivazioneAnnullamento.value,
            sequenzaStati: this.f.sequenzaStati.value.map((sequenza: any) => ({
                istante: sequenza.dataOraAggiornamento,
                stato: sequenza.stato ? sequenza.stato : null,
                codMezzo: sequenza.codMezzo ? sequenza.codMezzo.codice : null,
            })),
            dataAnnullamento: this.f.dataAnnullamento.value,
        } as ModificaPartenzaDto;
        this.modificaPartenzaService.addModificaPartenza(obj).subscribe(() => {
            this.modal.close({ status: 'ok' });
            this.loading = false;
        }, () => {
            this.submitted = false;
            this.loading = false;
        });
    }

    onDismiss(): void {
        this.modal.dismiss({ status: 'ko' });
    }

    closeModal(type: string): void {
        this.modal.close({ status: type });
    }
}
