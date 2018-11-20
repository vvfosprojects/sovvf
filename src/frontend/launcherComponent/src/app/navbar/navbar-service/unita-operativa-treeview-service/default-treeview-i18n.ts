import { Injectable } from '@angular/core';
import { I18n } from '../../../i18n';
import { TreeviewI18n, TreeviewSelection } from 'ngx-treeview';


@Injectable({
    providedIn: 'root'
})
export class DefaultTreeviewI18n extends TreeviewI18n {
    constructor(
        protected i18n: I18n
    ) {
        super();
    }

    getText(selection: TreeviewSelection): string {
        if (selection.uncheckedItems.length === 0) {
            return this.i18n.language === 'en' ? 'CON' : 'CON';
        }

        switch (selection.checkedItems.length) {
            case 0:
                return this.i18n.language === 'en' ? 'Select a location' : 'Seleziona una sede';
            case 1:
                return selection.checkedItems[0].text;
            default:
                return this.i18n.language === 'en'
                    ? `${selection.checkedItems.length} selected locations`
                    : `${selection.checkedItems.length} sedi selezionate`;
        }
    }

    getAllCheckboxText(): string {
        if (this.i18n.language === 'en') {
            return 'CON';
        } else {
            return 'CON';
        }
    }

    getFilterPlaceholder(): string {
        if (this.i18n.language === 'en') {
            return 'Filter locations';
        } else {
            return 'Filtra sedi';
        }
    }

    getFilterNoItemsFoundText(): string {
        if (this.i18n.language === 'en') {
            return 'No locations found';
        } else {
            return 'Nessuna sede trovata';
        }
    }

    getTooltipCollapseExpandText(isCollapse: boolean): string {
        return isCollapse
            ? this.i18n.language === 'en' ? 'Expand' : 'Espandi'
            : this.i18n.language === 'en' ? 'Collapse' : 'Chiudi';
    }
}
