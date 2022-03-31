import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbDate, NgbTimepicker } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClockService } from '../../../features/navbar/clock/clock-service/clock.service';
import { Subscription } from 'rxjs';
import { NgbTime } from '@ng-bootstrap/ng-bootstrap/timepicker/ngb-time';
import { makeCopy } from '../../helper/function-generiche';
import { TipoConcorrenzaEnum } from '../../enum/tipo-concorrenza.enum';

@Component({
    selector: 'app-mezzo-actions-modal',
    templateUrl: './mezzo-actions-modal.component.html',
    styleUrls: ['./mezzo-actions-modal.component.css']
})
export class MezzoActionsModalComponent implements OnInit, OnDestroy {

    @ViewChild('timepickerRef') timepickerRef: NgbTimepicker;

    dateSync: Date;
    time = { hour: 13, minute: 30, second: 0 };

    timeActionForm: FormGroup;
    submitted: boolean;

    todayDate: any;
    dateNow: any;

    navigation: 'select';
    outsideDays: 'visible';

    action: string;
    modificaOrario: boolean;
    codicePartenza: string;
    title: string;
    titleStato: string;
    statoMezzo: string;
    codiceMezzo: string;
    dataInViaggio: any;

    listaEventi: any;
    ultimoMezzo: boolean;

    checkbox: { sospesa: boolean, chiusa: boolean, aperta: boolean } = {
        sospesa: true,
        chiusa: false,
        aperta: false,
    };
    azioneIntervento: string;

    nowDateInterval: any;

    tipoConcorrenzaEnum = TipoConcorrenzaEnum;

    private subscriptions = new Subscription();

    constructor(public modal: NgbActiveModal,
                private fb: FormBuilder,
                private calendar: NgbCalendar,
                private clockService: ClockService) {
    }

    ngOnInit(): void {
        this.getClock();
    }

    ngOnDestroy(): void {
        if (this.nowDateInterval) {
            clearInterval(this.nowDateInterval);
        }
        this.subscriptions.unsubscribe();
    }

    getClock(): void {
        this.subscriptions.add(
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
                    if (!this.timeActionForm) {
                        this.initForm();
                        this.nowDateInterval = setInterval(() => {
                            this.updateNowDate();
                        }, 1000);
                    }
                }
            })
        );
    }

    initForm(): void {
        this.formatTime();
        this.timeActionForm = this.fb.group({
            orarioAttuale: [this.title !== 'Modifica'],
            orarioPersonalizzato: [this.title === 'Modifica'],
            nowDate: [this.dateSync],
            time: [this.time, Validators.required]
        });
    }

    get f(): any {
        return this.timeActionForm?.controls;
    }

    updateNowDate(): void {
        this.f?.nowDate.patchValue(this.dateSync);
    }

    formatTime(): void {
        const d = this.dateSync;
        if (d) {
            if (this.title !== 'Modifica') {
                this.time.hour = d.getHours();
                this.time.minute = d.getMinutes();
                this.time.second = d.getSeconds();
            } else if (this.dataInViaggio) {
                this.time.hour = (+this.dataInViaggio.ora) + 1;
                this.time.minute = +this.dataInViaggio.minuti;
                this.time.second = 0;
                this.todayDate = {
                    year: +this.dataInViaggio.anno,
                    month: +this.dataInViaggio.mese,
                    day: +this.dataInViaggio.giorno
                };
            }
        }
    }

    checkInvalidTime(): boolean {
        if (!this.time || this.titleStato === ': In Viaggio') {
            return false;
        }
        let isInvalid = true;
        if (this.dateSync) {
            // DATA
            const dateNow = new NgbDate(this.dateNow.year, this.dateNow.month, this.dateNow.day);
            const todayDate = this.todayDate;
            const dateOutOfRange = dateNow.before({ year: todayDate.year, month: todayDate.month, day: todayDate.day });
            const dateEquals = dateNow.equals({ year: todayDate.year, month: todayDate.month, day: todayDate.day });
            // ORARIO
            let timeSelected = makeCopy(this.dateSync);
            timeSelected = new Date(timeSelected);
            timeSelected.setHours(this.time.hour, this.time.minute);
            const todayTime = this.dateSync;
            isInvalid = !!(((timeSelected > todayTime) && dateEquals) || dateOutOfRange);
        }
        return isInvalid;
    }

    onChangeCheckboxOrarioAttuale(): void {
        if (!this.f?.orarioPersonalizzato.value) {
            this.f?.orarioPersonalizzato.patchValue(true);
        } else {
            this.f?.orarioPersonalizzato.patchValue(false);
        }
    }

    onChangeCheckboxOrarioPersonalizzato(): void {
        if (!this.f?.orarioAttuale.value) {
            this.f?.orarioAttuale.patchValue(true);
        } else {
            this.f?.orarioAttuale.patchValue(false);
        }
    }

    onCheck(key: string): void {
        if (!this.checkbox[key]) {
            Object.keys(this.checkbox).forEach(x => this.checkbox[x] = x === key);
        }
        this.azioneIntervento = key;
    }

    onCancel(): void {
        this.modal.close({ status: 'ko', result: null });
    }

    onDateNow(): void {
        const d = this.dateSync;
        this.time.hour = d.getHours();
        this.time.minute = d.getMinutes();
        this.time.second = d.getSeconds();
        this.timepickerRef.model.hour = d.getHours();
        this.timepickerRef.model.minute = d.getMinutes();
        this.timepickerRef.model.second = d.getSeconds();
        this.todayDate = this.dateNow;
    }

    getAlertDataOraText(): string {
        const nowDate = this.f?.nowDate.value;
        let text = 'Il cambiamento di stato risulterà il';
        if (this.f?.orarioAttuale.value) {
            text += ` ${nowDate.getDate()}/${(+nowDate.getMonth() + 1)}/${nowDate.getFullYear()} alle ${nowDate.getHours() <= 9 ? '0' + nowDate.getHours() : nowDate.getHours()}:${nowDate.getMinutes() <= 9 ? '0' + nowDate.getMinutes() : nowDate.getMinutes()}:${nowDate.getSeconds() <= 9 ? '0' + nowDate.getSeconds() : nowDate.getSeconds()}`;
        } else {
            text += ` ${this.todayDate?.day}/${this.todayDate?.month}/${this.todayDate?.year} alle ${this.time.hour <= 9 ? '0' + this.time.hour : this.time.hour}:${this.time.minute <= 9 ? '0' + this.time.minute : this.time.minute}`;
        }
        return text;
    }

    onSubmit(): void {
        this.submitted = true;

        if (!this.timeActionForm.valid) {
            return;
        }
        this.modal.close({ status: 'ok', result: this.formatTimeForCallBack() });
    }

    formatTimeForCallBack(): any {
        if (this.f?.orarioAttuale.value) {
            const nowDate = this.f.nowDate.value;
            const oraEvento = { hour: nowDate.getHours(), minute: nowDate.getMinutes(), second: nowDate.getSeconds() };
            const dataEvento = { day: nowDate.getDate(), month: (+nowDate.getMonth() + 1), year: nowDate.getFullYear() };
            return { oraEvento, dataEvento, azioneIntervento: this.azioneIntervento, codicePartenza: this.codicePartenza };
        } else {
            this.time.second = this.f?.nowDate.value.getSeconds();
            return { oraEvento: this.time, dataEvento: this.todayDate, azioneIntervento: this.azioneIntervento, codicePartenza: this.codicePartenza, modificaOrario: !!this.modificaOrario };
        }
    }
}
