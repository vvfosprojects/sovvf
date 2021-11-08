import { Injectable } from '@angular/core';

@Injectable()
export class TravelModeService {

    carParams = {
        attributeParameterValues: [
            {
                attributeName: 'Avoid Unpaved Roads',
                parameterName: 'Restriction Usage',
                value: 'AVOID_HIGH'
            },
            {
                attributeName: 'Avoid Private Roads',
                parameterName: 'Restriction Usage',
                value: 'AVOID_LOW'
            },
            {
                attributeName: 'Through Traffic Prohibited',
                parameterName: 'Restriction Usage',
                value: 'AVOID_LOW'
            },
            {
                attributeName: 'TravelTime',
                parameterName: 'Vehicle Maximum Speed (km/h)',
                value: '0'
            },
            {
                attributeName: 'Roads Under Construction Prohibited',
                parameterName: 'Restriction Usage',
                value: 'PROHIBITED'
            },
            {
                attributeName: 'Avoid Express Lanes',
                parameterName: 'Restriction Usage',
                value: 'PREFER_HIGH'
            },
            {
                attributeName: 'Avoid Carpool Roads',
                parameterName: 'Restriction Usage',
                value: 'PREFER_HIGH'
            }
        ],
        description: 'Models the movement of cars and other similar small automobiles, such as pickup trucks, and finds solutions that optimize travel distance. Travel obeys one-way roads, avoids illegal turns, and follows other rules that are specific to cars.',
        distanceAttributeName: 'Kilometers',
        id: 'iKjmHuBSIqdEfOVr',
        impedanceAttributeName: 'Kilometers',
        name: 'Driving Distance',
        restrictionAttributeNames: [
            'Avoid Unpaved Roads',
            'Avoid Private Roads',
            'Through Traffic Prohibited',
            'Roads Under Construction Prohibited',
            'Avoid Gates',
            'Avoid Express Lanes',
            'Avoid Carpool Roads'
        ],
        simplificationTolerance: 10,
        simplificationToleranceUnits: 'meters',
        timeAttributeName: 'TravelTime',
        type: 'automobile',
        useHierarchy: true,
        uturnAtJunctions: 'at-dead-ends-and-intersections'
    };
    truckParams = {
        attributeParameterValues: [
            {
                attributeName: 'Use Preferred Truck Routes',
                parameterName: 'Restriction Usage',
                value: 'PREFER_HIGH'
            },
            {
                attributeName: 'Avoid Unpaved Roads',
                parameterName: 'Restriction Usage',
                value: 'AVOID_HIGH'
            },
            {
                attributeName: 'Avoid Private Roads',
                parameterName: 'Restriction Usage',
                value: 'AVOID_LOW'
            },
            {
                attributeName: 'Roads Under Construction Prohibited',
                parameterName: 'Restriction Usage',
                value: 'PROHIBITED'
            },
            {
                attributeName: 'Avoid Gates',
                parameterName: 'Restriction Usage',
                value: 'AVOID_HIGH'
            },
            {
                attributeName: 'Avoid Express Lanes',
                parameterName: 'Restriction Usage',
                value: 'AVOID_LOW'
            },
            {
                attributeName: 'Avoid Carpool Roads',
                parameterName: 'Restriction Usage',
                value: 'AVOID_LOW'
            },
            {
                attributeName: 'Avoid Truck Restricted Roads',
                parameterName: 'Restriction Usage',
                value: 'AVOID_LOW'
            },
            {
                attributeName: 'TruckTravelTime',
                parameterName: 'Vehicle Maximum Speed (km/h)',
                value: '0'
            }
        ],
        description: 'Models basic truck travel by preferring designated truck routes, and finds solutions that optimize travel distance. Routes must obey one-way roads, avoid illegal turns, and so on.',
        distanceAttributeName: 'Kilometers',
        impedanceAttributeName: 'Kilometers',
        name: 'Trucking Distance',
        restrictionAttributeNames: [
            'Avoid Carpool Roads',
            'Avoid Express Lanes',
            'Avoid Gates',
            'Avoid Private Roads',
            'Avoid Truck Restricted Roads',
            'Avoid Unpaved Roads',
            'Roads Under Construction Prohibited',
            'Use Preferred Truck Routes'
        ],
        simplificationTolerance: 10,
        simplificationToleranceUnits: 'meters',
        timeAttributeName: 'TruckTravelTime',
        type: 'truck',
        useHierarchy: true,
        uturnAtJunctions: 'at-dead-ends-and-intersections'
    };

    getTravelModeByGenereMezzo(genereMezzo: string): any {
        switch (genereMezzo) {
            case 'AV':
                return this.carParams;
            case 'APS':
                return this.carParams;
            default:
                return this.truckParams;
        }
    }
}
