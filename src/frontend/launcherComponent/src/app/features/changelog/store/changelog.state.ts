import { State, Selector } from '@ngxs/store';
import { ChangelogInterface } from '../../../shared/interface/changelog.interface';

export interface ChangelogStateModel {
    listaChangelog: ChangelogInterface[];
}

export const ChangelogStateDefaults: ChangelogStateModel = {
    listaChangelog: undefined
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
