/* eslint-disable no-console */
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import CircularProgress from '@material-ui/core/CircularProgress'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Snackbar, { SnackbarOrigin } from '@material-ui/core/Snackbar'
import { useTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import CloseIcon from '@material-ui/icons/Close'
import DescriptionIcon from '@material-ui/icons/Description'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import React, { useEffect } from 'react'
import styled from 'styled-components'

export interface State extends SnackbarOrigin {
  open: boolean
}

type Props = {
  open: boolean
  fileList: File[]
  handleCloseIcon: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void
  handleClose: () => void
}

// TODO: ファイルアップロード中に閉じる場合は警告が出るようにする
function ProgressSnackbar({
  open: openByParent,
  fileList,
  handleCloseIcon,
  handleClose
}: Props): JSX.Element {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))

  const [state, setState] = React.useState<State>({
    open: true,
    vertical: 'bottom',
    horizontal: 'right'
  })
  const [openDetail, setOpenDetail] = React.useState<boolean>(true)

  const { vertical, horizontal, open } = state

  useEffect(() => {
    const position = matches ? 'right' : 'left'
    setState({ ...state, horizontal: position })
  }, [matches])

  useEffect(() => {
    setState({ ...state, open: openByParent })
  }, [openByParent])

  const handleExpandIcon = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()
    setOpenDetail(!openDetail)
  }

  const progressList = React.useMemo(() => {
    const fileNum = fileList.length
    const listItems = fileList.map((file, index) => {
      const fileType = file?.name.split('.').pop()
      let fileIcon
      if (fileType === 'pdf') {
        fileIcon = <DescriptionIcon color="secondary" />
      } else {
        fileIcon = <DescriptionIcon color="primary" />
      }
      return (
        <React.Fragment key={index}>
          <ListItem>
            <ListItemIcon>{fileIcon}</ListItemIcon>
            <OverflowListItemText>{file?.name} </OverflowListItemText>
            <ListItemSecondaryAction>
              <CircularProgress size={25} variant="determinate" value={100} />
            </ListItemSecondaryAction>
          </ListItem>
          {index !== fileNum - 1 && <Divider />}
        </React.Fragment>
      )
    })
    return <FixedList aria-label="document to upload">{listItems}</FixedList>
  }, [fileList])
  const uploadList = (
    <StyledAccordion expanded={openDetail}>
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
      <StyledAccordionDetails>{progressList}</StyledAccordionDetails>
    </StyledAccordion>
  )

  return (
    <StyledSnackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={handleClose}
      message={uploadList}
      key={vertical + horizontal}
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
    overflow: auto;
    max-height: 250px;
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
const StyledAccordion = styled(Accordion)`
  width: 90vw;
  ${(props) => props.theme.breakpoints.up('sm')} {
    width: 30vw;
  }
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
const ButtonDiv = styled(IconButton)``

const OverflowListItemText = styled(ListItemText)`
  .MuiTypography-root {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`
