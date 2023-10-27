import Grid from '@mui/material/Grid';
import { doc, getFirestore } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useDocument } from 'react-firebase-hooks/firestore';
import firebase from "../../../firebase/config";

import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts';

import DetailOrder from "../../../layouts/components/detail/OrderDetail";

const OrderDetail = () => {
  const router = useRouter();
  const { orderID } = router.query;

  const [value, loading, error] = useDocument(
    doc(getFirestore(firebase), 'orders', String(orderID)),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const [userValue, userLoading, userError] = useDocument(
    value && value.data().createdBy ?
      doc(getFirestore(firebase), 'users', String(value.data().createdBy)) :
      null,
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const [customerValue, customerLoading, customerError] = useDocument(
    value && value.data().createdBy ?
      doc(getFirestore(firebase), 'customers', String(value.data().customer)) :
      null,
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const mergedValue = {
    ...value?.data(),
    agentName: `${userValue?.data()?.firstName ? userValue?.data()?.firstName : null}
    ${userValue?.data()?.lastName ? userValue?.data()?.lastName : null}`,
    customerName: `${customerValue?.data()?.firstName ? customerValue?.data()?.firstName : null}
    ${customerValue?.data()?.lastName ? customerValue?.data()?.lastName : null}`,
    orderId: orderID
  };
  if (loading) {
    return 'loading order...';
  }
  if (error) {
    return `Error: ${error}`;
  }



  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12}>
          <DetailOrder value={mergedValue} />
        </Grid>

      </Grid>
    </ApexChartWrapper>

  );
};

export default OrderDetail;
