import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngxs/store';
import { AppState } from '../../../store/states/app/app.state';
import { AuthState } from '../../../../features/auth/store/auth.state';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';
import AddressCandidate from '@arcgis/core/tasks/support/AddressCandidate';
import Point from '@arcgis/core/geometry/Point';
import * as Locator from '@arcgis/core/rest/locator';
import SuggestionResult = __esri.SuggestionResult;
import locatorAddressToLocationsParams = __esri.locatorAddressToLocationsParams;
import locatorSuggestLocationsParams = __esri.locatorSuggestLocationsParams;

@Component({
    selector: 'app-ricerca-indirizzo',
    templateUrl: './ricerca-indirizzo.component.html',
    styleUrls: ['./ricerca-indirizzo.component.scss']
})
export class RicercaIndirizzoComponent implements OnInit {

    @Input() indirizzo: string;
    @Input() invalid: boolean;
    @Input() spatialReference: SpatialReference;

    @Output() changeIndirizzo: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() selectCandidate: EventEmitter<AddressCandidate> = new EventEmitter<AddressCandidate>();

    mapProperties: { spatialReference?: SpatialReference };

    addressCandidates: AddressCandidate[];

    constructor(private changeDetectorRef: ChangeDetectorRef,
                private store: Store) {
    }

    ngOnInit(): void {
        this.mapProperties = this.store.selectSnapshot(AppState.mapProperties);
    }

    onChangeIndirizzo(): boolean {
        if (!this.indirizzo) {
            this.addressCandidates = [];
            return false;
        }

        const indirizzo = this.indirizzo;
        const urlServiceGeocode = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer';

        const sedeUtenteLoggato = this.store.selectSnapshot(AuthState.currentUser)?.sede;
        let location: Point;
        let paramsSuggestLocation: locatorSuggestLocationsParams;

        if (sedeUtenteLoggato) {
            const latitude = sedeUtenteLoggato.coordinate.latitudine;
            const longitude = sedeUtenteLoggato.coordinate.longitudine;
            location = new Point({
                latitude,
                longitude
            });
        }
        paramsSuggestLocation = {
            url: urlServiceGeocode,
            location,
            text: indirizzo
        } as locatorSuggestLocationsParams;
        Locator.suggestLocations(urlServiceGeocode, paramsSuggestLocation).then(async (suggestionResults: SuggestionResult[]) => {
            this.addressCandidates = [];
            const addressToLocationsPromises = [];

            for (const suggestionResult of suggestionResults) {
                const paramsAddressToLocations = {
                    url: urlServiceGeocode,
                    magicKey: suggestionResult.magicKey,
                    address: indirizzo
                } as locatorAddressToLocationsParams;
                addressToLocationsPromises.push(
                    Locator.addressToLocations(urlServiceGeocode, paramsAddressToLocations).then(async (addressCandidates: AddressCandidate[]) => {
                        return addressCandidates;
                    })
                );
            }

            Promise.all(addressToLocationsPromises).then((promisesResult: any[]) => {
                for (const promiseResult of promisesResult) {
                    this.addressCandidates.push(promiseResult[0]);
                    this.changeDetectorRef.detectChanges();
                }
                return true;
            });
        });
    }

    onSelectCandidate(candidate: AddressCandidate): void {
        this.selectCandidate.emit(candidate);
        this.resetAddressCandidates();
    }

    resetAddressCandidates(): void {
        this.addressCandidates = null;
    }
}
