import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { PermessiState } from '../../../shared/store/states/permessi/permessi.state';
import { Observable } from 'rxjs';
import { PermessiFeatureInterface } from '../../../shared/interface/permessi-feature.interface';

@Injectable({
    providedIn: 'root'
})
export class PermessiService {

    @Select(PermessiState.permessi) permessi$: Observable<PermessiFeatureInterface[]>;
    permessi: PermessiFeatureInterface[];

    constructor(private store: Store) {
        this.getPermessi();
    }

    getPermessi() {
        this.permessi$.subscribe((permessi: PermessiFeatureInterface[]) => {
            this.permessi = permessi;
        });
    }
}
