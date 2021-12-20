import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipologiaEmergenza, ZonaEmergenza } from '../model/zona-emergenza.model';
import { roundToDecimal } from '../../../shared/helper/function-generiche';
import Locator from '@arcgis/core/tasks/Locator';
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
                private formBuilder: FormBuilder) {
        this.initForm();
    }

    get f(): any {
        return this.zonaEmergenzaForm?.controls;
    }

    ngOnInit(): void {
        if (this.apertoFromMappa) {
            // Imposto l'url al servizio che mi restituisce l'indirizzo tramite lat e lon
            const locatorTask = new Locator({
                url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
            });

            // Params per il servizio "locationToAddress"
            const location = this.mapPoint;
            const params = {
                location
            };

            // Trovo l'indirizzo tramite le coordinate
            locatorTask.locationToAddress(params).then((response) => {
                console.log('locationToAddress response', response);
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

    onSetIndirizzo(candidate: AddressCandidate): void {
        const lat = roundToDecimal(candidate.location.latitude, 6);
        const lng = roundToDecimal(candidate.location.longitude, 6);

        this.f.indirizzo.patchValue(candidate.address);
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
