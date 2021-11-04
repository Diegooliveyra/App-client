import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../Models/product.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private url: string = 'http://localhost:3005';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/products`);
  }

  getProductsError(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/product`);
  }

  getProcuctName(id: number): Observable<any> {
    return this.http
      .get<any>(`${this.url}/product/${id}`)
      .pipe(map((p) => p.name));
  }

  getProductID(id:number):Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/products/${id}`);
  }
}
