// ** Icon imports
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline';
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline';
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline';
import HomeOutline from 'mdi-material-ui/HomeOutline';
import Login from 'mdi-material-ui/Login';
import { Clock } from 'mdi-material-ui';

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types';


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
      title: 'Accepted Pending Orders',
      icon: Clock,
      path: '/pages/acceptedpending',
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


  ];
};

export default Navigation;
