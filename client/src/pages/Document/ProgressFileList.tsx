/* eslint-disable no-console */
import React from 'react'
import { FileToUpload } from './Document'
import ProgressListItem from './ProgressListItem'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import styled from 'styled-components'

type Props = {
  fileList: FileToUpload
}

function ProgressFileList({ fileList }: Props): JSX.Element {
  console.log('file list renderd')

  const size = Object.keys(fileList).length

  return (
    <FixedList aria-label="document to upload">
      {Object.keys(fileList).map((key, index) => {
        if (index !== size - 1) {
          return (
            <React.Fragment key={index}>
              <ProgressListItem {...fileList[key]} />
              <Divider />
            </React.Fragment>
          )
        } else {
          return (
            <React.Fragment key={index}>
              <ProgressListItem {...fileList[key]} />
            </React.Fragment>
          )
        }
      })}
    </FixedList>
  )
}
export default ProgressFileList

const FixedList = styled(List)`
  width: 100%;
  &.MuiList-root {
    padding: 0;
    overflow: auto;
    max-height: 250px;
  }
`
