// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'

import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'


// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

import { where } from 'firebase/firestore'
import { useRouter } from "next/router"
import { useOrders } from 'src/@core/hooks/useOrders'
import PrivateRoute from "../../privateRoute"

interface RowType {
  name: string
  date: string
  numberOfItems: number
  amount: string
  status: string
  isCollected: boolean
}

export type Order = {
  id: string;
  firstName: string;
  lastName: string;
  isCollected: boolean;
  itemNum: number;
  formType: string;
  installmentAmount: string;
  totalPrice: string;
  collectionDate: Date | null;
  accountNumber: string;
  branchName: string;
  comment: string;
  bankName: string;
  orderStatus: string;
  accountName: string;
  monthOfLastDeduct: Date | null;
  monthOfFirstDeduct: Date | null;
}

interface StatusObj {
  [key: string]: {
    color: ThemeColor
  }
}

const statusObj: StatusObj = {
  applied: { color: 'info' },
  rejected: { color: 'error' },
  accepted: { color: 'success' }
}

const AcceptedOrdersPage = () => {
  const [orders, isLoadingOrders, errorLoadingOrders] = useOrders(where('orderStatus', '==', 'accepted'));
  const router = useRouter()

  if (isLoadingOrders) {
    return 'loading...'
  }

  if (errorLoadingOrders) {
    return `Error fetching data: ${errorLoadingOrders}`
  }

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
              {orders.map((order) => (
                <TableRow onClick={() => router.push(`/pages/orders/${order.id}`)} hover key={order.id} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                  <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                    <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{`${order.firstName} ${order.lastName}`}</Typography>
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
  )
}

export default AcceptedOrdersPage
