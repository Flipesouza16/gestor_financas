import { AllPurchaseByMonth } from '../utils/types/purchaseType';

export interface UserModel {
  id?: string;
  name?: string;
  email: string;
  password: string;
  purchases?: string;
}
