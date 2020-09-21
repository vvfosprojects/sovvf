import { State, Selector } from '@ngxs/store';
import { ChangelogInterface } from '../../../shared/interface/changelog.interface';

export interface ChangelogStateModel {
    listaChangelog: ChangelogInterface[];
}

export const ChangelogStateDefaults: ChangelogStateModel = {
    listaChangelog: [
        {
            dataRilascio: new Date().toString(),
            descrizione: 'Questa è una descrizione di test per scrivere qualcosa di non troppo importante!',
            capitoli: [
                {
                    titolo: 'Questo è il primo capitolo',
                    descrizione: 'Benvenuti nel primo capitolo, qui ci saranno dele informazioni importanti ai fini del corretto utilizzo dell\'applicazione'
                },
                {
                    titolo: 'Questo è il secondo capitolo',
                    descrizione: 'Eccoci nel secondi capitolo, qui ci saranno dele informazioni importanti scritte nel secondo capitolo!'
                }
            ]
        },
        {
            dataRilascio: new Date().toString(),
            descrizione: 'Questa è una descrizione di test per scrivere qualcosa di non troppo importante!',
            capitoli: [
                {
                    titolo: 'Questo è il primo capitolo',
                    descrizione: 'Benvenuti nel primo capitolo, qui ci saranno dele informazioni importanti ai fini del corretto utilizzo dell\'applicazione'
                },
                {
                    titolo: 'Questo è il secondo capitolo',
                    descrizione: 'Eccoci nel secondi capitolo, qui ci saranno dele informazioni importanti scritte nel secondo capitolo!'
                }
            ]
        },
    ]
};

@State<ChangelogStateModel>({
    name: 'changelog',
    defaults: ChangelogStateDefaults
})

export class ChangelogState {
    constructor() {
    }

    @Selector()
    static listaChangelog(state: ChangelogStateModel) {
        return state.listaChangelog;
    }
}
