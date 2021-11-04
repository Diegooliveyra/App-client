import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { Product } from './Models/product.interface';
import { ProductsService } from './services/products.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  simpleReqProductsObs$: Observable<Product[]>;
  productsErrorHandling: Product[];
  productsLoading: Product[];
  loading: boolean = false;
  productsId: Product[];
  newlyProducts: Product[]

  constructor(
    private productService: ProductsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  getHttpReques() {
    this.simpleReqProductsObs$ = this.productService.getProducts();
  }

  getHttpRequestError() {
    this.productService.getProductsError().subscribe(
      (data) => (this.productsErrorHandling = data),
      (error) => {
        console.log(error);
        let config = new MatSnackBarConfig();
        config.duration = 2000;
        config.verticalPosition = 'top';
        config.horizontalPosition = 'right';
        config.panelClass = ['snack_error'];

        if (error.status === 0) {
          this.snackBar.open('ocorreu um erro', '', config);
        } else {
          this.snackBar.open(error.message, '', config);
        }
      }
    );
  }

  getHttpRequestSucess() {
    this.productService.getProducts().subscribe(() => {
      let config = new MatSnackBarConfig();
      config.duration = 2000;
      config.verticalPosition = 'top';
      config.horizontalPosition = 'right';
      config.panelClass = ['snack_ok'];
      this.snackBar.open('Carregado com Sucesso', '', config);
    });
  }

  getProductsLoading() {
    this.loading = true;
    this.productService
      .getProducts()
      .pipe()
      .subscribe(
        (products) => {
          this.productsLoading = products;
          this.loading = false;
        },
        (err) => {
          console.log(err);
          this.loading = false;
        }
      );
  }

  getProductsIds() {
    this.productService.getProducts().subscribe(
      (product) =>
        (this.productsId = product.map((p) => ({
          name: '',
          departament: '',
          price: 0,
          id: p.id,
        })))
    );
  }

  loadName(id: number) {
    this.productService.getProductID(id).subscribe(({ name }: any) => {
      let index = this.productsId.findIndex((p) => p.id === id);
      if (index >= 0) {
        this.productsId[index].name = name;
      }
    });
  }


  saveProduct(){

  }
}
