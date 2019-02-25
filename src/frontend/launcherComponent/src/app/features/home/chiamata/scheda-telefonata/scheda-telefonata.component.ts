import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Localita } from 'src/app/shared/model/localita.model';
import { Coordinate } from 'src/app/shared/model/coordinate.model';
import { FormChiamataModel } from '../model/form-scheda-telefonata.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { TipologieInterface } from '../../../../core/settings/tipologie';
import { SchedaTelefonataInterface } from '../model/scheda-telefonata.interface';

@Component({
    selector: 'app-scheda-telefonata',
    templateUrl: './scheda-telefonata.component.html',
    styleUrls: ['./scheda-telefonata.component.css']
})
export class SchedaTelefonataComponent implements OnInit {

    options = {
        componentRestrictions: { country: ['IT', 'FR', 'AT', 'CH', 'SI'] }
    };
    chiamataCorrente = new FormChiamataModel();
    chiamataForm: FormGroup;
    submitted = false;

    @Input() tipologie: TipologieInterface[];
    @Input() idChiamata: string;
    @Output() schedaTelefonata = new EventEmitter<SchedaTelefonataInterface>();

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.chiamataCorrente.numeroChiamata = this.idChiamata;
        this.chiamataForm = this.createForm();
    }

    createForm(): FormGroup {
        return this.formBuilder.group({
            // dettaglioTipologia: ['', [Validators.required]],
            cognome: ['', [Validators.required]],
            nome: ['', [Validators.required]],
            ragioneSociale: ['', [Validators.required]],
            telefono: ['', [Validators.required]],
            indirizzo: ['', [Validators.required]],
        });
    }

    get f() {
        return this.chiamataForm.controls;
    }

    onAddTipologia(tipologia) {
        this.chiamataCorrente.tipoIntervento.push(tipologia);
    }

    onRemoveTipologia(tipologia) {
        this.chiamataCorrente.tipoIntervento.splice(this.chiamataCorrente.tipoIntervento.indexOf(tipologia.value), 1);
    }

    insertRagioneSociale(RS) {
        this.f.ragioneSociale.setValue(RS);
    }

    onAnnullaChiamata(): void {
        this.chiamataCorrente = null;
        this._statoChiamata('annullata');
    }

    onCopiaIndirizzo(): void {
        this._statoChiamata('copiaIndirizzo');
    }

    onCercaIndirizzo(result: Address): void {
        this.chiamataCorrente.localita = new Localita(new Coordinate(result.geometry.location.lat(), result.geometry.location.lng()), result.formatted_address);
        this._statoChiamata('cerca');
    }

    onSubmit() {
        this.submitted = true;
        if (this.chiamataForm.invalid) {
            console.error('Il form non è valido');
            this.submitted = false;
            return;
        }
        this._statoChiamata('inserita');
    }


    _statoChiamata(azione: string) {
        this.schedaTelefonata.emit({
            azione: azione,
            chiamata: this.chiamataCorrente
        });
    }

}
