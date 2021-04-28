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
    navigation: 'select';
    outsideDays: 'visible';
    submitted: boolean;
    statoMezzo: string;
    listaEventi: any;
    ultimoMezzo = false;
    checkbox: { sospesa: boolean, chiusa: boolean, aperta: boolean } = {
        sospesa: false,
        chiusa: false,
        aperta: true
    };
    azioneIntervento: string;

    constructor(public modal: NgbActiveModal, private fb: FormBuilder, calendar: NgbCalendar) {
        this.todayDate = calendar.getToday();
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

    formatTime(): void {
        const d = new Date();
        this.time.hour = d.getHours();
        this.time.minute = d.getMinutes();
        this.time.second = d.getSeconds();
    }

    onCheck(key: string): void {
        if (this.checkbox[key]) {
            this.checkbox[key] = false;
        } else {
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
        this.listaEventi.forEach(x => x.stato === 'Rientrato' ? mezziRientrati.push(x.codiceMezzo) : null);
        mezziRientrati.forEach(x => {
            const index = mezziRientrati.indexOf(x);
            if (index !== -1) {
                singleValue.splice(index, 1);
            }});
        // Attivo la checkbox per ultimo mezzo
        if (singleValue.length === 1) {
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
