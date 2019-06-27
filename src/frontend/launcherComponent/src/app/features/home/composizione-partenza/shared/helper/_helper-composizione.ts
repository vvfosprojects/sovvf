export class HelperComposizione {

    iconaStatiClass(stato: string) {
        let returnClass = '';

        switch (stato) {
            case 'In Sede':
                returnClass = 'text-secondary';
                break;
            case 'In Viaggio':
                returnClass = 'text-info';
                break;
            case 'In Rientro':
                returnClass = 'text-primary';
                break;
            case 'Sul Posto':
                returnClass = 'text-success';
                break;

            default:
                break;
        }
        return returnClass;
    }

}
