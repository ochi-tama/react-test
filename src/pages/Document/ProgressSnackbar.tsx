/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { SnackbarContent } from '@material-ui/core'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Snackbar, { SnackbarOrigin } from '@material-ui/core/Snackbar'
import { useTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import CloseIcon from '@material-ui/icons/Close'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import React, { useEffect } from 'react'
import styled from 'styled-components'

export interface State extends SnackbarOrigin {
  open: boolean
}

function ProgressSnackbar(): JSX.Element {
  const [state, setState] = React.useState<State>({
    open: true,
    vertical: 'bottom',
    horizontal: 'right'
  })
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))

  const [openDetail, setOpenDetail] = React.useState<boolean>(true)
  const { vertical, horizontal, open } = state

  useEffect(() => {
    console.log(matches)
    const position = matches ? 'right' : 'left'
    setState({ ...state, horizontal: position })
  }, [matches])

  const handleClickAway = () => {
    setState({ ...state, open: true })
  }

  const handleCloseIcon = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()
    console.log('clicked')
  }

  const handleExpandIcon = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()
    setOpenDetail(!openDetail)
  }

  const handleClose = () => {
    setState({ ...state, open: false })
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setOpenDetail(isExpanded)
  }
  /*
  .MuiAccordionSummary-expandIcon.Mui-expanded
  */

  const uploadList = (
    <Accordion expanded={openDetail}>
      <StyledAccordionSummary
        IconButtonProps={{ disableRipple: true, disableTouchRipple: true }}
        expandIcon={
          <>
            <ButtonDiv onClick={handleExpandIcon}>
              {openDetail ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ButtonDiv>
            <IconButton onClick={handleCloseIcon}>
              <CloseIcon />
            </IconButton>
          </>
        }
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Header>アップロードファイル</Header>
      </StyledAccordionSummary>
      <AccordionDetails>
        <Typography>
          Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
        </Typography>
      </AccordionDetails>
    </Accordion>
  )

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton aria-label="close" color="inherit" onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </React.Fragment>
  )

  const content = (
    <>
      <SnackbarContent message={'アップロードファイル'} action={action} />
    </>
  )

  return (
    <StyledSnackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={handleClose}
      message={uploadList}
      key={vertical + horizontal}
      action={action}
      ClickAwayListenerProps={{
        mouseEvent: false
      }}
    >
      {uploadList}
    </StyledSnackbar>
  )
}

export default ProgressSnackbar

// TODO: XS時に真ん中に寄せられていない
const StyledSnackbar = styled(Snackbar)`
  width: 90vw;
  ${(props) => props.theme.breakpoints.up('sm')} {
    width: 30vw;
  }
`

const Header = styled(Typography)`
  font-size: ${(props) => props.theme.typography.pxToRem(15)};
  flex-shrink: 0;
`
const Close = styled(CloseIcon)``

const SecondHeader = styled(Typography)`
  font-size: ${(props) => props.theme.typography.pxToRem(15)};
  color: ${(props) => props.theme.palette.text.secondary};
`

const StyledAccordionSummary = styled(AccordionSummary)`
  .MuiAccordionSummary-expandIcon {
    &.Mui-expanded {
      transform: unset;
    }
  }
`
const ButtonDiv = styled(IconButton)``
