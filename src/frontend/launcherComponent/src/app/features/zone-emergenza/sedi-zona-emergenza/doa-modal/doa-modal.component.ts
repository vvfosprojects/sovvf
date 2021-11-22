import { Component, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Doa } from '../../interface/doa.interface';
import { Store } from '@ngxs/store';
import { ResetDoaForm } from '../../store/actions/zone-emergenza/zone-emergenza.actions';
import { roundToDecimal } from '../../../../shared/helper/function-generiche';
import { ModuloColonnaMobile } from '../../interface/modulo-colonna-mobile.interface';
import AddressCandidate from '@arcgis/core/tasks/support/AddressCandidate';

@Component({
    selector: 'app-doa-modal',
    templateUrl: './doa-modal.component.html',
    styleUrls: ['./doa-modal.component.css']
})
export class DoaModalComponent implements OnDestroy {

    doaForm: FormGroup;

    moduli: ModuloColonnaMobile[];

    constructor(public modal: NgbActiveModal,
                private formBuilder: FormBuilder,
                private store: Store) {
        this.initForm();
    }

    get f(): any {
        return this.doaForm?.controls;
    }

    ngOnDestroy(): void {
        this.store.dispatch(new ResetDoaForm());
    }

    initForm(): void {
        this.doaForm = this.formBuilder.group({
            codice: [null],
            nome: [null, [Validators.required]],
            indirizzo: [null, [Validators.required]],
            latitudine: [null, [Validators.required, Validators.pattern('^(\\-?)([0-9]+)(\\.)([0-9]+)$')]],
            longitudine: [null, [Validators.required, Validators.pattern('^(\\-?)([0-9]+)(\\.)([0-9]+)$')]],
            dirigente: [null, [Validators.required]],
            listaModuliColonnaMobile: [null, [Validators.required]],
            listaComuniInteressati: [null, [Validators.required]],
            listaPca: [null]
        });
    }

    onSetIndirizzo(candidate: AddressCandidate): void {
        console.log('onSetIndirizzo', candidate);
        const lat = roundToDecimal(candidate.location.latitude, 6);
        const lng = roundToDecimal(candidate.location.longitude, 6);

        this.f.indirizzo.patchValue(candidate.address);
        this.f.latitudine.patchValue(lat);
        this.f.longitudine.patchValue(lng);
    }

    onInserisciDoa(): void {
        this.close('ok', this.doaForm.value);
    }

    close(esito: string, doa?: Doa): void {
        this.modal.close({ esito, doa });
    }
}