import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'
import React from 'react'
import styled from 'styled-components'
import { DRAWER_WIDTH } from '../../common/const'

type Props = {
  open: boolean
  handleOpen: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export default function Appbar({ open, handleOpen }: Props): JSX.Element {
  return (
    <FixedAppBar position="fixed" open={open}>
      <Toolbar>
        <StyledIconButton open={open} onClick={handleOpen}>
          <MenuIcon />
        </StyledIconButton>
        <Typography variant="h5" noWrap>
          test app
        </Typography>
      </Toolbar>
    </FixedAppBar>
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
