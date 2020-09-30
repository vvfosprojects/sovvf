import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { RoutesPath } from '../../enum/routes-path.enum';

@Component({
    selector: 'app-nuove-features-info-modal',
    templateUrl: './nuove-features-info-modal.component.html',
    styleUrls: ['./nuove-features-info-modal.component.css']
})
export class NuoveFeaturesInfoModalComponent implements OnInit {

    constructor(private store: Store,
                private modal: NgbActiveModal) {
    }

    ngOnInit(): void {
    }

    goToChangelog(): void {
        this.store.dispatch(new Navigate([RoutesPath.Changelog]));
        this.close();
    }

    close(): void {
        this.modal.close({ status: 'ko' });
    }
}
