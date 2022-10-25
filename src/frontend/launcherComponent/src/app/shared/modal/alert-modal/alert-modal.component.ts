import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-alert-modal',
    templateUrl: './alert-modal.component.html',
    styleUrls: ['./alert-modal.component.css']
})
export class AlertModalComponent implements OnInit {

    title: string;
    buttons: { bgColor: string, text: string }[];
    timeToClose: number;
    timeoutTimeToClose: NodeJS.Timeout;
    innerHTMLBody: InnerHTML;

    constructor(private modal: NgbActiveModal) {
    }

    ngOnInit(): void {
        if (this.timeToClose) {
            this.startTimeToCloseTimeout();
        }
    }

    startTimeToCloseTimeout(): void {
        this.timeoutTimeToClose = setTimeout(() => {
            this.close();
        }, this.timeToClose);
    }

    onClose(): void {
        this.close();
    }

    close(): void {
        this.modal.close();
    }

}
