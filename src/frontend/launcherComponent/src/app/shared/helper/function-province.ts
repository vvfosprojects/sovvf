import * as province from '../../../assets/province/province.json';

export function getProvinciaByCodProvincia(codProvincia: string): string {
    if (!codProvincia) {
        return '';
    }
    const provinceData = province['default']['province'][0];
    return Object.keys(provinceData).find(key => provinceData[key] === codProvincia);
}
