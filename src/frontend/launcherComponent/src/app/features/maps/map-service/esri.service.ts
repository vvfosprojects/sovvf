import { Injectable } from '@angular/core';
import Locator from '@arcgis/core/tasks/Locator';

@Injectable()
export class EsriService {

    locatorTask = new Locator({
        url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
    });

    async getLocationToAddress(params): Promise<any> {
        return await this.locatorTask.locationToAddress(params);
    }

}
