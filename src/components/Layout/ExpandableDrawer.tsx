import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { useTheme } from '@material-ui/core/styles'
import BookmarksIcon from '@material-ui/icons/Bookmarks'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import CommentIcon from '@material-ui/icons/Comment'
import HistoryIcon from '@material-ui/icons/History'
import SearchIcon from '@material-ui/icons/Search'
import HomeIcon from '@material-ui/icons/Home'
import SettingsIcon from '@material-ui/icons/Settings'
import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { DRAWER_WIDTH } from '../../common/const'

type Props = {
  open: boolean
  handleClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export default function ExpandbleDrawer({
  open,
  handleClose
}: Props): JSX.Element {
  const theme = useTheme()
  return (
    <SideDrawer open={open} variant="permanent">
      <CloseMenuIcon>
        <IconButton onClick={handleClose}>
          {theme.direction === 'rtl' ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </CloseMenuIcon>
      <Divider />
      <List>
        <StyledNavLink exact to="/">
          <ListItem button>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={'ホーム'} />
          </ListItem>
        </StyledNavLink>
        <StyledNavLink exact to="/search">
          <ListItem button>
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary={'検索'} />
          </ListItem>
        </StyledNavLink>
        <StyledNavLink exact to="/bookmarks">
          <ListItem button>
            <ListItemIcon>
              <BookmarksIcon />
            </ListItemIcon>
            <ListItemText primary={'ブックマーク'} />
          </ListItem>
        </StyledNavLink>
        <StyledNavLink exact to="/history">
          <ListItem button>
            <ListItemIcon>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText primary={'履歴'} />
          </ListItem>
        </StyledNavLink>
        <StyledNavLink exact to="/comments">
          <ListItem button>
            <ListItemIcon>
              <CommentIcon />
            </ListItemIcon>
            <ListItemText primary={'コメント'} />
          </ListItem>
        </StyledNavLink>
      </List>
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={'設定'} />
        </ListItem>
      </List>
    </SideDrawer>
  )
}
const SideDrawer = styled(({ ...rest }) => (
  // classes paper を上書きする
  <Drawer variant="permanent" {...rest} classes={{ paper: 'drawer-paper' }} />
))`
  flex-shrink: 0;
  white-space: nowrap;
  width: ${(props) =>
    props.open ? DRAWER_WIDTH : props.theme.spacing(7) + 1}px;
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
      props.open ? DRAWER_WIDTH : props.theme.spacing(7) + 1}px;
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

const CloseMenuIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: ${(props) => props.theme.spacing(0, 1)};
  offset: ${(props) => props.theme.mixins.toolbar};
`

const StyledNavLink = styled(NavLink).attrs({ activeClassName: 'active' })`
  text-decoration: none;
  color: black;
  &.active {
    background: rgba(0, 0, 0, 0.08);
    width: 100%;
    display: inline-block;
  }
`
