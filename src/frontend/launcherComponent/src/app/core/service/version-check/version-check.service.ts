import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VersionResponseInterface } from '../../../shared/interface/version-response.interface';
import { environment } from '../../../../environments/environment';
import { Store } from '@ngxs/store';
import { SetCurrentVersion, SetNewVersion } from '../../../shared/store/actions/nuova-versione/nuova-versione.actions';
import { catchError } from 'rxjs/operators';
import { handleError } from '../../../shared/helper/handleError';

@Injectable({
    providedIn: 'root'
})
export class VersionCheckService {

    constructor(private http: HttpClient, private store: Store) {
    }

    /**
     * Checks in every set frequency the version of frontend application
     * @param {number} frequency - in milliseconds
     */
    public initVersionCheck(frequency = 30): void {
        const url = environment.versionCheckURL + '?t=' + new Date().getTime();
        const frequencyRate = 1000 * 60 * frequency;
        setInterval(() => {
            this.checkVersion(url);
        }, frequencyRate);
        this.checkVersion(url, true);
    }

    /**
     * Will do the call and check if the hash has changed or not
     * @param url
     * @param first is used for first check
     */
    private checkVersion(url: string, first?: boolean): void {
        this.http.get<VersionResponseInterface>(url).pipe(
            catchError(handleError)
            )
            .subscribe(
                (response: VersionResponseInterface) => {
                    if (response) {
                        first ? this.currentVersion(response.hash) : this.newVersion(response.hash);
                    }
                },
                () => {
                    if (first) {
                        this.currentVersion('current version');
                    }
                }
            );

    }

    newVersion(hash: string) {
        this.store.dispatch(new SetNewVersion(hash));
    }

    currentVersion(hash: string) {
        this.store.dispatch(new SetCurrentVersion(hash));
    }

}
