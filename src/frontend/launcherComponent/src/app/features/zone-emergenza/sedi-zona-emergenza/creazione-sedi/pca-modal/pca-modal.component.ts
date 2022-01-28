import { Component, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { ResetPcaForm } from '../../../store/actions/zone-emergenza/zone-emergenza.actions';
import { Pca } from '../../../interface/pca.interface';
import { roundToDecimal } from '../../../../../shared/helper/function-generiche';
import AddressCandidate from '@arcgis/core/tasks/support/AddressCandidate';

@Component({
    selector: 'app-pca-modal',
    templateUrl: './pca-modal.component.html',
    styleUrls: ['./pca-modal.component.css']
})
export class PcaModalComponent implements OnDestroy {

    pcaForm: FormGroup;

    constructor(public modal: NgbActiveModal,
                private formBuilder: FormBuilder,
                private store: Store) {
        this.initForm();
    }

    get f(): any {
        return this.pcaForm?.controls;
    }

    ngOnDestroy(): void {
        this.store.dispatch(new ResetPcaForm());
    }

    initForm(): void {
        this.pcaForm = this.formBuilder.group({
            codice: [null],
            nome: [null, [Validators.required]],
            indirizzo: [null, [Validators.required]],
            latitudine: [null, [Validators.required, Validators.pattern('^(\\-?)([0-9]+)(\\.)([0-9]+)$')]],
            longitudine: [null, [Validators.required, Validators.pattern('^(\\-?)([0-9]+)(\\.)([0-9]+)$')]]
        });
    }

    onSetIndirizzo(candidateValue: { candidate: AddressCandidate, candidateAttributes: any }): void {
        console.log('onSetIndirizzo', candidateValue.candidate);
        const lat = roundToDecimal(candidateValue.candidate.location.latitude, 6);
        const lng = roundToDecimal(candidateValue.candidate.location.longitude, 6);

        this.f.indirizzo.patchValue(candidateValue.candidate.address);
        this.f.latitudine.patchValue(lat);
        this.f.longitudine.patchValue(lng);
    }


    onInserisciPca(): void {
        this.close('ok', this.pcaForm.value);
    }

    close(esito: string, pca?: Pca): void {
        this.modal.close({ esito, pca });
    }
}
