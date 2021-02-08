/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { SnackbarContent } from '@material-ui/core'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Snackbar, { SnackbarOrigin } from '@material-ui/core/Snackbar'
import { useTheme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import CloseIcon from '@material-ui/icons/Close'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import React, { useEffect } from 'react'
import styled from 'styled-components'

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein }
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9)
]

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
    setState({ ...state, open: false })
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

  const uploadList = (
    <Accordion expanded={openDetail}>
      <StyledAccordionSummary
        IconButtonProps={{ disableRipple: true, disableTouchRipple: true }}
        expandIcon={
          <>
            <ButtonDiv onClick={handleExpandIcon}>
              {openDetail ? (
                <ExpandLessIcon style={{ color: '#fafafa' }} />
              ) : (
                <ExpandMoreIcon style={{ color: '#fafafa' }} />
              )}
            </ButtonDiv>
            <IconButton onClick={handleCloseIcon}>
              <CloseIcon style={{ color: '#fafafa' }} />
            </IconButton>
          </>
        }
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Header>アップロードファイル</Header>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <FixedList aria-label="mailbox folders">
          <ListItem button>
            <ListItemText primary="Inbox" />
          </ListItem>
          <Divider />
          <ListItem button divider>
            <ListItemText primary="Drafts" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Trash" />
          </ListItem>
          <Divider light />
          <ListItem button>
            <ListItemText primary="Spam" />
          </ListItem>
        </FixedList>
      </StyledAccordionDetails>
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

const FixedList = styled(List)`
  width: 100%;
  &.MuiList-root {
    padding: 0;
  }
`

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
  color: white;
  background-color: #424242;
  min-height: 48px;
  &.MuiAccordionSummary-root {
    background-color: #424242;
    &.Mui-expanded {
      min-height: 48px;
    }
  }
  .MuiAccordionSummary-content {
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .MuiAccordionSummary-expandIcon {
    padding-top: 0px;
    padding-bottom: 0px;
    &.Mui-expanded {
      transform: unset;
    }
  }
`
const StyledAccordionDetails = styled(AccordionDetails)`
  &.MuiAccordionDetails-root {
    padding: 0;
  }
`
const StyledList = styled(List)``
const ButtonDiv = styled(IconButton)``

const FixedTable = styled(Table)``
