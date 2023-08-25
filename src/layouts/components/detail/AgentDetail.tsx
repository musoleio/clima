import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { styled, useTheme } from '@mui/material/styles';
import AllOrdersByAgent from "./AllOrdersByAgent";
import {useState} from "react";
import AllCustomersByAgent from "./AllCustomersByAgent";

// Styled component for the triangle shaped background image
const TriangleImg = styled('img')({
  right: 0,
  bottom: 0,
  height: 170,
  position: 'absolute',
});

// Styled component for the DetailAgent image
const DetailAgentImg = styled('img')({
  right: 36,
  bottom: 20,
  height: 98,
  position: 'absolute',
});

const DetailAgent = (props) => {
  console.log(`Props: ${JSON.stringify(props)}`);


  // ** Hook
  const theme = useTheme();
  const [isNavToDetail, setIsNavToDetail] = useState(false)
  const [isNavToCusDetail, setIsNavToCusDetail] = useState(false)
  const dateJoined = new Date(props.value.dateJoined.seconds * 1000 + props.value.dateJoined.nanoseconds / 1000000).toLocaleDateString();
  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png';

  const handleNavToDetail = () => {
    setIsNavToDetail(true)
  }
  const handleIsNavToCusDetail = () => {
    setIsNavToCusDetail(true)
  }
  if (isNavToDetail) {
    return <AllOrdersByAgent {...props}/>
  }

  if (isNavToCusDetail) {
    return <AllCustomersByAgent {...props}/>
  }


  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent sx={{ textAlign: 'center', margin: '0 auto' }}>
        <Typography variant='h6'>{`${props.value.firstName} ${props.value.lastName}`}</Typography>
        <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
          {`Email: ${props.value.email}`}
        </Typography>
        <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
          {`Phone: ${props.value.phoneNumber}`}
        </Typography>
        <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
          {`District: ${props.value.district}`}
        </Typography>
        <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
          { `Date joined: ${dateJoined}` }
        </Typography>
        <Button variant='contained' color='primary' onClick={handleNavToDetail} sx={{ marginRight: '8px' }}>
          {`${props.value.orderCount} Orders`}
        </Button>
        <Button variant='contained' color='primary' onClick={handleIsNavToCusDetail}>
          {`${props.value.customerCount} Customers`}
        </Button>

      </CardContent>
    </Card>
  );
};

export default DetailAgent;
