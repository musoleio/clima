// ** React Imports
import {useState} from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

import Button from '@mui/material/Button'

import Typography from "@mui/material/Typography";


import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import {Snackbar, Alert} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import { useDocument } from "react-firebase-hooks/firestore";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import firebase from '../../../firebase/config'
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import OrderDetailEdit from "./OrderDetailEdit";





const DetailOrder = (props) => {

  console.log(`OrderDetail is ${JSON.stringify(props.value.orderId)}`)
  const [orderValue, orderLoading, orderError] =
    useDocument(
    props.value && props.value.orderId ?
      doc(getFirestore(firebase), 'orders', String(props.value.orderId)) :
      null,
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const [isSuccessToastOpen, setIsSuccessToastOpen] = useState(false);
  const [isErrorToastOpen, setIsErrorToastOpen] = useState(false);
  const [rejectToastOpen, setRejectToastOpen] = useState(false);
  const acceptOrder = async () => {
    try {
      await updateDoc(orderValue.ref, {
        orderStatus: 'accepted'
      })
      setIsSuccessToastOpen(true);
    } catch (error) {
      console.error(error);
    }
  };
  const handleRejectToastClose = () => {
    setRejectToastOpen(false);
  };


  const rejectOrder = async () => {
    try {
      await updateDoc(orderValue.ref, {
        orderStatus: 'rejected'
      })
      setRejectToastOpen(true);
    } catch (error) {
      console.error(error);
    }
  };



  const [isEditing, setIsEditing] = useState(false);
  const handleEdit = () => {
    setIsEditing(true);
  };
  if (isEditing) {
    return <OrderDetailEdit {...props}  />;
  }

  return (
    <CardContent>
      <div>
        <Grid container spacing={7}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            {props.value.orderStatus === 'pending' && (
              <>
                <Button onClick={acceptOrder} variant='contained' sx={{ marginRight: 3.5 }}>
                  Accept Order
                </Button>
                <Button onClick={rejectOrder} variant='contained' sx={{ marginRight: 3.5 }}>
                  Reject Order
                </Button>
              </>
            )}
            {props.value.orderStatus === 'rejected' && (
              <Button onClick={acceptOrder} variant='contained' sx={{ marginRight: 3.5 }}>
                Accept Order
              </Button>
            )}
            {props.value.orderStatus === 'accepted' && (
              <Button onClick={rejectOrder} variant='contained' sx={{ marginRight: 3.5 }}>
                Reject Order
              </Button>
            )}
            <Button onClick={handleEdit} variant='contained' sx={{ marginRight: 3.5 }}>
              Edit Order
            </Button>
          </Grid>


          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1"> Customer Name:</Typography>
            <Typography>{props.value.customerName}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Total Price:</Typography>
            <Typography>{`K${props.value.totalPrice}`}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Created By:</Typography>
            <Typography>{`${props.value.agentName}`}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Account Number:</Typography>
            <Typography>{`${props.value.accountNumber}`}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Account Name:</Typography>
            <Typography>{`${props.value.accountName}`}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Installment Amount:</Typography>
            <Typography>{`K${props.value.installmentAmount}`}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Order Status</Typography>
            <Typography>{props.value.orderStatus}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Is Order Collected</Typography>
            <Typography>{props.value.isCollected? 'Yes' : 'No'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Reserve Attachment</Typography>
            <Typography>{props.value.reserveAttachment? 'Yes' : 'No'}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Form Type</Typography>
            <Typography>{props.value.formType}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Order Comment</Typography>
            <Typography>{props.value.comment}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Bank Name</Typography>
            <Typography>{props.value.bankName}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Branch Name</Typography>
            <Typography>{props.value.branchName}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Collection Date</Typography>
            <Typography>{props.value.collectionDate}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Number Of Items</Typography>
            <Typography>{props.value.itemNum}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Month Of First Deduct</Typography>
            <Typography>{props.value.monthOfFirstDeduct}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Month Of Last Deduct</Typography>
            <Typography>{props.value.monthOfLastDeduct}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Employee Number:</Typography>
            <Typography>{props.value.employeeNumber}</Typography>
          </Grid>

          <TransformWrapper>
            <TransformComponent>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Attachments</Typography>
                </Grid>
                {props.value.attachments.map((attachment, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Card>
                      <TransformComponent>
                        <CardMedia
                          component="img"
                          image={attachment} // assuming you have an `url` field in your attachment object
                          alt={`Attachment ${index}`}
                        />
                      </TransformComponent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TransformComponent>
          </TransformWrapper>


        </Grid>
        <Snackbar
          open={isSuccessToastOpen}
          autoHideDuration={6000}
          onClose={() => setIsSuccessToastOpen(false)}
        >
          <Alert severity='success' sx={{ width: '100%' }}>
            Order accepted successfully!
          </Alert>
        </Snackbar>
        <Snackbar
          open={isErrorToastOpen}
          autoHideDuration={6000}
          onClose={() => setIsErrorToastOpen(false)}
        >
          <Alert severity='error' sx={{ width: '100%' }}>
            Error while rejecting order.
          </Alert>
        </Snackbar>
      </div>
    </CardContent>




  )
}

export default DetailOrder
