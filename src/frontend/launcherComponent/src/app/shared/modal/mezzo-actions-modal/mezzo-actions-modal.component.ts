import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-mezzo-actions-modal',
    templateUrl: './mezzo-actions-modal.component.html',
    styleUrls: ['./mezzo-actions-modal.component.css']
})
export class MezzoActionsModalComponent implements OnInit {

    public time = { hour: 13, minute: 30, second: 0 };

    timeActionForm: FormGroup;
    submitted: boolean;

    constructor(public modal: NgbActiveModal, private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.initForm();
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

    onCancel(): void {
        this.modal.close({ status: 'ko', result: null });
    }

    onSubmit(): void {
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
