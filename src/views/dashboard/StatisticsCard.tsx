// ** React Imports
import {ReactElement, useState} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import TrendingUp from 'mdi-material-ui/TrendingUp'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import {NaturePeople} from "mdi-material-ui";

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import {useCollection} from "react-firebase-hooks/firestore";
import {collection, getFirestore} from "firebase/firestore";
import firebase from "../../firebase/config";
import {useRouter} from "next/router";


interface DataType {
  stats: number | undefined
  title: string
  color: ThemeColor
  icon: ReactElement,
  route: string
}

const RenderStats = () => {
  const [usersValue, usersLoading, usersError] = useCollection(
    collection(getFirestore(firebase), 'users')
  );

  const [ordersValue, ordersLoading, ordersError] = useCollection(
    collection(getFirestore(firebase), 'orders')
  );

  const [customersValue, customersLoading, customersError] = useCollection(
    collection(getFirestore(firebase), 'customers')
  );

  const statsData: DataType[] = [
    {
      stats: usersValue?.size,
      title: 'Agents',
      color: 'primary',
      icon: <AccountOutline sx={{ fontSize: '1.75rem' }} />,
      route: '/pages/agents'
    },
    {
      stats: ordersValue?.size,
      title: 'Orders',
      color: 'success',
      icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />,
      route: '/pages/orders'

    },
    {
      stats: customersValue?.size,
      color: 'warning',
      title: 'Customers',
      icon: <NaturePeople sx={{ fontSize: '1.75rem' }} />,
      route: '/pages/customers'
    }
  ];

  const router = useRouter()

  if (usersLoading || ordersLoading || customersLoading) {
    return 'Loading...';
  }

  if (usersError || ordersError || customersError) {
    return `Error: ${usersError?.message || ordersError?.message || customersError?.message}`;
  }


  // usersValue?.forEach((doc) => {
  //   const data = doc.data();
  //   console.log(data);
  // });


  return statsData.map((item: DataType, index: number) => (
    <Grid item xs={12} sm={3} key={index}>
      <Box onClick={() => router.push(`${item.route}`)} key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant='rounded'
          sx={{
            mr: 3,
            width: 44,
            height: 44,
            boxShadow: 3,
            color: 'common.white',
            backgroundColor: `${item.color}.main`
          }}
        >
          {item.icon}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='caption'>{item.title}</Typography>
          <Typography variant='h6'>{item.stats}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

const StatisticsCard = () => {

  return (
    <Card>
      <CardHeader
        title='Statistics'
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }

        // subheader={
        //   <Typography variant='body2'>
        //     <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
        //       Total 48.5% growth
        //     </Box>{' '}
        //     😎 this month
        //   </Typography>
        // }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {RenderStats()}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default StatisticsCard
