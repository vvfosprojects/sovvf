import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'competenzaFormat'
})
export class CompetenzaFormatPipe implements PipeTransform {

  transform(value: string, args?: any): string {


    let s = value;

   if(s.includes('.') && s.includes(' ')) {
    s = s.substring(0,3);
   } else if (s.includes('.')) {
      s = s.split('.').slice(0,3).join('');
   } else if (s.includes(' ')) {
      s = s.split(' ').map((e,i) => i === 0 ?  e[0] : e.substring(0,2)).join(' ');
   } else { 
      s = s.substring(0,3);
   } 
   return s;

  }
}
