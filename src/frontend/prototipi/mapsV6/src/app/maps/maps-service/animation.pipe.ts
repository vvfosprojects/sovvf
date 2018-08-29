import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'animation'
})
export class AnimationPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value ? 'BOUNCE' : null;
  }

}
