import { ProductResponse } from "./productResponse.interface";


export interface ProductWithRealStock extends ProductResponse {
    realStock: number;
  }
  