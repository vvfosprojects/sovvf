export class OpenAlertModal {
    static readonly type = '[AlertModal] OpenAlertModal';

    constructor(public title: string, public innerHTMLBody: string, public buttons: { bgColor: string, text: string }[], public timeToClose?: number) {
    }
}
