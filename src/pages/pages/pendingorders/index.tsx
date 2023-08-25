import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import { ThemeColor } from 'src/@core/layouts/types';
import { getFirestore, collection, getDoc, doc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import firebase from '../../../firebase/config';
import { useRouter } from 'next/router';
import PrivateRoute from '../../privateRoute';
import exportDataToExcel from '../../../configs/exportToExcel';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Pagination } from '@mui/lab';
import { CircularProgress } from '@mui/material';

interface StatusObj {
  [key: string]: {
    color: ThemeColor;
  };
}
const statusObj: StatusObj = {
  pending: { color: 'info' },
  rejected: { color: 'error' },
  accepted: { color: 'success' },
};

const OrdersPage = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const router = useRouter();
  const [searchTarget, setSearchTarget] = useState('nrc');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [value, loading, error] = useCollection(collection(getFirestore(firebase), 'orders'));

  // ... (other hooks and states)

  const handleExportClick = async () => {
    if (value) {
      setExporting(true);

      const data = [];

      for (const docSnapshot of value.docs) {
        const orderData = docSnapshot.data();

        // Fetch user data from the "users" collection
        const userDocRef = doc(getFirestore(firebase), 'users', orderData.createdBy);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();

        // Add user data to the orderData object
        orderData.agent = {
          firstName: userData?.firstName || '',
          lastName: userData?.lastName || '',
        };

        data.push(orderData);
      }

      exportDataToExcel(data, 'orders', 'output.xlsx', 'orders');

      setExporting(false);
    }
  };

  // ... (other functions)

  return (
    <PrivateRoute>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        {/* ... Search and filter controls ... */}
        <Button variant="contained" onClick={handleExportClick} disabled={exporting}>
          {exporting ? 'Exporting data...' : 'Export to Excel'}
          {exporting && <CircularProgress size={20} style={{ marginLeft: '10px' }} />}
        </Button>
      </Box>
      <Card>
        {/* Table content */}
      </Card>
      <Pagination
        count={Math.ceil(filteredData.length / ordersPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
      />
    </PrivateRoute>
  );
};

export default OrdersPage;
