/* eslint-disable no-console */
import CircularProgress from '@material-ui/core/CircularProgress'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import DescriptionIcon from '@material-ui/icons/Description'
import DoneIcon from '@material-ui/icons/Done'
import React from 'react'
import styled from 'styled-components'

type Props = {
  file: File
  progress: number
  uploaded: boolean
}

function ProgressListItem({ file, progress, uploaded }: Props): JSX.Element {
  console.log('file list item renderd')
  const progressCircle = React.useMemo(() => {
    if (uploaded) {
      return <DoneIcon />
    } else {
      return (
        <CircularProgress size={25} variant="determinate" value={progress} />
      )
    }
  }, [progress, uploaded])

  const fileIcon = React.useMemo(() => {
    const fileType = file.name.split('.').pop()
    const icon =
      fileType === 'pdf' ? (
        <DescriptionIcon color="secondary" />
      ) : (
        <DescriptionIcon color="primary" />
      )
    return icon
  }, [file])

  return (
    <ListItem key={file.name}>
      <ListItemIcon>{fileIcon}</ListItemIcon>
      <OverflowListItemText>{file.name} </OverflowListItemText>
      <ListItemSecondaryAction>{progressCircle}</ListItemSecondaryAction>
    </ListItem>
  )
}

export default React.memo(ProgressListItem)

const OverflowListItemText = styled(ListItemText)`
  .MuiTypography-root {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`
