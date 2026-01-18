import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { map, tap } from 'rxjs';
import { ProductCard } from "@products/components/product-card/product-card";
import { I18nSelectPipe } from '@angular/common';
import { Pagination } from "@shared/components/pagination/pagination";
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [
    ProductCard,
    I18nSelectPipe,
    Pagination
],
  templateUrl: './gender-page.html',
})
export class GenderPage {
  activatedRoute = inject(ActivatedRoute);
  productsService = inject(ProductsService);

  paginationService = inject(PaginationService);

  genderMap = {
    men: 'hombres',
    women: 'mujeres',
    kids: 'niños'
  }


  gender = toSignal(
    this.activatedRoute.params.pipe(
      map(({gender})=> gender),

      // tap((data)=> console.log(data))
    )
  )



  genderResource = rxResource({
    request: ()=>({gender: this.gender(), page: this.paginationService.pageParam() - 1}),
    loader: ({request})=>{
      return this.productsService.getProducts({
        offset: request.page * 9,
        gender: request.gender});
    }
  });
}
