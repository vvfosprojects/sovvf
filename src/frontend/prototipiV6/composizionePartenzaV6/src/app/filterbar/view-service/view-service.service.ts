import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ViewInterface, ViewInterfaceButton, ViewInterfaceComposizione, ViewInterfaceLayout, ViewInterfaceMaps } from '../../shared/interface/view.interface';

@Injectable({
    providedIn: 'root'
})
export class ViewService {

    /**
     * stato iniziale
     */
    viewState: ViewInterface = {
        components: {
            richieste: true,
            mappa: true,
            chiamata: false,
            composizione: false,
        },
        layout: {
            split: true,
            columns: ['col-6', 'col-6'],
            button: {
                chiamata: 'btn-outline-success',
                buttonView: ['btn-outline-secondary', 'btn-secondary', 'btn-outline-secondary']
            },
            composizione: {
                column: 'col-5',
                disable: false,
                modalita: 'slower'
            }
        },
        maps: {
            active: 'richieste'
        },
    };

    private subject = new Subject<ViewInterface>();

    static columns(view: ViewInterface): ViewInterfaceLayout {
        const result: ViewInterfaceLayout = {
            split: true,
            columns: ['col-6', 'col-6']
        };

        if (view.layout.split) {
            result.columns = ['col-6', 'col-6'];
            result.split = true;
        } else {
            result.split = false;
            if (view.components.mappa) {
                result.columns = ['', 'col-12'];
            } else {
                result.columns = ['col-12', ''];
            }
        }

        return result;
    }

    static viewMaps(view: ViewInterface): ViewInterfaceMaps {
        const result: ViewInterfaceMaps = {
            active: 'richieste'
        };

        function getActive(object) {
            const obj = Object.assign(object);
            obj['mappa'] = false;
            const res = Object.keys(obj).find(key => obj[key] === true);
            return res ? res : result.active;
        }

        result.active = getActive(view.components);

        return result;
    }

    static colorButton(view: ViewInterface): ViewInterfaceButton {
        const result: ViewInterfaceButton = {
            chiamata: 'btn-outline-success',
            buttonView: ['btn-outline-secondary', 'btn-secondary', 'btn-outline-secondary']
        };

        if (!view.layout.split) {
            result.buttonView[0] = view.components.richieste ? 'btn-secondary' : 'btn-outline-secondary';
            result.buttonView[1] = 'btn-outline-secondary';
            result.buttonView[2] = view.components.mappa ? 'btn-secondary' : 'btn-outline-secondary';
        }

        result.chiamata = view.components.chiamata ? 'btn-danger' : 'btn-outline-success';

        return result;
    }

    static composizioneState(view: ViewInterface): ViewInterfaceComposizione {
        const result: ViewInterfaceComposizione = {
            column: 'col-5',
            disable: false,
            modalita: 'slower'
        };

        result.disable = !!view.components.composizione;
        result.column = view.components.composizione ? 'col-6' : 'col-5';

        return result;
    }

    action(view: ViewInterface): void {
        this.viewState.layout = ViewService.columns(view);
        this.viewState.maps = ViewService.viewMaps(view);
        this.viewState.layout.button = ViewService.colorButton(view);
        this.viewState.layout.composizione = ViewService.composizioneState(view);
    }

    sendView(view: ViewInterface) {
        this.viewState = view;
        this.action(view);
        this.subject.next(this.viewState);
    }

    getView(): Observable<ViewInterface> {
        return this.subject.asObservable();
    }

    switchView(event, chiamata?) {

        const view: ViewInterface = {
            components: {
                richieste: event === 'normale' || event === 'soloRichieste' || chiamata === false,
                mappa: event !== 'soloRichieste',
                composizione: event === 'composizione',
                chiamata: event === 'chiamata' && chiamata === undefined
            },
            layout: {
                split: !(event === 'soloRichieste' || event === 'soloMappa')
            }
        };

        this.sendView(view);
    }

}
