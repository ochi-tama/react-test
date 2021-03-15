import { createSlice } from '@reduxjs/toolkit'
import firebase from '../../common/firebase/firebaseClient'

interface DocumentInfo {
  name: string
  status: string
  fileSize: number
  modifiedAt: string
  tags: string[] | undefined
}

type DocumentInfoState = {
  isFetching: boolean
  hasMoreItems: boolean
  tableData: [] | DocumentInfo[]
  snapshot:
    | firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    | undefined
  rowsPerPage: number
}

const initialState: DocumentInfoState = {
  isFetching: false,
  hasMoreItems: true,
  rowsPerPage: 10,
  tableData: [],
  snapshot: undefined
}

const documentInfoSlice = createSlice({
  name: 'documentInfo',
  initialState,
  reducers: {},
  extraReducers: {}
})

const { reducer, actions } = documentInfoSlice
export { actions }
export default reducer
