import { SlicePipe } from '@angular/common';
import { Component, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductImagePipe } from '@products/pipes/product-image-pipe';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'product-card',
  imports: [
    RouterLink,
    SlicePipe,
    ProductImagePipe
  ],
  templateUrl: './product-card.html',
})
export class ProductCard {
  title = input.required();
  description = input.required<string>();
  image = input.required<string | string[]>();
  productId = input.required<string>();
  imageUrl = linkedSignal(()=>environment.baseUrl + this.image());
 }
