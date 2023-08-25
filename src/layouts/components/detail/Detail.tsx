import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { styled, useTheme } from '@mui/material/styles';

// Styled component for the triangle shaped background image
const TriangleImg = styled('img')({
  right: 0,
  bottom: 0,
  height: 170,
  position: 'absolute',
});

// Styled component for the Detail image
const DetailImg = styled('img')({
  right: 36,
  bottom: 20,
  height: 98,
  position: 'absolute',
});

const Detail = (props) => {
  console.log(`Props: ${JSON.stringify(props)}`);

  // ** Hook
  const theme = useTheme();
  const dateJoined = new Date(props.value.dateJoined.seconds * 1000 + props.value.dateJoined.nanoseconds / 1000000).toLocaleDateString();
  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png';

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
        <Typography variant='h5' sx={{ my: 4, color: 'primary.main' }}>
          {`${props.value.orderCount} Orders`}
        </Typography>
        <Typography variant='h5' sx={{ my: 4, color: 'primary.main' }}>
          {`${props.value.customerCount} Customers`}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Detail;
