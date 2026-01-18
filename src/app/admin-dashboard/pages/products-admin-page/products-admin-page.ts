import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductTable } from "@products/components/product-table/product-table";
import { ProductsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { Pagination } from "@shared/components/pagination/pagination";
import { map, of } from 'rxjs';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTable, Pagination, RouterLink],
  templateUrl: './products-admin-page.html',
})
export class ProductsAdminPage {
  paginationService = inject(PaginationService);
  productsService = inject(ProductsService);

  productsPerPage = signal(10);

  rxProducts = rxResource({
    request: ()=>({page: this.paginationService.pageParam() - 1, numberOfProducts: this.productsPerPage() }),
    loader: ({request})=>{
      return this.productsService.getProducts({
        offset: request.page * 9,
        limit:  request.numberOfProducts
      })
    }
  })
 }
