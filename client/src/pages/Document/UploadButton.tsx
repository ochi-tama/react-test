import Button from '@material-ui/core/Button'
import React from 'react'
import styled from 'styled-components'

type Props = {
  handler: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function UploadButtons({ handler }: Props): JSX.Element {
  return (
    <RootDiv>
      <HiddenInput
        accept="image/*"
        id="contained-button-file"
        multiple
        type="file"
        onChange={handler}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span">
          Upload
        </Button>
      </label>
    </RootDiv>
  )
}

const RootDiv = styled.div`
  & > * {
    margin: ${(props) => props.theme.spacing(1)};
  }
`
const HiddenInput = styled.input`
  display: none;
`

export default UploadButtons
