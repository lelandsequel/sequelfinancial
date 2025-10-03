import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  Payment as PaymentIcon,
  AccountTree as AccountTreeIcon,
  SwapHoriz as SwapHorizIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 280;

interface AppLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardIcon />,
  },
  {
    id: 'assets',
    label: 'Assets',
    path: '/assets',
    icon: <AccountBalanceIcon />,
  },
  {
    id: 'liabilities',
    label: 'Liabilities',
    path: '/liabilities',
    icon: <PaymentIcon />,
  },
  {
    id: 'equity',
    label: 'Equity',
    path: '/equity',
    icon: <TrendingUpIcon />,
  },
  {
    id: 'revenue',
    label: 'Revenue',
    path: '/revenue',
    icon: <ReceiptIcon />,
  },
  {
    id: 'expenses',
    label: 'Expenses',
    path: '/expenses',
    icon: <PaymentIcon />,
  },
  {
    id: 'divider1',
    type: 'divider',
  },
  {
    id: 'chart-of-accounts',
    label: 'Chart of Accounts',
    path: '/chart-of-accounts',
    icon: <AccountTreeIcon />,
  },
  {
    id: 'transactions',
    label: 'Transactions',
    path: '/transactions',
    icon: <SwapHorizIcon />,
  },
  {
    id: 'transaction-wizard',
    label: 'New Transaction',
    path: '/transactions/new',
    icon: <AddIcon />,
  },
];

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          Tsunami CandL
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navigationItems.map((item) => {
          if (item.type === 'divider') {
            return <Divider key={item.id} sx={{ my: 1 }} />;
          }

          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  backgroundColor: isActive ? theme.palette.action.selected : 'transparent',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Accounting System
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="navigation menu"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};
