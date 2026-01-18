import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Pipe({
  name: 'productImage',
})
export class ProductImagePipe implements PipeTransform {

  transform(value: null | string | string[]): any {

    // null
    if(value === null){
      return `./assets/images/placeholders/no-image.jpg`;
    }

    // string: string
    if(typeof value === "string"){
      if(!value.includes("4200")){
        return `${environment.baseUrl}/files/product/${value}`;
      }
      return value;
    }

    const image = value.at(0);

    // placeholder image: ./assets/images/no-image.jpg
    if (!image){
      return `./assets/images/placeholders/no-image.jpg`;
    }

    // array > 1: primer elemento

    return `${environment.baseUrl}/files/product/${image}`;

  }

}
