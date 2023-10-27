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

import { Pagination } from "@mui/lab";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFetchOrders } from 'src/@core/hooks/useFetchOrders';
import { Order } from 'src/pages/pages/acceptedorders';

interface RowType {
  name: string
  date: string
  numberOfItems: number
  amount: string
  status: string
  isCollected: boolean
}

interface StatusObj {
  [key: string]: {
    color: ThemeColor
  }
}

const rows: RowType[] = [

];

const statusObj: StatusObj = {
  pending: { color: 'info' },
  rejected: { color: 'error' },
  accepted: { color: 'success' }
};

const DashboardTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;
  const router = useRouter();
  const [sortedOrders, setSortedOrders] = useState<Order[]>([]);
  const [orders, isLoadingOrders, errorLoadingOrders] = useFetchOrders();

  useEffect(() => {
    if (orders) {
      const sorted = orders.sort((a, b) => {
        const timestampA = a.timeStamp.seconds;
        const timestampB = b.timeStamp.seconds;

        return timestampB - timestampA;
      });
      setSortedOrders(sorted);
    }
  }, [orders]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  if (isLoadingOrders) {
    return 'loading...';
  }

  if (errorLoadingOrders) {
    return `Error fetching data: ${errorLoadingOrders}`;
  }

  return (
    <>
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
              {currentOrders.map((order) => (
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
        {/* Pagination component */}
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <Pagination
            count={Math.ceil(sortedOrders.length / ordersPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Card>
    </>

  );
};

export default DashboardTable;
