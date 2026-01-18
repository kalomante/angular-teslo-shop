import { User } from "@auth/interfaces/user.interface";

export interface ProductsResponse {
  count:    number;
  pages:    number;
  products: Product[];
}

export interface Product {
  id:          string;
  title:       string;
  price:       number;
  description: string;
  slug:        string;
  stock:       number;
  sizes:       string[];
  gender:      Gender;
  tags:        string[];
  images:      string[];
  user:        User;
}

export enum Gender {
  Kid = "kid",
  Men = "men",
  Women = "women",
}

export enum Size {
  L = "L",
  M = "M",
  S = "S",
  Xl = "XL",
  Xs = "XS",
  Xxl = "XXL",
}

export enum FullName {
  TestOne = "Test One",
}

export enum Role {
  Admin = "admin",
}
