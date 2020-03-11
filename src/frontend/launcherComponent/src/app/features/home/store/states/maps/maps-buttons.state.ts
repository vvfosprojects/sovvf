import { Action, Select, Selector, State, StateContext } from '@ngxs/store';
import { ForceActiveAnimation, CentraMappaButton, ToggleAnimation, ToggleAnimationButton } from '../../actions/maps/maps-buttons.actions';
import { GetInitCentroMappa } from '../../actions/maps/centro-mappa.actions';
import { ButtonControlAnimation } from '../../../maps/maps-interface/maps-custom-buttons';
import { MapsFiltroState } from './maps-filtro.state';
import { Observable } from 'rxjs';

export interface MapsButtonsStateModel {
    controlAnimation: ButtonControlAnimation;
    bounceAnimation: boolean;
    prevState: boolean;
}

export const mapsButtonsStateDefaults: MapsButtonsStateModel = {
    controlAnimation: {
        toggleStatus: false,
        toggleMsg: 'Ferma animazione',
        faIcon: 'fa-stop-circle',
        disabled: false
    },
    bounceAnimation: false,
    prevState: false
};

@State<MapsButtonsStateModel>({
    name: 'mapsButton',
    defaults: mapsButtonsStateDefaults
})
export class MapsButtonsState {

    @Select(MapsFiltroState.filtroMarkerAttivo) filtroMarkerAttivo$: Observable<string[]>;

    @Selector()
    static controlAnimation(state: MapsButtonsStateModel): ButtonControlAnimation {
        return state.controlAnimation;
    }

    @Selector()
    static bounceAnimationStatus(state: MapsButtonsStateModel): boolean {
        return state.bounceAnimation;
    }

    @Action(CentraMappaButton)
    centraMappaButton({ dispatch }: StateContext<MapsButtonsStateModel>) {
        dispatch(new GetInitCentroMappa());
    }

    @Action(ToggleAnimationButton)
    toggleAnimationButton({ getState, patchState, dispatch }: StateContext<MapsButtonsStateModel>, action: ToggleAnimationButton) {
        let richiesteIsOn = true;
        this.filtroMarkerAttivo$.subscribe((result: string[]) => {
            if (!result.includes('richiesta') && result.length > 0) {
                richiesteIsOn = false;
            }
        });
        const state = getState();
        if (richiesteIsOn && !action.fix) {
            if (!state.controlAnimation.toggleStatus) {
                patchState({
                    controlAnimation: {
                        toggleStatus: true,
                        toggleMsg: 'Ripristina animazione',
                        faIcon: 'fa-play-circle'
                    },
                    prevState: true
                });
            } else {
                patchState({
                    controlAnimation: mapsButtonsStateDefaults.controlAnimation,
                    prevState: mapsButtonsStateDefaults.prevState
                });
                // dispatch(new ToggleAnimation());
            }
        } else if (!richiesteIsOn && !state.prevState) {
            patchState({
                controlAnimation: {
                    toggleStatus: true,
                    toggleMsg: mapsButtonsStateDefaults.controlAnimation.toggleMsg,
                    faIcon: mapsButtonsStateDefaults.controlAnimation.faIcon,
                    disabled: true
                }
            });
        } else if (!state.prevState) {
            patchState({
                controlAnimation: mapsButtonsStateDefaults.controlAnimation
            });
        }
    }

    @Action(ForceActiveAnimation)
    forceActiveAnimation({ getState, patchState, dispatch }: StateContext<MapsButtonsStateModel>) {
        const state = getState();
        if (state.controlAnimation.toggleStatus) {
            patchState(mapsButtonsStateDefaults);
        }
        // dispatch(new ToggleAnimation());
    }

    @Action(ToggleAnimation)
    toggleAnimation({ getState, patchState }: StateContext<MapsButtonsStateModel>) {

        patchBounceAnimation();

        setTimeout(() => {
            patchBounceAnimation();
        }, 2000);

        function patchBounceAnimation() {
            patchState({
                bounceAnimation: !getState().bounceAnimation
            });
        }
    }
}
