import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-mezzo-actions-modal',
  templateUrl: './mezzo-actions-modal.component.html',
  styleUrls: ['./mezzo-actions-modal.component.css']
})
export class MezzoActionsModalComponent implements OnInit {

  public time = '';

  timeActionForm: FormGroup;
  submitted: boolean;

  constructor(public modal: NgbActiveModal, private fb: FormBuilder,) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.timeActionForm = this.fb.group({
      time: [ this.formatTime() , Validators.required],
    });
}

formatTime() : string {
  let r = '';
  const d = new Date();
  r += d.getHours() > 9 ? d.getHours().toString() : '0'+d.getHours();
  r += ':';
  r += d.getMinutes() > 9 ? d.getMinutes().toString() : '0'+d.getMinutes();
  return r;
}

onCancel() {
  this.modal.close({ status: 'ko', result: null });
}

onSubmit() {
  this.submitted = true;

  if (!this.timeActionForm.valid) {
      return;
  }

  this.modal.close({ status: 'ok', result: this.timeActionForm.value });
}

}
