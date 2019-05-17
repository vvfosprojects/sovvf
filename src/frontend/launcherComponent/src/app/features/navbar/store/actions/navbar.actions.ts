import { AppSettings } from '../../../../shared/interface/app-settings.interface';

export class ClearDataNavbar {
    static readonly type = '[Navbar Component] Clear Data';
}

export class GetDataNavbar {
    static readonly type = '[Navbar Component] Get Data from API';
}

export class SetDataNavbar {
    static readonly type = '[Navbar Component] Set Data';

    constructor(public settings: AppSettings) {
    }
}
