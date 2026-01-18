import { AfterViewInit, Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
import { Product } from '@products/interfaces/product.interface';
import { ProductCarousel } from "@products/components/product-carousel/product-carousel";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@auth/utils/form-utils';
import { firstValueFrom, map, Observable, of, tap } from 'rxjs';
import { FormValidator } from "@shared/components/form-validator/form-validator";
import { ProductsService } from '@products/services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'product-details',
  imports: [ProductCarousel, ReactiveFormsModule, FormValidator],
  templateUrl: './product-details.html',
})
export class ProductDetails /*implements AfterViewInit*/ implements OnInit{

  product = input.required<Product>();
  productService = inject(ProductsService);

  router = inject(Router);

  wasSaved = signal(false);

  tempImages = signal<string[]>([])

  imageFileList : FileList | undefined = undefined;

  // ? PRUEBAS SOBRE OBSERVABLES

    // * PRUEBA 1

  //   emitter = setInterval(()=>{
    //      console.log("Hola Mundo");
    //   }, 2000)

    //   observable = new Observable((subscriber)=>{
      //     this.emitter
      //     setTimeout(()=>{
        //       subscriber.complete();
        //     }, 10000)
        // });

        //   escucharEvento = () =>{
          //     const subs = this.observable.subscribe({
            //       complete: () => {
              //         clearInterval(this.emitter);
              //       },
              //     });

              // }
              //     // return await firstValueFrom(this.observable)
              //   ngAfterViewInit(): void {
                //     // console.log(this.observable);
                //     // console.log(this.escucharEvento());
                //     this.escucharEvento();
                //     // setTimeout(
                  //     //   ()=>{

                  //     //     this.escucharEvento().unsubscribe();
                  //     //   }, 10000
                  //     // )

                  //   }


                  // * PRUEBA 2

                  // observable = new Observable((subscriber)=>{
                  //   subscriber.next(1);
                  //   subscriber.next(2);
                  //   subscriber.next(3);
                  // });
                  // constructor(){
                  //   this.ejecutarObservable();
                  // }
                  // ejecutarObservable(){
                  //   this.observable.subscribe((valor)=>{
                  //     console.log(valor);
                  //   })
                  // }


                  // ? PRUEBA SOBRE EFECTOS

                  // señal = signal<number>(0);

  // emitter = setInterval(() => {
  //   this.señal.update((current)=> ++current);
  // }, 2000);
  // changeEffect = of(effect(()=> console.log(this.señal()))).subscribe({
  //   complete: ()=>{
  //     this.cancelEmitter;
  //   }
  // });

  // cancelEmitter = setTimeout(()=>{
  //   clearInterval(this.emitter);
  // }, 10000)



  private fb = inject(FormBuilder);

  productDetailsForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    // sizes es de tipo string[]
    sizes: [['']],
    images: [[]],
    tags: ['', [Validators.required]],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]]

  })

  formUtils = FormUtils

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

 async  onSubmit(){
    const isValid = this.productDetailsForm.valid;

    this.productDetailsForm.markAllAsTouched();

    if(!isValid) return;

    const formValue = this.productDetailsForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags?.toString()?.toLowerCase().split(',').map((tag)=> tag.trim()) ?? []
    }

    if(this.product().id === 'new'){
      // Crear producto

      // El firstValueFrom devuelve una promesa
      // Se envía el producto y las imágenes
      const producto = await firstValueFrom(this.productService.createProduct(productLike, this.imageFileList));
      this.router.navigate(['/admin/products', producto.id]);

    }else{
      await firstValueFrom(this.productService.updateProduct(this.product().id, productLike, this.imageFileList));


    }

    this.wasSaved.set(true);

    setTimeout(()=> this.wasSaved.set(false), 3000);


  }

  ngOnInit(): void {
    this.setFormValues(this.product());
  }

  // El formulario envía las tags como un arreglo de strings, pero queremos que lo envíe como string
  // El tipo Partial hace que los valores de Product sean opcionales
  setFormValues(formLike: Partial<Product>){
    this.productDetailsForm.patchValue({tags: formLike.tags?.join(', ')});
    this.productDetailsForm.reset(formLike as any);
  }

  onClickedSize(size: string){
    // Las tallas que existen en los valores enviados por el formulario
    const currentSizes = this.productDetailsForm.value.sizes ?? [];

    // Si existe la talla dentro del formulario, la elimina. Si no existe, la añade.
    if(currentSizes.includes(size)){
      currentSizes.splice(currentSizes.indexOf(size),1);
    } else {
      currentSizes.push(size)
    }

    this.productDetailsForm.patchValue({sizes: currentSizes});

  }

  // IMAGE PREVIEW

  imagePreview(event : Event){

    const fileList = (event.target as HTMLInputElement).files;

    this.imageFileList = fileList ?? undefined;

    const imageUrls = Array.from(fileList ?? []).map((file)=>URL.createObjectURL(file));

    this.tempImages.set(imageUrls);

  }

  addImage(event : Event){
    const images = (event.target as HTMLImageElement).src;

    // const imageUrl = URL.createObjectURL(images);

    // const images = event.target;
    // console.log(event.target);
    if(!this.product().images.includes(images)){
      this.product().images = [...this.product().images, images];
    }

    console.log(this.product().images);

  }
}
