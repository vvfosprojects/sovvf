import { Selector, State } from '@ngxs/store';

// Model

// Action

export interface FilterbarStateModel {
    filtri: any;
}

export const boxesStateDefaults: FilterbarStateModel = {
    filtri: null
};

@State<FilterbarStateModel>({
    name: 'filterbar',
    defaults: boxesStateDefaults
})
export class FilterbarState {

    constructor() { }

    @Selector()
    static filtri(state: FilterbarStateModel) {
        return state.filtri;
    }
}
