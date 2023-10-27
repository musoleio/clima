// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports

// ** Custom Components Imports

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import Table from 'src/views/dashboard/Table'
import PrivateRoute from "./privateRoute"

const Dashboard = ({ name }) => {
  return (
    <PrivateRoute>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} md={8}>
            <StatisticsCard />
          </Grid>
          <Grid item xs={12}>
            <Table />
          </Grid>
        </Grid>
      </ApexChartWrapper>
    </PrivateRoute>
  )
}

export default Dashboard
