import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

import { DateRangePicker, Pagination } from '@mui/lab'
import { CircularProgress } from '@mui/material'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useOrders } from 'src/@core/hooks/useOrders'
import { Order } from 'src/@core/utils/types'
import { handleExportClick } from 'src/lib/utils'
import PrivateRoute from '../../privateRoute'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'

interface StatusObj {
  [key: string]: {
    color: ThemeColor
  }
}
const statusObj: StatusObj = {
  'accepted pending': { color: 'warning' },
  pending: { color: 'info' },
  rejected: { color: 'error' },
  accepted: { color: 'success' }
}

const OrderRow = ({ order, router }) => {
  return (
    <>
      <TableRow onClick={() => router.push(`/pages/orders/${order.id}`)} key={order.id}>
        <TableCell>{`${order.firstName} ${order.lastName}`}</TableCell>
        <TableCell>{order.isCollected ? 'Yes' : 'No'}</TableCell>
        <TableCell>{order.itemNum}</TableCell>
        <TableCell>{order.formType}</TableCell>
        <TableCell>{order.installmentAmount}</TableCell>
        <TableCell>{order.totalPrice}</TableCell>
        <TableCell>{order.collectionDate}</TableCell>
        <TableCell align='center'>
          <Chip label={order.orderStatus} color={statusObj[order.orderStatus].color} />
        </TableCell>
      </TableRow>
    </>
  )
}

const OrdersPage = props => {
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 10
  const router = useRouter()
  const [searchBy, setSearchBy] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [dateFilter, setDateFilter] = useState<dayjs.Dayjs>(null)
  const [exporting, setExporting] = useState(false)
  const [filteredData, setFilteredData] = useState<Order[]>([])
  const [orders, isLoadingOrders, errorLoadingOrders] = useOrders()

  useEffect(() => {
    if (orders) {
      let filtered = orders
      if (statusFilter || categoryFilter || searchQuery || dateFilter) {
        filtered = orders.filter(order => {
          const matcheStatusFilter = !statusFilter || statusFilter === order.orderStatus
          const matchesCategoryFilter = !categoryFilter || categoryFilter === order.category
          const matchesSearchBy = !searchBy || order[searchBy].startsWith(searchQuery.trim())
          const matchesDateFilter = !dateFilter || dayjs(dateFilter).isSame(dayjs(order.timeStamp.seconds), 'day')

          return matcheStatusFilter && matchesCategoryFilter && matchesSearchBy && matchesDateFilter
        })
      }
      filtered.sort((a, b) => b.timeStamp.seconds - a.timeStamp.seconds)
      setFilteredData(filtered)
    }
  }, [orders, searchQuery, searchBy, statusFilter, categoryFilter, dateFilter])

  const handleChangeSearchTarget = event => {
    setSearchBy(event.target.value)
  }

  const handleSearchChange = event => {
    setSearchQuery(event.target.value.toLowerCase())
  }

  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredData.slice(indexOfFirstOrder, indexOfLastOrder)

  const handlePageChange = (event, page) => {
    setCurrentPage(page)
  }

  if (isLoadingOrders) {
    return 'loading...'
  }

  if (errorLoadingOrders) {
    console.error(errorLoadingOrders)

    return `Error here fetching data: ${errorLoadingOrders}`
  }

  return (
    <PrivateRoute>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 120, marginRight: '16px' }}>
            <InputLabel id='status-filter-label'>Status</InputLabel>
            <Select
              labelId='status-filter-label'
              label='Status'
              id='status-filter'
              value={statusFilter}
              onChange={event => setStatusFilter(event.target.value)}
            >
              <MenuItem value=''>All</MenuItem>
              <MenuItem value='pending'>Pending</MenuItem>
              <MenuItem value='accepted pending'>Accepted Pending</MenuItem>
              <MenuItem value='accepted'>Accepted</MenuItem>
              <MenuItem value='rejected'>Rejected</MenuItem>
            </Select>
          </FormControl>
        </Box>
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
              <MenuItem value=''>All</MenuItem>
              <MenuItem value='mpower'>MPower</MenuItem>
              <MenuItem value='climate'>Climate</MenuItem>
              <MenuItem value='smartbuy'>Smartbuy</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id='search-target-label'>Search By</InputLabel>
          <Select
            labelId='search-target-label'
            id='search-target'
            value={searchBy}
            label='Search By'
            onChange={handleChangeSearchTarget}
          >
            <MenuItem value=''>None</MenuItem>
            <MenuItem value='nrc'>NRC</MenuItem>
            <MenuItem value='collectionDate'>Collection Date</MenuItem>
            <MenuItem value='employeeNumber'>Employee Number</MenuItem>
            <MenuItem value='firstName'>First Name</MenuItem>
            <MenuItem value='lastName'>Last Name</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField id='search-query' label='Search' value={searchQuery} onChange={handleSearchChange} />
        </Box>
        <Box>
          <DatePicker
          label="Date Submitted"
            onChange={(newValue: any) => setDateFilter(newValue)}
            slotProps={{
              field: { clearable: true, onClear: () => setDateFilter(null) }
            }}
          />
        </Box>
        <Button variant='contained' onClick={() => handleExportClick(currentOrders, setExporting)} disabled={exporting}>
          {exporting ? 'Exporting data...' : 'Export to Excel'}
          {exporting && <CircularProgress size={20} style={{ marginLeft: '10px' }} />}
        </Button>
      </Box>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Is Collected</TableCell>
                <TableCell>Item Number</TableCell>
                <TableCell>Form Type</TableCell>
                <TableCell>Installment Amount</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Collection Date</TableCell>
                <TableCell>Order Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentOrders.map(order => (
                <OrderRow order={order} router={router} key={order.id} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      {/* Pagination component */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <Pagination
          count={Math.ceil(filteredData.length / ordersPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color='primary'
        />
      </Box>
    </PrivateRoute>
  )
}

export default OrdersPage
