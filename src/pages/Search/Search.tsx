/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import clsx from 'clsx'
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme
} from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'
import styled from 'styled-components'

export default function MiniDrawer(): JSX.Element {
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)

  const handleDrawerOpen = () => {
    console.log(open)

    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <>
      <FixedAppBar position="fixed" open={open}>
        <Toolbar>
          <StyledIconButton open={open} onClick={handleDrawerOpen}>
            <MenuIcon />
          </StyledIconButton>
          <Typography variant="h5" noWrap>
            test app
          </Typography>
        </Toolbar>
      </FixedAppBar>
      <SideDrawer open={open} variant="permanent">
        <CloseMenuIcon>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </CloseMenuIcon>
        <Divider />
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </SideDrawer>
      <MainContent>
        <SpacerDiv />
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
          dolor purus non enim praesent elementum facilisis leo vel. Risus at
          ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum
          quisque non tellus. Convallis convallis tellus id interdum velit
          laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed
          adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
          integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
          eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
          quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
          vivamus at augue. At augue eget arcu dictum varius duis at consectetur
          lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien
          faucibus et molestie ac.
        </Typography>
        <Typography paragraph>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
          ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
          elementum integer enim neque volutpat ac tincidunt. Ornare suspendisse
          sed nisi lacus sed viverra tellus. Purus sit amet volutpat consequat
          mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis
          risus sed vulputate odio. Morbi tincidunt ornare massa eget egestas
          purus viverra accumsan in. In hendrerit gravida rutrum quisque non
          tellus orci ac. Pellentesque nec nam aliquam sem et tortor. Habitant
          morbi tristique senectus et. Adipiscing elit duis tristique
          sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
          eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
          posuere sollicitudin aliquam ultrices sagittis orci a.
        </Typography>
      </MainContent>
    </>
  )
}

const drawerWidth = 240

const SpacerDiv = styled.div`
  offset: ${(props) => props.theme.mixins.toolbar};
`

const SideDrawer = styled(({ open, ...rest }) => (
  // classes paper を上書きする
  <Drawer variant="permanent" {...rest} classes={{ paper: 'drawer-paper' }} />
))`
  flex-shrink: 0;
  white-space: nowrap;
  width: ${(props) =>
    props.open ? drawerWidth : props.theme.spacing(7) + 1}px;
  transition: ${(props) =>
    props.open
      ? props.theme.transitions.create('width', {
          easing: props.theme.transitions.easing.sharp,
          duration: props.theme.transitions.duration.enteringScreen
        })
      : props.theme.transitions.create('width', {
          easing: props.theme.transitions.easing.sharp,
          duration: props.theme.transitions.duration.leavingScreen
        })};
  overflow-x: ${(props) => !props.open && 'hidden'};
  ${(props) => props.theme.breakpoints.up('sm')} {
    width: theme.spacing(9) + 1;
  }

  & .drawer-paper {
    width: ${(props) =>
      props.open ? drawerWidth : props.theme.spacing(7) + 1}px;
    transition: ${(props) =>
      props.open
        ? props.theme.transitions.create('width', {
            easing: props.theme.transitions.easing.sharp,
            duration: props.theme.transitions.duration.enteringScreen
          })
        : props.theme.transitions.create('width', {
            easing: props.theme.transitions.easing.sharp,
            duration: props.theme.transitions.duration.leavingScreen
          })};
    overflow-x: 'hidden';
    ${(props) => props.theme.breakpoints.up('sm')} {
      width: theme.spacing(9) + 1;
    }
  }
`

const MainContent = styled.main`
  flex-grow: 1;
  padding: ${(props) => props.theme.spacing(3)}px;
`

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
      width: calc(100% - ${drawerWidth}px);
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
  `}
`

const StyledIconButton = styled(({ open: boolean, ...rest }) => (
  <IconButton color="inherit" aria-label="open drawer" edge="start" {...rest} />
))`
  margin-right: 36px;
  display: ${(props) => (props.open ? 'none' : 'flex')};
`

const CloseMenuIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: ${(props) => props.theme.spacing(0, 1)};
  offset: ${(props) => props.theme.mixins.toolbar};
`
