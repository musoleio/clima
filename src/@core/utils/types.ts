import { Firestore } from "firebase/firestore";

export type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'accepted pending';
export type FormType = 'loan' | 'hirePurchase';

export type Order = {
  createdBy(arg0: Firestore, arg1: string, createdBy: any): unknown;
  agent: { firstName: any; lastName: any; };
  id: string;
  firstName: string;
  lastName: string;
  isCollected: boolean;
  itemNum: number;
  formType: FormType
  installmentAmount: string;
  totalPrice: string;
  collectionDate: Date | null;
  accountNumber: string;
  branchName: string;
  comment: string;
  category: 'mpower' | 'smartbuy' | 'climate';
  bankName: string;
  orderStatus: OrderStatus
  accountName: string;
  monthOfLastDeduct: Date | null;
  monthOfFirstDeduct: Date | null;
}

