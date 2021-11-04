import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { DialogEditProductComponent } from './dialog-edit-product/dialog-edit-product.component';
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
  newlyProducts: Product[] = [];
  prodsToDelete: Product[];
  prodsToEdit: Product[];

  constructor(
    private productService: ProductsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
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

  loadName(id: any) {
    this.productService.getProductID(id).subscribe(({ name }: any) => {
      let index = this.productsId.findIndex((p) => p.id === id);
      if (index >= 0) {
        this.productsId[index].name = name;
      }
    });
  }

  saveProduct(name: string, departament: string, price: any) {
    let produto = { name, departament, price };
    this.productService.saveProduct(produto).subscribe(
      (r) => {
        this.newlyProducts.push(r);
      },
      (error) => console.log(error)
    );
  }

  deleteProduct(id: any) {
    this.productService.deleteProduct(id).subscribe(
      (response) => {
        console.log(response);
        let index = this.prodsToDelete.findIndex((prod) => id === prod.id);
        if (index >= 0) {
          this.prodsToDelete.splice(index, 1);
        }
      },
      (error) => console.log(error)
    );
  }

  loadProdutsToDelete() {
    this.productService
      .getProducts()
      .subscribe((products) => (this.prodsToDelete = products));
  }

  editProduct(p: Product) {
    let newProduct: Product = { ...p };

    let dialogRef = this.dialog.open(DialogEditProductComponent, {
      width: '400',
      data: newProduct,
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.productService.editProduct(res.id, res).subscribe((res) => {
        let index = this.prodsToEdit.findIndex((prod) => res.id === prod.id);
        if (index >= 0) {
          this.prodsToEdit[index] = res;
        }
      });
    });
  }

  loadProdutsToEdit() {
    this.productService
      .getProducts()
      .subscribe((products) => (this.prodsToEdit = products));
  }
}
