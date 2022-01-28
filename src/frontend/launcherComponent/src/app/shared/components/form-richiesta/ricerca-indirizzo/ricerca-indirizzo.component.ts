import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
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
    @Input() requiredField = true;
    @Input() requiredFieldClass = true;
    @Input() invalid: boolean;
    @Input() spatialReference: SpatialReference;

    @Output() changeIndirizzo: EventEmitter<string> = new EventEmitter<string>();
    @Output() selectCandidate: EventEmitter<{ candidate: AddressCandidate, candidateAttributes: any }> = new EventEmitter<{ candidate: AddressCandidate, candidateAttributes: any }>();
    mapProperties: { spatialReference?: SpatialReference };

    indirizzoBackup: string;
    loadingAddressCandidates: boolean;

    hideAddressCandidates: boolean;
    addressCandidates: AddressCandidate[];
    indexSelectedAddressCandidate = 0;

    @HostListener('document:click', ['$event'])
    clickOutside(event): void {
        this.hideAddressCandidates = !this.eRef.nativeElement.contains(event.target);
    }

    constructor(private store: Store,
                private changeDetectorRef: ChangeDetectorRef,
                private eRef: ElementRef) {
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowDown':
                    const newIndexValueDown = this.indexSelectedAddressCandidate + 1;
                    this.setIndexSelectedAddressCandidate(newIndexValueDown);
                    break;
                case 'ArrowUp':
                    const newIndexValueUp = this.indexSelectedAddressCandidate - 1;
                    this.setIndexSelectedAddressCandidate(newIndexValueUp);
                    break;
                case 'Enter':
                    if (this.addressCandidates?.length) {
                        e.preventDefault();
                        const candidate = this.addressCandidates[this.indexSelectedAddressCandidate];
                        this.onSelectCandidate(candidate);
                    }
            }
        });
    }

    ngOnInit(): void {
        this.mapProperties = this.store.selectSnapshot(AppState.mapProperties);
    }

    onKeyUp(): void {
        this.changeIndirizzo.emit(this.indirizzo);


        if (this.requiredField && this.indirizzo !== this.indirizzoBackup) {
            this.loadingAddressCandidates = true;
        }

        this.indirizzoBackup = this.indirizzo;
    }

    onKeyUpDebounce(): boolean {
        if (this.requiredField) {
            this.setIndexSelectedAddressCandidate(0);

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
                location,
                text: indirizzo,
                countryCode: 'IT',
                categories: ['address', 'Historical Monument', 'Art Gallery', 'Art Museum', 'Museum', 'Ruin', 'Intersection']
                // https://developers.arcgis.com/rest/geocode/api-reference/geocoding-category-filtering.htm
            } as locatorSuggestLocationsParams;
            // paramsSuggestLocation.searchTemplate = "{County}, {State}";

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
                    this.loadingAddressCandidates = false;
                    return true;
                });
            });
        }
    }

    setIndexSelectedAddressCandidate(i: number): void {
        if (i >= 0 && i <= (this.addressCandidates?.length - 1)) {
            this.indexSelectedAddressCandidate = i;
        }
    }

    onSelectCandidate(candidate: AddressCandidate): void {
        const latitude = candidate.location.latitude;
        const longitude = candidate.location.longitude;
        const locationPOI = new Point({
            latitude,
            longitude
        });

        const params = {
            location: locationPOI
        };
        // @ts-ignore
        Locator.locationToAddress('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer', params).then((response: supportAddressCandidate) => {
            this.selectCandidate.emit({ candidate, candidateAttributes: response.attributes });
            this.resetAddressCandidates();
        });
    }

    resetAddressCandidates(): void {
        this.addressCandidates = null;
    }

    getSelectIndirizzoOpen(): boolean {
        return !!(this.addressCandidates?.length) && !this.hideAddressCandidates;
    }
}
