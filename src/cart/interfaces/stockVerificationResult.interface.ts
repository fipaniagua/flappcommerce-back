import { ProductWithRealStock } from "./productWithRealStock.interfaces";

export interface StockVerificationResult {
    success: boolean;
    message: string;
    insufficientItems: ProductWithRealStock[];
  }