import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';
import { ProductCarousel } from "@products/components/product-carousel/product-carousel";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarousel],
  templateUrl: './product-page.html',
})
export class ProductPage {
    activatedRoute = inject(ActivatedRoute)
    productIdSlug =  this.activatedRoute.snapshot.params['idSlug']; //Parámetro de la ruta activa
    productsService = inject(ProductsService);
  // rxResource

  productResource = rxResource({
    request: ()=>({
      query: this.productIdSlug
    }),
    loader: ({request})=>{
     return this.productsService.getProductByIdSlug(request.query);
    }
  });
 }
