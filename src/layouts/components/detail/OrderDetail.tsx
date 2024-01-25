// ** React Imports
import { useRef, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'

import { Alert, Box, MenuItem, Snackbar, FormControl } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import { doc, getFirestore, updateDoc } from 'firebase/firestore'
import { useDocument } from 'react-firebase-hooks/firestore'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import PrivateRoute from 'src/pages/privateRoute'
import firebase from '../../../firebase/config'
import OrderDetailEdit from './OrderDetailEdit'

const DetailOrder = props => {
  const [isStatusToastOpen, setIsStatusToastOpen] = useState(false)

  const [orderDetails, orderLoading, orderError] = useDocument(
    props.value && props.value.orderId ? doc(getFirestore(firebase), 'orders', String(props.value.orderId)) : null,
    {
      snapshotListenOptions: { includeMetadataChanges: true }
    }
  )
  const [isSuccessToastOpen, setIsSuccessToastOpen] = useState(false)
  const [isErrorToastOpen, setIsErrorToastOpen] = useState(false)

  const updateOrderStatus = async (status: string) => {
    try {
      await updateDoc(orderDetails.ref, { orderStatus: status })
      setIsStatusToastOpen(true)
    } catch (error) {
      console.error(error)
    }
  }

  const [isEditing, setIsEditing] = useState(false)
  const handleEdit = () => {
    setIsEditing(true)
  }

  if (orderLoading) {
    return 'loading order...'
  }

  if (isEditing) {
    return <OrderDetailEdit {...props} />
  }

  return (
    <PrivateRoute>
      <CardContent>
        <div>
          <Grid container>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }} marginBottom={8}>
              <FormControl sx={{ marginRight: 3.5 }}>
                <InputLabel id='order-status-label'>Order status</InputLabel>
                <Select
                  labelId='order-status-label'
                  label='Order status'
                  value={orderDetails?.data().orderStatus}
                  onChange={async event => updateOrderStatus(event.target.value)}
                >
                  <MenuItem value='pending'>pending</MenuItem>
                  {props.value?.formType === 'hirePurchase' && (
                    <MenuItem value='accepted pending'>Accepted Pending</MenuItem>
                  )}
                  <MenuItem value='rejected'>Rejected</MenuItem>
                  <MenuItem value='accepted'>Accepted</MenuItem>
                </Select>
              </FormControl>
              {/* order status */}
              <Button onClick={handleEdit} variant='contained' sx={{ marginRight: 3.5 }}>
                Edit Order
              </Button>
            </Grid>

            <Grid container item xs={12} sm={true} spacing={7}>
              <Grid item xs={12}>
                {props.value?.formType === 'hirePurchase' && (
                  <FormControl sx={{ marginRight: 3.5 }}>
                    <InputLabel id='order-category-label'>Category</InputLabel>
                    <Select
                      labelId='order-category-label'
                      label='Category'
                      value={orderDetails?.data().category || ''}
                      onChange={async event => {
                        await updateDoc(orderDetails.ref, { category: event.target.value })
                      }}
                    >
                      <MenuItem value=''></MenuItem>
                      <MenuItem value='mpower'>MPower</MenuItem>
                      <MenuItem value='climate'>Climate</MenuItem>
                      <MenuItem value='smartbuy'>Smartbuy</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle1'> Customer Name:</Typography>
                <Typography>{props.value.customerName}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle1'>NRC:</Typography>
                <Typography>{props.value.nrc}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle1'>Employee Number:</Typography>
                <Typography>{props.value.employeeNumber}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle1'>Total Price:</Typography>
                <Typography>{`K${props.value.totalPrice}`}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle1'>Created By:</Typography>
                <Typography>{`${props.value.agentName}`}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle1'>Account Name:</Typography>
                <Typography>{`${props.value.accountName}`}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle1'>Account Number:</Typography>
                <Typography>{`${props.value.accountNumber}`}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle1'>Installment Amount:</Typography>
                <Typography>{`K${props.value.installmentAmount}`}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle1'>Order Status</Typography>
                <Typography>{props.value.orderStatus}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle1'>Is Order Collected</Typography>
                <Typography>{props.value.isCollected ? 'Yes' : 'No'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle1'>Reserve Attachment</Typography>
                <Typography>{props.value.reserveAttachment ? 'Yes' : 'No'}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant='subtitle1'>Department</Typography>
                <Typography>{props.value.formType}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle1'>Order Comment</Typography>
                <Typography>{props.value.comment}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle1'>Bank Name</Typography>
                <Typography>{props.value.bankName}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle1'>Branch Name</Typography>
                <Typography>{props.value.branchName}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant='subtitle1'>Collection Date</Typography>
                <Typography>{props.value.collectionDate}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle1'>Number Of Items</Typography>
                <Typography>{props.value.itemNum}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle1'>Month Of First Deduct</Typography>
                <Typography>{props.value.monthOfFirstDeduct}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle1'>Month Of Last Deduct</Typography>
                <Typography>{props.value.monthOfLastDeduct}</Typography>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6} sm={true}>
              <TransformWrapper>
                <TransformComponent>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography variant='subtitle1'>Attachments</Typography>
                    </Grid>
                    {props.value.attachments.map((attachment, index) => (
                      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }} key={index}>
                        <Card>
                          <TransformComponent>
                            <CardMedia component='img' image={attachment} alt={`Attachment ${index}`} />
                          </TransformComponent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </TransformComponent>
              </TransformWrapper>
            </Grid>
          </Grid>
          <Snackbar open={isSuccessToastOpen} autoHideDuration={6000} onClose={() => setIsSuccessToastOpen(false)}>
            <Alert severity='success' sx={{ width: '100%' }}>
              Order accepted successfully!
            </Alert>
          </Snackbar>
          <Snackbar open={isErrorToastOpen} autoHideDuration={6000} onClose={() => setIsErrorToastOpen(false)}>
            <Alert severity='error' sx={{ width: '100%' }}>
              Error while rejecting order.
            </Alert>
          </Snackbar>
          <Snackbar
            open={isStatusToastOpen}
            autoHideDuration={4000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            onClose={() => setIsStatusToastOpen(false)}
          >
            <Alert severity='success' variant='filled' sx={{ width: '100%' }}>
              Successfully update order status
            </Alert>
          </Snackbar>
        </div>
      </CardContent>
    </PrivateRoute>
  )
}

export default DetailOrder
