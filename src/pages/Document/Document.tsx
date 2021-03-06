/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { Chip } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import update from 'immutability-helper'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import styled from 'styled-components'
import { extractFolderName } from '../../common/common'
import firebase, { db, storage } from '../../common/firebase/firebaseClient'
import { AuthContext } from '../../context/AuthContext'
import { DocumentInfo } from '../../schema/documentInfo'
import ProgresSnackBar from './ProgressSnackbar'
import UploadButton from './UploadButton'

interface Column {
  id: 'name' | 'modifiedAt' | 'fileSize' | 'status' | 'tags'
  columnName: string
  minWidth?: number
  align?: 'right' | 'left'
}

const columns: Column[] = [
  { id: 'name', columnName: 'ファイル名' },
  { id: 'status', columnName: 'ステータス' },
  {
    id: 'fileSize',
    columnName: 'ファイル容量',
    align: 'right'
  },
  {
    id: 'modifiedAt',
    columnName: '変更日',
    align: 'right'
  },
  {
    id: 'tags',
    columnName: 'タグ'
  }
]

interface Data {
  name: string
  status: string
  fileSize: number
  modifiedAt: string
  tags: string[] | undefined
}

export interface FileInfo {
  file: File
  progress: number
  uploaded: boolean
}

export interface FileToUpload {
  [name: string]: FileInfo
}

function Document(): JSX.Element {
  const [currentSnapshot, setCurrentSnapshot] = React.useState<
    firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
  >()
  const [hasMoreItems, setHasMoreItems] = React.useState<boolean>(true)
  const [isFetching, setIsFetching] = React.useState<boolean>(false)
  const [tableData, setTableData] = React.useState<Data[]>([])
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [openSnackbar, setOpenSnackbar] = React.useState(false)
  const [fileList, setFileList] = React.useState<FileToUpload>({})
  const { currentUser, info } = React.useContext(AuthContext)

  const handleCloseSnackbarIcon = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()
    setOpenSnackbar(false)
    setFileList({})
  }
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
    setFileList({})
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value)
  }

  const handlefileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files as FileList)
    const newFileList = Object.assign({}, fileList)
    files.forEach((file) => {
      newFileList[file.name] = { file: file, progress: 0, uploaded: false }
    })
    setFileList(() => {
      return newFileList
    })
    setOpenSnackbar(true)
    await Promise.all(files.map(uploadFiles))
  }

  const fetchItems = async (page: number) => {
    setIsFetching(true)
    const workspace = info?.workspaces?.[0]
    if (workspace == null) {
      setIsFetching(false)
      return
    }

    try {
      let nextPageListQuery = db
        .collection('workspaces')
        .doc(workspace)
        .collection('documents')
        .orderBy('updatedAt', 'desc')

      if (currentSnapshot != null) {
        nextPageListQuery = nextPageListQuery
          .startAfter(currentSnapshot?.docs[currentSnapshot.size - 1])
          .limit(rowsPerPage)
      } else {
        nextPageListQuery = nextPageListQuery.limit(rowsPerPage)
      }

      const nextPageListRef = await nextPageListQuery.get()
      const nextPageDocs = nextPageListRef.docs
      if (nextPageDocs.length < rowsPerPage) {
        setHasMoreItems(false)
      }

      const rows: Data[] = nextPageDocs.map(createRowData)
      setCurrentSnapshot(() => {
        return nextPageListRef
      })

      setTableData((prevState) => {
        const data = prevState.slice()
        data.push(...rows)
        return data
      })
      setIsFetching(false)
    } catch (error) {
      console.log(error)
      setIsFetching(false)
    }
  }

  const createRowData = (
    doc: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
  ): Data => {
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

  const uploadFiles = async (file: File) => {
    const storageRef = storage.ref()
    // TODO: Userから所属テナントを切り替えられるようにする
    // Updateトリガー実行時にユーザー情報を紐付けるためのメタデータを付与
    const metadata: firebase.storage.UploadMetadata = info?.workspaces
      ? {
          customMetadata: {
            workspace: info?.workspaces[0],
            lastUpdatedBy: currentUser?.uid as string
          }
        }
      : {}
    // ファイル名(拡張子を除く)を取得する
    const folderName = extractFolderName(file.name)
    const uploadTask = storageRef
      .child(`${info?.workspaces?.[0]}/${folderName}/${file.name}`)
      .put(file, metadata)
    try {
      uploadTask.on('state_changed', (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        const uploaded = progress >= 100 ? true : false
        setFileList((prevState) => {
          const name = file.name
          const newState = update(prevState, {
            [name]: {
              $set: { file: file, progress: progress, uploaded: uploaded }
            }
          })
          return newState
        })

        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            break
          case firebase.storage.TaskState.RUNNING: // or 'running'
            break
        }
      })
    } catch (error) {
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        console.log('File available at', downloadURL)
      })
    } finally {
      console.log('Upload ' + file.name + ' done')
    }
  }
  const loader = <tr className="loader">Loading ...</tr>

  const items = tableData.map((row) => {
    const rowData = (
      <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
        {columns.map((column) => {
          const value = row[column.id]
          const content =
            column.id === 'tags' ? (
              <SpacerDiv>
                {(value as string[]).map((tag) => (
                  <MarginedChip key={tag} label={tag} />
                ))}
              </SpacerDiv>
            ) : (
              value
            )
          return (
            <TableCell key={column.id} align={column.align}>
              {content}
            </TableCell>
          )
        })}
      </TableRow>
    )
    return rowData
  })

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          ドキュメント一覧
        </Grid>
        <MenuGridContainer container justify="flex-end">
          <Grid item>
            <UploadButton handler={handlefileUpload} />
          </Grid>
        </MenuGridContainer>
        <Grid item xs={12}></Grid>
      </Grid>
      <ProgresSnackBar
        open={openSnackbar}
        fileList={fileList}
        handleCloseIcon={handleCloseSnackbarIcon}
        handleClose={handleCloseSnackbar}
      />
      <RootPaper>
        <StyledTableContainer>
          <InfiniteScroll
            pageStart={0}
            loadMore={fetchItems}
            // https://github.com/danbovey/react-infinite-scroller/issues/143#issuecomment-736507748
            // hasMoreはデータFetch中はfalseにしないと二重ロードが発生する
            hasMore={!isFetching && hasMoreItems}
            useWindow={false}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.columnName}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>{items}</TableBody>
            </Table>
          </InfiniteScroll>
        </StyledTableContainer>
      </RootPaper>
    </>
  )
}

const RootPaper = styled(Paper)`
  width: 100%;
`
const StyledTableContainer = styled(TableContainer)`
  max-height: 700px;
`
const MenuGridContainer = styled(Grid)`
  margin-bottom: 1em;
`
const SpacerDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: ${(props) => props.theme.spacing(0.5)};
`
const MarginedChip = styled(Chip)`
  margin-right: ${(props) => props.theme.spacing(0.5)}px;
`
const InfDiv = styled.div`
  height: 400px;
  overflow: auto;
`

/*
const tableFooter = (
  <TablePagination
    rowsPerPageOptions={[10, 25, 100]}
    component="div"
    count={tableData.length}
    rowsPerPage={rowsPerPage}
    page={page}
    onChangePage={handleChangePage}
    onChangeRowsPerPage={handleChangeRowsPerPage}
  />
)
*/

export default Document
