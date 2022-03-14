import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipologiaEmergenza, ZonaEmergenza } from '../model/zona-emergenza.model';
import { roundToDecimal } from '../../../shared/helper/function-generiche';
import { EsriService } from '../../maps/map-service/esri.service';
import AddressCandidate from '@arcgis/core/tasks/support/AddressCandidate';

@Component({
    selector: 'app-zona-emergenza-modal',
    templateUrl: './zona-emergenza-modal.component.html',
    styleUrls: ['./zona-emergenza-modal.component.css']
})
export class ZonaEmergenzaModalComponent implements OnInit {

    apertoFromMappa: boolean;
    mapPoint: any;
    lat: number;
    lon: number;
    indirizzo: number;

    allTipologieEmergenza: any[];
    tipologieEmergenza: TipologiaEmergenza[];

    zonaEmergenzaForm: FormGroup;
    zonaEmergenzaEdit: ZonaEmergenza;

    constructor(public modal: NgbActiveModal,
                private formBuilder: FormBuilder,
                private esriService: EsriService) {
        this.initForm();
    }

    get f(): any {
        return this.zonaEmergenzaForm?.controls;
    }

    ngOnInit(): void {
        if (this.apertoFromMappa) {
            // Params per il servizio "locationToAddress"
            const location = this.mapPoint;
            const params = {
                location
            };

            // Trovo l'indirizzo tramite le coordinate
            this.esriService.getLocationToAddress(params).then((response) => {
                this.indirizzo = response.attributes.Match_addr;
                this.patchIndirizzo();
            });
        }

        if (this.zonaEmergenzaEdit) {
            this.patchForm();
        }
    }

    initForm(): void {
        this.zonaEmergenzaForm = this.formBuilder.group({
            indirizzo: [null, Validators.required],
            latitudine: [null, [Validators.required, Validators.pattern('^(\\-?)([0-9]+)(\\.)([0-9]+)$')]],
            longitudine: [null, [Validators.required, Validators.pattern('^(\\-?)([0-9]+)(\\.)([0-9]+)$')]],
            tipologia: [null, [Validators.required]],
            descrizione: [null, [Validators.required]],
            id: [null],
            codEmergenza: [null],
            codComandoRichiedente: [null],
            listaEventi: [null],
            annullata: [null],
            allertata: [null],
            listaModuliImmediata: [null],
            listaModuliConsolidamento: [null],
            listaModuliPotInt: [null],
            tipologieModuli: [null]
        });
    }

    onSetIndirizzo(candidateValue: { candidate: AddressCandidate, candidateAttributes: any }): void {
        const lat = roundToDecimal(candidateValue.candidate.location.latitude, 6);
        const lng = roundToDecimal(candidateValue.candidate.location.longitude, 6);

        this.f.indirizzo.patchValue(candidateValue.candidate.address);
        this.f.latitudine.patchValue(lat);
        this.f.longitudine.patchValue(lng);
    }

    patchIndirizzo(): void {
        this.zonaEmergenzaForm.patchValue({
            indirizzo: this.indirizzo,
            latitudine: this.lat,
            longitudine: this.lon
        });
        this.f.indirizzo.disable();
        this.f.latitudine.disable();
        this.f.longitudine.disable();
    }

    patchForm(): void {
        this.zonaEmergenzaForm.patchValue({
            indirizzo: this.zonaEmergenzaEdit.localita.indirizzo,
            latitudine: this.zonaEmergenzaEdit.localita.coordinate.latitudine,
            longitudine: this.zonaEmergenzaEdit.localita.coordinate.longitudine,
            tipologia: this.zonaEmergenzaEdit.tipologia.emergenza[0],
            descrizione: this.zonaEmergenzaEdit.descrizione,
            id: this.zonaEmergenzaEdit.id,
            codEmergenza: this.zonaEmergenzaEdit.codEmergenza,
            codComandoRichiedente: this.zonaEmergenzaEdit.codComandoRichiedente,
            listaEventi: this.zonaEmergenzaEdit.listaEventi,
            annullata: this.zonaEmergenzaEdit.annullata,
            allertata: this.zonaEmergenzaEdit.allertata,
            listaModuliImmediata: this.zonaEmergenzaEdit.listaModuliImmediata,
            listaModuliConsolidamento: this.zonaEmergenzaEdit.listaModuliConsolidamento,
            listaModuliPotInt: this.zonaEmergenzaEdit.listaModuliPotInt
        });
        this.f.tipologia.disable();
    }

    getTipologieModuliByDescTipologiaEmergenza(): string[] {
        let tipologieModuli: string[];
        const descTipologiaEmergenzaSelezionata = this.f?.tipologia?.value;
        if (descTipologiaEmergenzaSelezionata) {
            this.tipologieEmergenza.forEach((t: TipologiaEmergenza) => {
                if (t.emergenza.indexOf(descTipologiaEmergenzaSelezionata) !== -1) {
                    tipologieModuli = t.moduli.mob_Immediata;
                }
            });
        }
        return tipologieModuli;
    }

    close(esito: string): void {
        this.modal.close(esito);
    }
}
