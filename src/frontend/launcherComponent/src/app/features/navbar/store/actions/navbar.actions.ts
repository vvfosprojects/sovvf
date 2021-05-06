import { AppSettings } from '../../../../shared/interface/app-settings.interface';

export class ClearDataNavbar {
    static readonly type = '[Navbar] Clear Data';
}

export class GetDataNavbar {
    static readonly type = '[Navbar] Get Data from API';
}

export class SetDataNavbar {
    static readonly type = '[Navbar] Set Data';

    constructor(public settings: AppSettings) {
    }
}

export class ToggleSidebarOpened {
    static readonly type = '[Navbar] Toggle Sidebar Opened';

    constructor(public value?: boolean) {
    }
}
