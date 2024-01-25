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
import { useRouter } from 'next/router'
import { useOrders } from 'src/@core/hooks/useOrders'
import PrivateRoute from '../../privateRoute'
import { Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { handleExportClick } from 'src/lib/utils'
import { Order } from 'src/@core/utils/types'

const AcceptedPendingOrdersPage = () => {
  const router = useRouter()
  const [exporting, setExporting] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [filteredData, setFilteredData] = useState<Order[]>([])
  const [orders, isLoadingOrders, errorLoadingOrders] = useOrders(where('orderStatus', '==', 'accepted pending'))

  useEffect(() => {
    if (orders) {
      let filtered = orders;
      if (categoryFilter) {
        filtered = orders
          .filter((order) => {
            const matchesCategoryFilter = !categoryFilter || categoryFilter === (order.category);

            return matchesCategoryFilter;
          });
      }
      filtered.sort((a, b) => b.timeStamp.seconds - a.timeStamp.seconds);
      setFilteredData(filtered);
    }
  }, [orders, categoryFilter]);

  if (isLoadingOrders) {
    return 'loading...'
  }

  if (errorLoadingOrders) {
    return `Error fetching data: ${errorLoadingOrders}`
  }

  return (
    <PrivateRoute>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 120, marginRight: '16px' }}>
            <InputLabel id='category-filter-label'>Category</InputLabel>
            <Select
              labelId='category-filter-label'
              label='Category'
              id='category-filter'
              value={categoryFilter}
              onChange={event => {
                setCategoryFilter(event.target.value)
              }}
            >
              <MenuItem value='' defaultChecked>All</MenuItem>
              <MenuItem value='mpower'>MPower</MenuItem>
              <MenuItem value='climate'>Climate</MenuItem>
              <MenuItem value='smartbuy'>Smartbuy</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button variant='contained' onClick={() => handleExportClick(filteredData, setExporting)} disabled={exporting}>
          {exporting ? 'Exporting data...' : 'Export to Excel'}
          {exporting && <CircularProgress size={20} style={{ marginLeft: '10px' }} />}
        </Button>
      </Box>
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
              {filteredData &&
                filteredData.map(order => (
                  <TableRow
                    onClick={() => router.push(`/pages/orders/${order.id}`)}
                    hover
                    key={order.id}
                    sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}
                  >
                    <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                      <Typography
                        sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}
                      >{`${order.firstName} ${order.lastName}`}</Typography>
                    </TableCell>
                    <TableCell>{order.itemNum}</TableCell>
                    <TableCell>{order.collectionDate}</TableCell>
                    <TableCell>{order.totalPrice}</TableCell>
                    <TableCell>{order.formType}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.orderStatus}
                        color='warning'
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

export default AcceptedPendingOrdersPage
