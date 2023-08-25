// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'


const Navigation = (): VerticalNavItemsType => {


  return [
    {
      title: 'Home',
      icon: HomeOutline,
      path: '/',
    },
    {
      title: 'Orders',
      icon: Login,
      path: '/pages/orders',
      openInNewTab: false
    },
    {
      title: 'Customers',
      icon: AccountPlusOutline,
      path: '/pages/customers',
      openInNewTab: false
    },
    {
      title: 'Agents',
      icon: AlertCircleOutline,
      path: '/pages/agents',
      openInNewTab: false
    },

    {
      sectionTitle: 'Actions'
    },

    {
      title: 'Generate Code',
      icon: Login,
      path: '/pages/admin',
      openInNewTab: false
    },
    {
      title: 'Pending Orders',
      icon: Login,
      path: '/pages/pendingorders',
      openInNewTab: false
    },
    {
      title: 'Accepted Orders',
      icon: AccountPlusOutline,
      path: '/pages/acceptedorders',
      openInNewTab: false
    },
    {
      title: 'Rejected Orders',
      icon: AlertCircleOutline,
      path: '/pages/rejectedorders',
      openInNewTab: false
    },
    {
      sectionTitle: 'Account'
    },
    {
      title: 'Profile',
      icon: AccountCogOutline,
      path: '/account-settings'
    },


  ]
}

export default Navigation
