import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../Models/product.interface';

@Component({
  selector: 'app-dialog-edit-product',
  templateUrl: './dialog-edit-product.component.html',
  styleUrls: ['./dialog-edit-product.component.css'],
})
export class DialogEditProductComponent implements OnInit {
  product: Product = { id: 0, name: '', departament: '', price: 0 };

  constructor(
    public dialogRef: MatDialogRef<DialogEditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public produto: Product
  ) {
    this.product = produto
  }

  ngOnInit(): void {}

  cancel(){
    this.dialogRef.close()
  }
}
