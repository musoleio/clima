import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";
import { Order } from "src/@core/utils/types";
import exportDataToExcel from "src/configs/exportToExcel";
import firebase from "src/firebase/config";

export const handleExportClick = async (orders: Order[], setExporting: Dispatch<SetStateAction<boolean>>) => {
    setExporting(true);
    const data = [];

    for (const order of orders) {
      // Fetch the user document from the "users" collection using createdBy
      const userDocRef = doc(getFirestore(firebase), 'users', order?.createdBy);
      const userDocSnapshot = await getDoc(userDocRef);
      const userData = userDocSnapshot.data();

      // Add the agent property to the orderData object
      order.agent = {
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
      };
      data.push(order);
    }
    exportDataToExcel(data, 'orders', 'output.xlsx', 'orders');
    setExporting(false);
};
