import { Component, OnDestroy } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Doa } from '../../../interface/doa.interface';
import { Select, Store } from '@ngxs/store';
import { ResetDoaForm, UpdateModuliMobImmediataZonaEmergenza } from '../../../store/actions/zone-emergenza/zone-emergenza.actions';
import { roundToDecimal } from '../../../../../shared/helper/function-generiche';
import { ModuloColonnaMobile } from '../../../interface/modulo-colonna-mobile.interface';
import { ZonaEmergenza } from '../../../model/zona-emergenza.model';
import { ModuliColonnaMobileModalComponent } from '../../../moduli-colonna-mobile-modal/moduli-colonna-mobile-modal.component';
import { ZoneEmergenzaState } from '../../../store/states/zone-emergenza/zone-emergenza.state';
import { Observable, Subscription } from 'rxjs';
import AddressCandidate from '@arcgis/core/tasks/support/AddressCandidate';

@Component({
    selector: 'app-doa-modal',
    templateUrl: './doa-modal.component.html',
    styleUrls: ['./doa-modal.component.css']
})
export class DoaModalComponent implements OnDestroy {

    doaForm: FormGroup;

    zonaEmergenza: ZonaEmergenza;

    @Select(ZoneEmergenzaState.listaModuliImmediataZonaEmergenzaById) listaModuliImmediataZonaEmergenzaById$: Observable<ModuloColonnaMobile[]>;
    listaModuliImmediataZonaEmergenzaById: ModuloColonnaMobile[];

    private subscriptions: Subscription = new Subscription();

    constructor(public modal: NgbActiveModal,
                private formBuilder: FormBuilder,
                private store: Store,
                private modalService: NgbModal) {
        this.getListaModuliImmediataZonaEmergenzaById();
        this.initForm();
    }

    get f(): any {
        return this.doaForm?.controls;
    }

    ngOnDestroy(): void {
        this.store.dispatch(new ResetDoaForm());
    }

    getListaModuliImmediataZonaEmergenzaById(): void {
        this.subscriptions.add(
            this.listaModuliImmediataZonaEmergenzaById$.subscribe((moduli: ModuloColonnaMobile[]) => {
                this.listaModuliImmediataZonaEmergenzaById = moduli;
            })
        );
    }

    initForm(): void {
        this.doaForm = this.formBuilder.group({
            codice: [null],
            nome: [null, [Validators.required]],
            indirizzo: [null, [Validators.required]],
            latitudine: [null, [Validators.required, Validators.pattern('^(\\-?)([0-9]+)(\\.)([0-9]+)$')]],
            longitudine: [null, [Validators.required, Validators.pattern('^(\\-?)([0-9]+)(\\.)([0-9]+)$')]],
            listaModuliColonnaMobile: [null, [Validators.required]],
            listaComuniInteressati: [null, [Validators.required]],
            listaPca: [null]
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

    onColonneMobili(): void {
        const colonneMobiliEmergenzaModal = this.modalService.open(ModuliColonnaMobileModalComponent, {
            windowClass: 'modal-holder xxlModal',
            centered: true
        });

        colonneMobiliEmergenzaModal.componentInstance.zonaEmergenza = this.zonaEmergenza;
        colonneMobiliEmergenzaModal.componentInstance.fase = '1';

        colonneMobiliEmergenzaModal.result.then((result: { esito: string, moduliSelezionati: ModuloColonnaMobile[], fase: string }) => {
            switch (result.esito) {
                case 'ok':
                    switch (result.fase) {
                        case '1':
                            this.store.dispatch([
                                new UpdateModuliMobImmediataZonaEmergenza(this.zonaEmergenza, result.moduliSelezionati)
                            ]);
                            break;
                    }
                    break;
                case 'ko':
                    break;
                default:
                    break;
            }
        });
    }

    onInserisciDoa(): void {
        this.close('ok', this.doaForm.value);
    }

    close(esito: string, doa?: Doa): void {
        this.modal.close({ esito, doa });
    }
}
