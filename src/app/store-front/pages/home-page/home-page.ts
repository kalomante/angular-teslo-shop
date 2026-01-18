import { AfterViewInit, Component, inject, ResourceRef, signal } from '@angular/core';
import { ProductCard } from "@products/components/product-card/product-card";
import { ProductsService } from '@products/services/products.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ProductsResponse } from '@products/interfaces/product.interface';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Pagination } from "@shared/components/pagination/pagination";
import { ActivatedRoute } from '@angular/router';
import { map, tap } from 'rxjs';
import { PaginationService } from '@shared/components/pagination/pagination.service';
@Component({
  selector: 'app-home-page',
  imports: [
    ProductCard,
    JsonPipe,
    AsyncPipe,
    Pagination
],
  templateUrl: './home-page.html',
})
export class HomePage {
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService)

//   activeRoute = inject(ActivatedRoute);

//   // Crea un observable que recupera el parámetro page de la ruta y lo transforma una señal. Si el parámetro no existe, devuelve 1
//   pageParam = toSignal(this.activeRoute.queryParamMap.pipe(
//     map( params=> (params.get('page') ? +params.get('page')! : 1)),
//     map(page => isNaN(page) ? 1 : page)
//   ),{
//     initialValue: 1
//   }
// );

  productResource = rxResource({
    request: ()=>({page: this.paginationService.pageParam() - 1}),
    loader: ({request})=> {
      return this.productsService.getProducts({
        offset: request.page * 9
      });
    }
  });
}
