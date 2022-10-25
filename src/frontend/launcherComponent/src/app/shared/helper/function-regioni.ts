import * as dirRegionali from '../../../assets/dirRegionali/dirRegionali.json';

export function getRegioneByCodDirRegionale(codDirRegionale: string): string {
    if (!codDirRegionale) {
        return '';
    }
    const dirRegionaliData = dirRegionali['default']['dirRegionali'][0];
    return Object.keys(dirRegionaliData).find(key => dirRegionaliData[key] === codDirRegionale);
}
