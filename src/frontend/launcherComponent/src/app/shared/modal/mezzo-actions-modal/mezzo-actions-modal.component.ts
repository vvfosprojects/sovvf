import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbCalendar, NgbTimepicker } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-mezzo-actions-modal',
    templateUrl: './mezzo-actions-modal.component.html',
    styleUrls: ['./mezzo-actions-modal.component.css']
})
export class MezzoActionsModalComponent implements OnInit, OnDestroy {

    @ViewChild('timepickerRef') timepickerRef: NgbTimepicker;

    time = { hour: 13, minute: 30, second: 0 };

    timeActionForm: FormGroup;
    submitted: boolean;

    todayDate: any;
    dateNow: any;

    navigation: 'select';
    outsideDays: 'visible';

    title: string;
    titleStato: string;
    statoMezzo: string;
    dataInViaggio: any;

    listaEventi: any;
    ultimoMezzo = false;

    checkbox: { sospesa: boolean, chiusa: boolean, aperta: boolean } = {
        sospesa: true,
        chiusa: false,
        aperta: false,
    };
    azioneIntervento: string;

    nowDateInterval: any;

    constructor(public modal: NgbActiveModal, private fb: FormBuilder, calendar: NgbCalendar) {
        this.todayDate = calendar.getToday();
        this.dateNow = calendar.getToday();
    }

    ngOnInit(): void {
        this.nowDateInterval = setInterval(() => {
            this.updateNowDate();
        }, 1000);
        this.initForm();
        this.checkUltimoMezzo();
    }

    ngOnDestroy(): void {
        if (this.nowDateInterval) {
            clearInterval(this.nowDateInterval);
        }
    }

    initForm(): void {
        this.formatTime();
        this.timeActionForm = this.fb.group({
            orarioAttuale: [this.title !== 'Modifica'],
            orarioPersonalizzato: [this.title === 'Modifica'],
            nowDate: [new Date()],
            time: [this.time, Validators.required]
        });
    }

    get f(): any {
        return this.timeActionForm.controls;
    }

    updateNowDate(): void {
        this.f.nowDate.patchValue(new Date());
    }

    formatTime(): void {
        const d = new Date();
        if (this.title !== 'Modifica') {
            this.time.hour = d.getHours();
            this.time.minute = d.getMinutes();
            this.time.second = 0;
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

    checkInvalidTime(): boolean {
        if (!this.time || this.titleStato === ': In Viaggio') {
            return false;
        }
        let isInvalid;
        const timeSelected = new Date();
        timeSelected.setHours(this.time.hour, this.time.minute);
        const dateNow = new Date();
        const dateOutOfRange = this.dateNow.before({ year: this.todayDate.year, month: this.todayDate.month, day: this.todayDate.day });
        const dateEquals = this.dateNow.equals({ year: this.todayDate.year, month: this.todayDate.month, day: this.todayDate.day });
        isInvalid = !!(((timeSelected > dateNow) && dateEquals) || dateOutOfRange);
        return isInvalid;
    }

    onChangeCheckboxOrarioAttuale(): void {
        this.f.orarioPersonalizzato.patchValue(false);
    }

    onChangeCheckboxOrarioPersonalizzato(): void {
        this.f.orarioAttuale.patchValue(false);
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
        const d = new Date();
        this.time.hour = d.getHours();
        this.time.minute = d.getMinutes();
        this.time.second = d.getSeconds();
        this.timepickerRef.model.hour = d.getHours();
        this.timepickerRef.model.minute = d.getMinutes();
        this.timepickerRef.model.second = d.getSeconds();
        this.todayDate = this.dateNow;
    }

    getAlertDataOraText(): string {
        const nowDate = this.f.nowDate.value;
        let text = 'Il cambiamento di stato risulterà il';
        if (this.f.orarioAttuale.value) {
            text += ` ${nowDate.getDate()}/${(+nowDate.getMonth() + 1)}/${nowDate.getFullYear()} alle ${nowDate.getHours() <= 9 ? '0' + nowDate.getHours() : nowDate.getHours()}:${nowDate.getMinutes() <= 9 ? '0' + nowDate.getMinutes() : nowDate.getMinutes()}:${nowDate.getSeconds() <= 9 ? '0' + nowDate.getSeconds() : nowDate.getSeconds()}`;
        } else {
            text += ` ${this.todayDate?.day}/${this.todayDate?.month}/${this.todayDate?.year} alle ${this.time.hour <= 9 ? '0' + this.time.hour : this.time.hour}:${this.time.minute <= 9 ? '0' + this.time.minute : this.time.minute}`;
        }
        return text;
    }

    checkUltimoMezzo(): void {
        const mezziEventi = [];
        this.listaEventi.forEach(x => mezziEventi.push(x.codiceMezzo));
        // Trovo storico mezzi di quella partenza
        const singleValue = Array.from(new Set(mezziEventi));
        // Rimuovo mezzi già rientrati
        const mezziRientrati = [];
        singleValue.forEach(x => this.listaEventi.filter(y => y.codiceMezzo === x).reduce((a, e) => !a ? e : (new Date(a.ora) > new Date(e.ora) ? a : e)).stato === 'Rientrato' ? mezziRientrati.push(x) : null);
        // Attivo la checkbox per ultimo mezzo
        if (singleValue.length - mezziRientrati.length === 1) {
            this.ultimoMezzo = true;
        }
    }

    onSubmit(): void {
        this.submitted = true;

        if (!this.timeActionForm.valid) {
            return;
        }
        this.modal.close({ status: 'ok', result: this.formatTimeForCallBack() });
    }

    formatTimeForCallBack(): any {
        if (this.f.orarioAttuale.value) {
            const nowDate = this.f.nowDate.value;
            const oraEvento = { hour: nowDate.getHours(), minute: nowDate.getMinutes(), second: nowDate.getSeconds() };
            const dataEvento = { day: nowDate.getDate(), month: (+nowDate.getMonth() + 1), year: nowDate.getFullYear() };
            return { oraEvento, dataEvento, azioneIntervento: this.azioneIntervento };
        } else {
            this.time.second = this.f.nowDate.value.getSeconds();
            return { oraEvento: this.time, dataEvento: this.todayDate, azioneIntervento: this.azioneIntervento };
        }
    }
}
