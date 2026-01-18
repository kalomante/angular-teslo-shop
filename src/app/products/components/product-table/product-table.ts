import { Component, inject, input } from '@angular/core';
import { Product } from '@products/interfaces/product.interface';
import { ProductImagePipe } from '@products/pipes/product-image-pipe';
import { RouterLink } from "@angular/router";
import { CurrencyPipe } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { ProductsService } from '@products/services/products.service';

@Component({
  selector: 'product-table',
  imports: [
    ProductImagePipe,
    RouterLink,
    CurrencyPipe
],
  templateUrl: './product-table.html',
})
export class ProductTable {
  products = input.required<Product[]>();

 }
