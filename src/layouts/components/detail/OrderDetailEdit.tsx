// ** React Imports
import { forwardRef, useState } from 'react';

// ** MUI Imports
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import { useDocument } from "react-firebase-hooks/firestore";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import firebase from '../../../firebase/config';
import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Stack } from "@mui/material";
import DatePicker from 'react-datepicker';

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const CustomInput = forwardRef((props, ref) => {
  return <TextField inputRef={ref} fullWidth {...props} />;
});

forwardRef((props, ref) => {
  return <TextField inputRef={ref} label='Date' fullWidth {...props} />;
});
interface State {
  // name: string;
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
  accountName: string;
  monthOfLastDeduct: Date | null;
  monthOfFirstDeduct: Date | null;
}

const OrderDetailEdit = (props) => {
  const [collectDate, setCollectDate] = useState<Date | null | undefined>(null);
  const [firstDeductDate, setFirstDeductDate] = useState<Date | null | undefined>(null);
  const [lastDeductDate, setLastDeductDate] = useState<Date | null | undefined>(null);

  const [values, setValues] = useState<State>({
    firstName: props.value.firstName,
    lastName: props.value.lastName,
    isCollected: props.value.isCollected,
    itemNum: props.value.itemNum,
    formType: props.value.formType,
    installmentAmount: props.value.installmentAmount,
    totalPrice: props.value.totalPrice,
    collectionDate: props.value.collectionDate,
    accountNumber: props.value.accountNumber,
    branchName: props.value.branchName,
    comment: props.value.comment,
    bankName: props.value.bankName,
    accountName: props.value.accountName,
    monthOfLastDeduct: props.value.monthOfLastDeduct,
    monthOfFirstDeduct: props.value.monthOfFirstDeduct,
  });


  const handleChange = (prop: keyof State) => (event: any) => {
    Object.assign({}, values, { [prop]: event.target.value });
    setValues({ ...values, [prop]: event.target.value });
  };
  const [userValue, userLoading, userError] = useDocument(
    props.value && props.value.createdBy ?
      doc(getFirestore(firebase), 'orders', props.value.orderId) :
      null,
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const handleUpdate = async () => {
    if (userValue) {
      try {
        const updatedValues = {
          firstName: values.firstName || props.value.firstName,
          lastName: values.lastName || props.value.lastName,
          isCollected: values.isCollected || props.value.isCollected,
          itemNum: values.itemNum || props.value.itemNum,
          formType: values.formType || props.value.formType,
          installmentAmount: values.installmentAmount || props.value.installmentAmount,
          totalPrice: values.totalPrice || props.value.totalPrice,
          collectionDate: values.collectionDate || props.value.collectionDate,
          accountNumber: values.accountNumber || props.value.accountNumber,
          branchName: values.branchName || props.value.branchName,
          comment: values.comment || props.value.comment,
          bankName: values.bankName || props.value.bankName,
          accountName: values.accountName || props.value.accountName,
          monthOfFirstDeduct: values.monthOfFirstDeduct || props.value.monthOfFirstDeduct,
          monthOfLastDeduct: values.monthOfLastDeduct || props.value.monthOfLastDeduct,
        };

        await updateDoc(userValue.ref, updatedValues);
        console.log('Document successfully updated!');
      } catch (err) {
        console.error('Error updating document:', err);
      }
    }
  };





  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12} sm={6}>
            <InputLabel>IsCollected</InputLabel>
            <FormControl fullWidth>
              <Select
                label={props.value.isCollected}
                defaultValue={props.value.isCollected}
                placeholder={props.value.isCollected}
                value={values.isCollected}
                onChange={handleChange('isCollected')}
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Comment</InputLabel>
            <TextField
              fullWidth
              value={values.comment}
              onChange={handleChange('comment')}
              placeholder='Comment'
              defaultValue={props.value.comment}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Bank Name</InputLabel>
            <TextField
              fullWidth
              value={values.bankName}
              onChange={handleChange('bankName')}
              placeholder='Bank Name'
              defaultValue={props.value.bankName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Account Name</InputLabel>
            <TextField
              fullWidth
              value={values.accountName}
              onChange={handleChange('accountName')}
              placeholder='Account Name'
              defaultValue={props.value.accountName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Last Month of Deduct</InputLabel>
            <DatePickerWrapper>
              <DatePicker
                selected={lastDeductDate}
                showYearDropdown
                showMonthDropdown
                id='lastDeductDate'
                placeholderText={props.value.monthOfLastDeduct}
                customInput={<CustomInput />}
                onChange={(date: Date) => setLastDeductDate(date)}
              />
            </DatePickerWrapper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Month Of First Deduct</InputLabel>
            <DatePickerWrapper>
              <DatePicker
                selected={firstDeductDate}
                showYearDropdown
                showMonthDropdown
                id='firstDeductDate'
                placeholderText={props.value.monthOfFirstDeduct}
                customInput={<CustomInput />}
                onChange={(date: Date) => setFirstDeductDate(date)}
              />
            </DatePickerWrapper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <InputLabel>First name</InputLabel>
            <TextField
              fullWidth
              value={values.firstName}
              onChange={handleChange('firstName')}
              placeholder='First Name'
              defaultValue={props.value.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Last name</InputLabel>
            <TextField
              fullWidth
              value={values.lastName}
              onChange={handleChange('lastName')}
              placeholder='Last Name'
              defaultValue={props.value.lastName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Number of Items</InputLabel>
            <TextField
              fullWidth
              value={values.itemNum}
              onChange={handleChange('itemNum')}
              placeholder='Number of Items'
              defaultValue={props.value.itemNum}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Form Type</InputLabel>
            <FormControl fullWidth>
              <Select
                defaultValue={props.value.formType}
                placeholder={props.value.formType}
                value={values.formType}
                onChange={handleChange('formType')}
              >
                <MenuItem value="loan">Loan</MenuItem>
                <MenuItem value="hirePurchase">Hire Purchase</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Installment Amount</InputLabel>
            <TextField
              fullWidth
              value={values.installmentAmount}
              onChange={handleChange('installmentAmount')}
              placeholder='Installment Amount'
              defaultValue={props.value.installmentAmount}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Total Price</InputLabel>
            <TextField
              fullWidth
              value={values.totalPrice}
              onChange={handleChange('totalPrice')}
              placeholder='Total Price'
              defaultValue={props.value.totalPrice}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>CollectionDate</InputLabel>
            <DatePickerWrapper>
              <DatePicker
                selected={collectDate}
                showYearDropdown
                showMonthDropdown
                id='collectionDate'
                placeholderText={props.value.collectionDate}
                customInput={<CustomInput />}
                onChange={(date: Date) => setCollectDate(date)}
              />
            </DatePickerWrapper>
          </Grid>


          <Grid item xs={12} sm={6}>
            <InputLabel>Account Number</InputLabel>
            <TextField
              fullWidth
              value={values.accountNumber}
              onChange={handleChange('accountNumber')}
              placeholder='Account Number'
              defaultValue={props.value.accountNumber}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Branch Name</InputLabel>
            <TextField
              fullWidth
              value={values.branchName}
              onChange={handleChange('branchName')}
              placeholder='Branch Name'
              defaultValue={props.value.branchName}
            />
          </Grid>




          <Grid onClick={() => { handleUpdate(); }} item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant='contained' sx={{ marginRight: 3.5 }}>
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  );
};

export default OrderDetailEdit;
