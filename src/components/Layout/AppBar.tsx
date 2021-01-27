/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Badge from '@material-ui/core/Badge'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MenuIcon from '@material-ui/icons/Menu'
import MoreIcon from '@material-ui/icons/MoreVert'
import NotificationsIcon from '@material-ui/icons/Notifications'
import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { DRAWER_WIDTH } from '../../common/const'
import { auth } from '../../common/firebase/firebaseClient'
import { AuthContext } from '../../context/AuthContext'

type Props = {
  authenticated: boolean
  open: boolean
  handleOpen: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export default function Appbar({
  authenticated,
  open,
  handleOpen
}: Props): JSX.Element {
  const history = useHistory()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const { setCurrentUser } = React.useContext(AuthContext)
  const [
    mobileMoreAnchorEl,
    setMobileMoreAnchorEl
  ] = React.useState<null | HTMLElement>(null)

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleLogout = async () => {
    await auth.signOut()
    if (setCurrentUser) {
      setCurrentUser(null)
    }
    window.location.href = '/'
  }
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  )

  const mobileMenuId = 'primary-search-account-menu-mobile'
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  )

  return (
    <>
      <FixedAppBar position="fixed" open={open}>
        <Toolbar>
          <StyledIconButton open={open} onClick={handleOpen}>
            <MenuIcon />
          </StyledIconButton>
          <Typography variant="h5" noWrap>
            test app
          </Typography>
          <FlexDiv />
          {authenticated ? (
            <>
              <SectionDesktop>
                <IconButton
                  aria-label="show 17 new notifications"
                  color="inherit"
                >
                  <Badge badgeContent={17} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </SectionDesktop>
              <SectionMobile>
                <IconButton
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  color="inherit"
                >
                  <MoreIcon />
                </IconButton>
              </SectionMobile>
            </>
          ) : (
            <Button variant="contained" color="primary" href="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </FixedAppBar>
      {authenticated && (
        <>
          {renderMobileMenu}
          {renderMenu}
        </>
      )}
    </>
  )
}

const FixedAppBar = styled(AppBar)<{ open?: boolean }>`
  z-index: ${(props) => props.theme.zIndex.drawer + 1};
  transition: ${(props) =>
    props.theme.transitions.create(['width', 'margin'], {
      easing: props.theme.transitions.easing.sharp,
      duration: props.theme.transitions.duration.leavingScreen
    })};
  ${(props) =>
    props.open &&
    `
      width: calc(100% - ${DRAWER_WIDTH}px);
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
  `}
`

const StyledIconButton = styled(({ ...rest }) => (
  <IconButton color="inherit" aria-label="open drawer" edge="start" {...rest} />
))`
  margin-right: 36px;
  display: ${(props) => (props.open ? 'none' : 'flex')};
`

const SectionDesktop = styled.div`
  display: none;
  ${(props) => props.theme.breakpoints.up('md')} {
    display: flex;
  }
`

const SectionMobile = styled.div`
  display: flex;
  ${(props) => props.theme.breakpoints.up('md')} {
    display: none;
  }
`
const FlexDiv = styled.div`
  display: flex;
  flex-grow: 1;
`
