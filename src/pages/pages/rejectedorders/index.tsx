// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';


// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types';

import { where } from 'firebase/firestore';
import { useRouter } from "next/router";
import { useFetchOrders } from 'src/@core/hooks/useFetchOrders';
import PrivateRoute from "../../privateRoute";

interface StatusObj {
  [key: string]: {
    color: ThemeColor
  }
}
const statusObj: StatusObj = {
  applied: { color: 'info' },
  rejected: { color: 'error' },
  accepted: { color: 'success' }
};

const RejectedOrdersPage = () => {
  const router = useRouter();
  const [rejectedOrders, isLoadingRejectedOrders, errorLoadingRejectedOrders] = useFetchOrders(
    where('orderStatus', '==', 'rejected')
  );

  if (isLoadingRejectedOrders) {
    return 'loading...';
  }

  if (errorLoadingRejectedOrders) {
    return `Error fetching data: ${errorLoadingRejectedOrders}`;
  }


  //console.log(`Our value is ${JSON.stringify(value)}`)

  return (
    <PrivateRoute>
      <Card>
        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Number Of Items</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Form Type</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rejectedOrders.map((order) => (
                <TableRow onClick={() => router.push(`/pages/orders/${order.id}`)} hover key={order.id} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                  <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{`${order.firstName} ${order.lastName}`}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{order.itemNum}</TableCell>
                  <TableCell>{order.collectionDate}</TableCell>
                  <TableCell>{order.totalPrice}</TableCell>
                  <TableCell>{order.formType}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.orderStatus}
                      color={statusObj[order.orderStatus].color}
                      sx={{
                        height: 24,
                        fontSize: '0.75rem',
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { fontWeight: 500 }
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </PrivateRoute>
  );
};

export default RejectedOrdersPage;
