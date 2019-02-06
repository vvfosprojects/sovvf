import { BoxRichiesteState as boxRichiesteState } from './states/box-richieste.state';
import { BoxMezziState as boxMezziState } from './states/box-mezzi.state';
import { BoxPersonaleState as boxPersonaleState } from './states/box-personale.state';
import { BoxClickState as boxClickState } from './states/box-click.state';

export const BoxRichiesteState = boxRichiesteState;
export const BoxMezziState = boxMezziState;
export const BoxPersonaleState = boxPersonaleState;
export const BoxClickState = boxClickState;

// Boxes
export * from './states/box-richieste.state';
export * from './actions/box-richieste.actions';
export * from './states/box-mezzi.state';
export * from './actions/box-mezzi.actions';
export * from './states/box-personale.state';
export * from './actions/box-personale.actions';

// BoxClick
export * from './states/box-click.state';
export * from './actions/box-click.actions';
