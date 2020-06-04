import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VersionInterface } from '../../../shared/interface/version.interface';
import { environment } from '../../../../environments/environment';
import { Store } from '@ngxs/store';
import { SetCurrentVersion, SetNewVersion } from '../../../shared/store/actions/nuova-versione/nuova-versione.actions';

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
        const url = environment.versionCheckURL;
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
        this.http.get<VersionInterface>(url + '?t=' + new Date().getTime())
            .subscribe(
                (response: VersionInterface) => {
                    if (response) {
                        first ? this.currentVersion(response) : this.newVersion(response);
                    }
                },
                () => {
                    if (first) {
                        this.currentVersion({ number: 'err', hash: 'hash', date: null});
                    }
                }
            );

    }

    newVersion(version: VersionInterface) {
        this.store.dispatch(new SetNewVersion(version));
    }

    currentVersion(version: VersionInterface) {
        this.store.dispatch(new SetCurrentVersion(version));
    }

}
