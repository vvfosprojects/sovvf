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
    checkbox: {Si: boolean, No: boolean} = {
        Si: false,
        No: true,
    };
    chiudereIntervento = false;

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
    }

    onCancel(): void {
        this.modal.close({ status: 'ko', result: null });
    }

    checkUltimoMezzo(): void {
        const mezziEventi = [];
        this.listaEventi.forEach(x => mezziEventi.push(x.codiceMezzo));
        const singleValue = Array.from(new Set(mezziEventi));
        if (singleValue.length === 1) {
            this.ultimoMezzo = true;
        }
    }

    onSubmit(): void {
        this.submitted = true;

        if (!this.timeActionForm.valid) {
            return;
        }
        if (this.checkbox.Si) {
            this.chiudereIntervento = true;
        }
        this.modal.close({ status: 'ok', result: this.formatTimeForCallBack() });
    }

    formatTimeForCallBack(): any {
        return { oraEvento: this.time, dataEvento: this.todayDate, chiudereIntervento: this.chiudereIntervento };
    }

}
