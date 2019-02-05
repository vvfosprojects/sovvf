import { BoxesState as boxesState } from './states/boxes.state';
import { BoxClickState as boxClickState } from './states/box-click.state';

export const BoxesState = boxesState;
export const BoxClickState = boxClickState;

export * from './states/boxes.state';
export * from './actions/boxes.actions';

export * from './states/box-click.state';
export * from './actions/box-click.actions';
