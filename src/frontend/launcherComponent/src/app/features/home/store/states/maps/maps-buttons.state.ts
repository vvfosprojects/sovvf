import { Action, Selector, State, StateContext } from '@ngxs/store';
import { CentraMappaButton, ToggleAnimationButton } from '../../actions/maps/maps-buttons.actions';
import { GetInitCentroMappa } from '../../actions/maps/centro-mappa.actions';
import { ButtonControlAnimation } from '../../../maps/maps-interface/maps-custom-buttons';

export interface MapsButtonsStateModel {
    controlAnimation: ButtonControlAnimation;
}

export const mapsButtonsStateDefaults: MapsButtonsStateModel = {
    controlAnimation: {
        toggleStatus: false,
        toggleMsg: 'Ferma animazione',
        faIcon: 'fa-stop-circle'
    }
};

@State<MapsButtonsStateModel>({
    name: 'mapsButton',
    defaults: mapsButtonsStateDefaults
})
export class MapsButtonsState {

    @Selector()
    static controlAnimation(state: MapsButtonsStateModel): ButtonControlAnimation {
        return state.controlAnimation;
    }

    @Action(CentraMappaButton)
    centraMappaButton({ dispatch }: StateContext<MapsButtonsStateModel>) {
        dispatch(new GetInitCentroMappa());
    }

    @Action(ToggleAnimationButton)
    toggleAnimationButton({ getState, patchState }: StateContext<MapsButtonsStateModel>) {
        const state = getState();
        if (!state.controlAnimation.toggleStatus) {
            patchState({
                controlAnimation: {
                    toggleStatus: true,
                    toggleMsg: 'Ripristina animazione',
                    faIcon: 'fa-play-circle'
                }
            });
        } else {
            patchState({
                controlAnimation: mapsButtonsStateDefaults.controlAnimation
            });
        }
    }
}
