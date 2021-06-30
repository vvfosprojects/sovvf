import { PaginationInterface } from './pagination.interface';
import { BoxPartenzaPreAccoppiati } from '../../features/home/composizione-partenza/interface/box-partenza-interface';

export interface ListaComposizioneVeloce {
    dataArray: BoxPartenzaPreAccoppiati[];
    pagination: PaginationInterface;
}
