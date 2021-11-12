import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipologiaEmergenza, ZonaEmergenza } from '../model/zona-emergenza.model';
import Locator from '@arcgis/core/tasks/Locator';

@Component({
    selector: 'app-zona-emergenza-modal',
    templateUrl: './zona-emergenza-modal.component.html',
    styleUrls: ['./zona-emergenza-modal.component.css']
})
export class ZonaEmergenzaModalComponent implements OnInit {

    mapPoint: any;
    lat: number;
    lon: number;
    tipologieEmergenza: TipologiaEmergenza[];

    indirizzo: number;

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
            dirigenti: [null],
            id: [null],
            codEmergenza: [null],
            codComandoRichiedente: [null],
            listaEventi: [null],
            annullata: [null],
            allertata: [null],
            listaModuliImmediata: [null],
            listaModuliConsolidamento: [null],
            listaModuliPotInt: [null]
        });
    }

    patchIndirizzo(): void {
        this.zonaEmergenzaForm.patchValue({
            indirizzo: this.indirizzo,
            latitudine: this.lat,
            longitudine: this.lon
        });
    }

    patchForm(): void {
        this.zonaEmergenzaForm.patchValue({
            indirizzo: this.zonaEmergenzaEdit.localita.indirizzo,
            latitudine: this.zonaEmergenzaEdit.localita.coordinate.latitudine,
            longitudine: this.zonaEmergenzaEdit.localita.coordinate.longitudine,
            tipologia: this.zonaEmergenzaEdit.tipologia.emergenza[0],
            descrizione: this.zonaEmergenzaEdit.descrizione,
            dirigenti: this.zonaEmergenzaEdit.dirigenti,
            id: this.zonaEmergenzaEdit.id,
            codEmergenza: this.zonaEmergenzaEdit.codEmergenza,
            codComandoRichiedente: this.zonaEmergenzaEdit.codComandoRichiedente,
            listaEventi: this.zonaEmergenzaEdit.listaEventi,
            annullata: this.zonaEmergenzaEdit.annullata,
            allertata: this.zonaEmergenzaEdit.allertata,
            listaModuliImmediata: this.zonaEmergenzaEdit.listaModuliImmediata,
            listaModuliConsolidamento: this.zonaEmergenzaEdit.listaModuliConsolidamento,
            listaModuliPotInt: this.zonaEmergenzaEdit.listaModuliPotInt,
        });
        this.f.tipologia.disable();
    }

    close(esito: string): void {
        this.modal.close(esito);
    }
}
