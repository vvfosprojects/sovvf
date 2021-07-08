import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngxs/store';
import { AppState } from '../../../../../shared/store/states/app/app.state';
import Locator from '@arcgis/core/tasks/Locator';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';
import AddressCandidate from '@arcgis/core/tasks/support/AddressCandidate';

@Component({
    selector: 'app-ricerca-indirizzo',
    templateUrl: './ricerca-indirizzo.component.html',
    styleUrls: ['./ricerca-indirizzo.component.scss']
})
export class RicercaIndirizzoComponent implements OnInit {

    @Input() indirizzo: string;
    @Input() invalid: boolean;
    @Input() spatialReference: SpatialReference;

    @Output() selectCandidate: EventEmitter<AddressCandidate> = new EventEmitter<AddressCandidate>();

    mapProperties: { spatialReference?: SpatialReference };

    addressCandidates: AddressCandidate[];

    constructor(private store: Store) {
    }

    ngOnInit(): void {
        this.mapProperties = this.store.selectSnapshot(AppState.mapProperties);
    }

    changeIndirizzo(): void {
        console.log('changeIndirizzo debounce');
        // @ts-ignore
        const locator = new Locator('http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer');
        const indirizzo = {
            singleLine: this.indirizzo
        };

        // @ts-ignore
        locator.outSpatialReference = {
            wkid: 102100
        };
        // @ts-ignore
        locator.addressToLocations({ address: indirizzo }).then(async (addressCandidates: AddressCandidate[]) => {
            this.addressCandidates = addressCandidates.filter((address: AddressCandidate, index: number) => index < 10);
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
