import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';
import { delay, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const baseUrl = environment.baseUrl

interface Options{
  limit?: number,
  offset?: number,
  gender?: string
}

// Producto con id new para crear uno nuevo
const emptyProduct : Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Kid,
  tags: [],
  images: [],
  user: {} as User
}

@Injectable({providedIn: 'root'})
export class ProductsService {

  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();

  private productCache = new Map<string, Product>();


  getProducts(options: Options){

    const { limit=9, offset=0, gender=""} = options;

    const key = `${limit}-${offset}-${gender}`;


    if(this.productsCache.has(key)){
      return of(this.productsCache.get(key)!);
    }

    return this.http.get<ProductsResponse>(`${baseUrl}/products`, {
      params: {
        limit: limit,
        offset: offset,
        gender: gender
      }
    })
    .pipe(
      tap(resp => console.log(resp)),
      tap(resp => this.productsCache.set(key, resp))
    ) ?? {};
  }

  getProductByIdSlug(idSlug: string): Observable<Product>{

    if(this.productCache.has(idSlug)){
      return of(this.productCache.get(idSlug)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${idSlug}`)
    .pipe(
      tap(resp => this.productCache.set(idSlug, resp))
    );
  }

  getProductById(id:string): Observable<Product>{

    if(id === emptyProduct.id){
      return of(emptyProduct);
    }


    if(this.productCache.has(id)){
      return of(this.productCache.get(id)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${id}`)
    .pipe(
      tap(resp => this.productCache.set(id, resp))
    );
  }

  createProduct(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product>{

    return this.http.post<Product>(`${baseUrl}/products`, productLike)
    .pipe(tap((product)=> this.updateProductCache(product)));

  }

  updateProduct(id: string, productLike: Partial<Product>, imageFileList?: FileList): Observable<Product>{
    // Aunque sabemos que el id ya viene en el productLike, es mejor mandarlo por separado.
    const currentImages = productLike.images ?? [];
    return this.uploadImages(imageFileList)
      .pipe(
        // Dentro del map hace la conversión para que la emisión sea de tipo ProductLike
        map((imageNames)=> ({
          ...productLike,
          images: [...currentImages, ...imageNames]
        })),
        // El switchMap crea un observable con el valor emitido por el anterior observable
        switchMap(updatedProduct => this.http.patch<Product>(`${baseUrl}/products/${id}`, updatedProduct)
        ),
        tap((product)=> this.updateProductCache(product))
      )

    // El método patch para actualizar un producto espera como segundo argumento el objeto a actualizar

    // ! Como al recuperar el producto para mostrarlo en el panel de admin, lo sacamos desde el caché, no se ven los cambios a primera vista, por lo que tenemos que actualizar también el caché
    return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike)
    .pipe(tap((product)=> this.updateProductCache(product)));
  }

  updateProductCache(product: Product): void{

    this.productCache.set(product.id, product);

    this.productsCache.forEach((productObject)=>{
     productObject.products = productObject.products.map((currentProduct)=> currentProduct.id === product.id ? product : currentProduct)
    })
  }

  uploadImages(images?: FileList): Observable<string[]>{
    if(!images) return of([]);

    const uploadImagesObservable: Observable<string>[] = Array.from(images).map((file)=> this.uploadImage(file));

    // El método forkJoin espera a que todos los observables de un array devuelvan los valores correspondientes
    // y crea un nuevo observable con ellos;
    return forkJoin<string[]>(uploadImagesObservable);
  }

  uploadImage(imageFile: File): Observable<string>{
    if(!imageFile) return of("");

    const formData = new FormData();

    formData.append('file', imageFile);


    return this.http.post<{fileName:string}>(`${baseUrl}/files/product`, formData)
    .pipe(
      map(resp=> resp.fileName)
    );
  }
}
