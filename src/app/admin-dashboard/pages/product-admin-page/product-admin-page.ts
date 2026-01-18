import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';
import { ProductDetails } from './product-details/product-details';

@Component({
  selector: 'product-admin-page',
  imports: [
    ProductDetails
  ],
  templateUrl: './product-admin-page.html',
})
export class ProductAdminPage {

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  productService = inject(ProductsService);

  urlParam = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id']))
  )

  rxProduct = rxResource({
    request: ()=>({id: this.urlParam()}),
    loader: ({request})=>{
      return this.productService.getProductById(request.id);
    }
  })

  productRedirect = effect(()=>{
    if(this.rxProduct.error()){
      this.router.navigateByUrl('/admin/products');
    }
  })
}
