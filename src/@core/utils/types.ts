export type OrderStatus = 'pending' | 'accepted' | 'rejected';
export type FormType = 'loan' | 'hirePurchase';

export type Order = {
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
  bankName: string;
  orderStatus: OrderStatus
  accountName: string;
  monthOfLastDeduct: Date | null;
  monthOfFirstDeduct: Date | null;
}

