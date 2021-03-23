import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import firebase, { db } from '../../common/firebase/firebaseClient'
import { RootState } from './../store'
import { DocumentInfo } from '../../schema/documentInfo'

interface TableRowData {
  name: string
  status: string
  fileSize: number
  modifiedAt: string
  tags: string[] | undefined
}

type TableData = Array<TableRowData>

type TableLoadAction = {
  tableData: TableData
  snapshot: string | undefined
  hasMoreItems: boolean
  errors?: any
}

type DocumentInfoState = {
  isFetching: boolean
  hasMoreItems: boolean
  tableData: TableData
  snapshot: string | undefined
  rowsPerPage: number
  errors: any
}

const initialState: DocumentInfoState = {
  isFetching: false,
  hasMoreItems: true,
  rowsPerPage: 10,
  tableData: [],
  snapshot: undefined,
  errors: {}
}

const createRowData = (
  doc: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
): TableRowData => {
  const docInfo = doc.data() as DocumentInfo
  let status = '未処理'
  if (docInfo.analyzeStatus?.parsedHtmlPath) {
    status = '解析完了'
  } else if (docInfo.analyzeStatus?.parsedHtmlPath) {
    status = 'パース完了'
  }
  return {
    name: docInfo.name,
    status: status,
    fileSize: docInfo.size,
    modifiedAt: docInfo.updatedAt.toDate().toLocaleDateString(),
    tags: docInfo.tags
  }
}

export const fetchDocumentInfo = createAsyncThunk<
  TableLoadAction,
  void,
  { state: RootState }
>('documentInfo/fetchData', async (_, thunkApi) => {
  const { auth, documentInfo } = thunkApi.getState()
  const workspace = auth.user?.workspaces?.[0]
  if (workspace == null) {
    return { tableData: [], snapshot: undefined, hasMoreItems: true }
  }

  try {
    let query = db
      .collection('workspaces')
      .doc(workspace)
      .collection('documents')
      .orderBy('updatedAt', 'desc')
    const { snapshot, rowsPerPage } = documentInfo
    if (snapshot != null) {
      // redux-toolkitでsnapshotを保存できないための暫定対処
      const lastDoc = await db.doc(snapshot).get()
      query = query.startAfter(lastDoc).limit(rowsPerPage)
    } else {
      query = query.limit(rowsPerPage)
    }

    const tableDataRef = await query.get()
    const tableDataDocs = tableDataRef.docs
    const updatedSnapshot = tableDataRef.docs[tableDataRef.size - 1].ref.path
    const hasMoreItems = tableDataDocs.length < rowsPerPage ? false : true
    const tableData = tableDataDocs.map(createRowData)

    return {
      tableData: tableData,
      snapshot: updatedSnapshot,
      hasMoreItems: hasMoreItems
    }
  } catch (error) {
    return {
      tableData: [],
      snapshot: undefined,
      errors: error,
      hasMoreItems: false
    }
  }
})

const documentInfoSlice = createSlice({
  name: 'documentInfo',
  initialState,
  reducers: {
    isFetching: (state) => {
      state.isFetching = true
    },
    endFetching: (state) => {
      state.isFetching = false
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDocumentInfo.pending, (state) => {
      return {
        ...state,
        isFetching: true
      }
    })
    builder.addCase(fetchDocumentInfo.fulfilled, (state, { payload }) => {
      return {
        ...state,
        tableData: state.tableData.concat(payload.tableData),
        isFetching: false,
        snapshot: payload.snapshot,
        hasMoreItems: payload.hasMoreItems
      }
    })
    builder.addCase(fetchDocumentInfo.rejected, (state, action) => {
      return {
        ...state,
        errors: action.error
      }
    })
  }
})

const { reducer, actions } = documentInfoSlice
export const { isFetching } = actions
export default reducer
