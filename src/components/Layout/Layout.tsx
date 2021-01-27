import React from 'react'
import styled from 'styled-components'
import AppBar from '../../components/Layout/AppBar'
import ExpandableDrawer from '../../components/Layout/ExpandableDrawer'

type Props = {
  authenticated: boolean
  children: JSX.Element[] | JSX.Element
}

export default function Layout({
  authenticated,
  children
}: Props): JSX.Element {
  const [open, setOpen] = React.useState(true)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <>
      <AppBar
        authenticated={authenticated}
        open={open}
        handleOpen={handleDrawerOpen}
      />
      <ExpandableDrawer open={open} handleClose={handleDrawerClose} />
      <MainContent>
        <SpacerDiv />
        {children}
      </MainContent>
    </>
  )
}

const SpacerDiv = styled.div`
  offset: ${(props) => props.theme.mixins.toolbar};
`

const MainContent = styled.main`
  flex-grow: 1;
  padding: ${(props) => props.theme.spacing(3)}px;
`
