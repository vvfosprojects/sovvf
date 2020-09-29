import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppFeatures } from '../../../../shared/enum/app-features.enum';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { OptionsRichieste } from '../../../../shared/enum/options-richieste';

@Component({
    selector: 'app-view-mode',
    templateUrl: './view-mode.component.html',
    styleUrls: ['./view-mode.component.css']
})
export class ViewModeComponent {

    @Input() colorButtonView = ['btn-outline-secondary', 'btn-secondary', 'btn-outline-secondary'];
    @Input() mezziInServizioActive: boolean;
    @Input() stateSwitch: boolean;
    @Input() mapStatus: boolean;
    @Input() disabledMezziInServizio: boolean;

    @Output() buttonView = new EventEmitter<AppFeatures>();
    @Output() optionRichieste = new EventEmitter<OptionsRichieste>();
    @Output() toggleMeteo: EventEmitter<boolean> = new EventEmitter();

    AppFeature = AppFeatures;
    OptionsRichieste = OptionsRichieste;
    public filtriNonImplementati: boolean = true;

    constructor(config: NgbTooltipConfig) {
        config.container = 'body';
    }

    buttonViewMode($event) {
        this.buttonView.emit($event);
    }

    buttonOptionRichieste($event) {
        this.optionRichieste.emit($event);
    }

    onChange() {
        this.toggleMeteo.emit(!this.stateSwitch);
    }

    getMezziInServizioBtnClasses() {
        let returnClasses = '';
        if (this.mezziInServizioActive) {
            returnClasses = 'btn-secondary';
        } else if (!this.mezziInServizioActive) {
            returnClasses = 'btn-outline-secondary';
        }
        if (this.disabledMezziInServizio) {
            returnClasses += ' cursor-not-allowed';
        }
        return returnClasses;
    }


}
