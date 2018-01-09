import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'swedishCurrency'
})
export class SwedishCurrencyPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let stringValue = Math.round(value).toString();
    if(stringValue.length < 4){
      return stringValue + " kr";
    }
    let offset = stringValue.length % 3;
    let numberOfOffsets = (stringValue.length - offset) / 3;
    let offsetPositions = new Array();
    for(let i = 0; i < numberOfOffsets; i++){
      stringValue = stringValue.slice(0, offset + 3 * i + i) + " " + stringValue.slice(offset + 3 * i + i);
    }
    return stringValue + " kr";
  }

}
