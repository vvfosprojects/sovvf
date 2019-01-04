import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { TipologieService } from '../../shared/tipologie/tipologie.service';
import { ViewService } from '../../filterbar/view-service/view-service.service';
import { ClipboardService } from 'ngx-clipboard';
import { Localita } from 'src/app/shared/model/localita.model';
import { Coordinate } from 'src/app/shared/model/coordinate.model';
import * as MapManager from '../../core/manager/maps-manager';
import { ChiamataMarker } from '../../maps/maps-model/chiamata-marker.model';
import { MarkerService } from '../../maps/service/marker-service/marker-service.service';
import { CenterService } from '../../maps/service/center-service/center-service.service';
import { CentroMappa } from '../../maps/maps-model/centro-mappa.model';
import { FormChiamataModel } from './model/form-scheda-telefonata.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

const ANIMATION_TIME = 1500;

@Component({
    selector: 'app-scheda-telefonata',
    templateUrl: './scheda-telefonata.component.html',
    styleUrls: ['./scheda-telefonata.component.css'],
    animations: [
        trigger('hideShowAnimator', [
            state('opened', style({ opacity: 1 })),
            state('closed', style({ opacity: 0 })),
            state('left', style({ opacity: 0, transform: 'scale(0)' })),
            transition('closed => opened', [
                animate(ANIMATION_TIME + 'ms cubic-bezier(0.075, 0.82, 0.165, 1)')
            ]),
            transition('opened => left', [
                animate(ANIMATION_TIME - 1000 + 'ms cubic-bezier(0.95, 0.05, 0.795, 0.035)')
            ])
        ])

    ]
})
export class SchedaTelefonataComponent implements OnInit, OnDestroy {
    chiamataForm: FormGroup;
    submitted = false;
    subscription = new Subscription();

    chiamataCorrente = new FormChiamataModel();
    coords: Localita;
    tipologie: any;
    hideShowAnimator = 'closed';
    options: any;
    animationTime = ANIMATION_TIME;

    centroMappa: CentroMappa;

    constructor(private tipologieS: TipologieService,
                private viewService: ViewService,
                private _clipboardService: ClipboardService,
                private chiamataManager: MapManager.ChiamataMarkerManagerService,
                private markerService: MarkerService,
                private centerService: CenterService,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.subscription.add(
            this.tipologieS.getTipologie().subscribe(t => {
                this.tipologie = t;
                setTimeout(() => {
                    this.hideShowAnimator = 'opened';
                }, 1);
            }));

        this.chiamataForm = this.formBuilder.group({
            dettaglioTipologia: ['', [Validators.required]],
            cognome: ['', [Validators.required]],
            nome: ['', [Validators.required]],
            ragioneSociale: ['', [Validators.required]],
            telefono: ['', [Validators.required]],
            indirizzo: ['', [Validators.required]],
        });

        this.centroMappa = this.centerService.centroMappaIniziale;
        this.subscription.add(
            this.centerService.getCentro().subscribe(r => {
                if (this.coords) {
                    const xyChiamata = [Math.floor(this.coords.coordinate.latitudine * 1000) / 1000, Math.floor(this.coords.coordinate.longitudine * 1000) / 1000];
                    const xyCentro = [Math.floor(r.coordinate.latitudine * 1000) / 1000, Math.floor(r.coordinate.longitudine * 1000) / 1000];
                    if (xyChiamata[0] !== xyCentro[0] && xyChiamata[1] !== xyCentro[1]) {
                        this.centroMappa = r;
                    }
                }
            })
        );

    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        isDevMode() && console.log('Il componente chiamata è distrutto');
    }

    onAddTipologia(tipologia) {
        this.chiamataCorrente.tipoIntervento.push(tipologia);
    }

    onRemoveTipologia(tipologia) {
        this.chiamataCorrente.tipoIntervento.splice(this.chiamataCorrente.tipoIntervento.indexOf(tipologia.value), 1);
    }

    insertRagioneSociale(RS) {
        this.chiamataCorrente.ragioneSociale = RS;
    }

    handleAddressChange(result) {
        this.coords = new Localita(new Coordinate(result.geometry.location.lat(), result.geometry.location.lng()));
        this.chiamataCorrente.coordinate = this.coords;
        const markerChiamataCorrente = new ChiamataMarker('RM-004', this.coords);
        this.chiamataManager.chiamataMarker[0] = markerChiamataCorrente;
        this.markerService.chiamata(markerChiamataCorrente, 'centra');
    }

    copy(lat: number, lng: number) {
        const copiedText = lat.toString() + ', ' + lng.toString();
        this._clipboardService.copyFromContent(copiedText);
    }

    annullaChiamata() {
        setTimeout(() => {
            this.hideShowAnimator = 'left';
        }, 1);
        setTimeout(() => {
            this.viewService.sendView({
                richieste: true,
                mappa: true,
                comp_partenza: false,
                split: true,
                chiamata: false,
            });
            this.chiamataManager.chiamataMarker[0] = new ChiamataMarker('RM-004', new Localita(new Coordinate(null, null)));
            this.markerService.chiamata(null, '', this.centroMappa);
        }, this.animationTime - 1200);

    }

    get f() {
        return this.chiamataForm.controls;
    }

    onSubmit() {
        this.submitted = true;

        if (this.chiamataForm.invalid) {
            return;
        }

        console.log('Chiamata inserita: ' + JSON.stringify(this.chiamataCorrente));
    }

}
