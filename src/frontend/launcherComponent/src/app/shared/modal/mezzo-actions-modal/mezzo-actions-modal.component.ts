import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-mezzo-actions-modal',
    templateUrl: './mezzo-actions-modal.component.html',
    styleUrls: ['./mezzo-actions-modal.component.css']
})
export class MezzoActionsModalComponent implements OnInit {

    public time = { hour: 13, minute: 30 };

    timeActionForm: FormGroup;
    submitted: boolean;

    constructor(public modal: NgbActiveModal, private fb: FormBuilder) {
    }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.formatTime();
        this.timeActionForm = this.fb.group({
            time: [this.time, Validators.required],
        });
    }

    formatTime() {
        const d = new Date();
        this.time.hour = d.getHours();
        this.time.minute = d.getMinutes();
    }

    onCancel() {
        this.modal.close({ status: 'ko', result: null });
    }

    onSubmit() {
        this.submitted = true;

        if (!this.timeActionForm.valid) {
            return;
        }

        this.modal.close({ status: 'ok', result: this.formatTimeForCallBack() });
    }

    formatTimeForCallBack(): any {
        return { oraEvento: this.time };
    }

}
