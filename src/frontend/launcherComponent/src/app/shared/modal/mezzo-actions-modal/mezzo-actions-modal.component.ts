import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-mezzo-actions-modal',
    templateUrl: './mezzo-actions-modal.component.html',
    styleUrls: ['./mezzo-actions-modal.component.css']
})
export class MezzoActionsModalComponent implements OnInit {

    public time = { hour: 13, minute: 30, second: 0 };

    timeActionForm: FormGroup;
    todayDate;
    dateNow;
    navigation: 'select';
    outsideDays: 'visible';
    submitted: boolean;
    statoMezzo: string;
    dataInViaggio: any;
    title: string;
    titleStato: string;
    listaEventi: any;
    ultimoMezzo = false;
    checkbox: { sospesa: boolean, chiusa: boolean, aperta: boolean } = {
        sospesa: true,
        chiusa: false,
        aperta: false,
    };
    azioneIntervento: string;

    constructor(public modal: NgbActiveModal, private fb: FormBuilder, calendar: NgbCalendar) {
        this.todayDate = calendar.getToday();
        this.dateNow = calendar.getToday();
    }

    ngOnInit(): void {
        this.initForm();
        this.checkUltimoMezzo();
    }

    initForm(): void {
        this.formatTime();
        this.timeActionForm = this.fb.group({
            time: [this.time, Validators.required],
        });
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

    formatTime(): void {
        const d = new Date();
        if (this.title !== 'Modifica') {
            this.time.hour = d.getHours();
            this.time.minute = d.getMinutes();
            this.time.second = d.getSeconds();
        } else {
            this.time.hour = (+this.dataInViaggio.ora) + 2;
            this.time.minute = +this.dataInViaggio.minuti;
            this.time.second = d.getSeconds();
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
        return { oraEvento: this.time, dataEvento: this.todayDate, azioneIntervento: this.azioneIntervento };
    }

}
