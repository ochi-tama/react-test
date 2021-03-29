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
import firebase, { storage } from '../../common/firebase/firebaseClient'
import { AuthContext } from '../../context/AuthContext'
import { fetchDocumentInfo } from '../../redux/documentInfo/documentInfoSlice'
import { useDispatch, useSelector } from '../../redux/store'
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

export interface FileInfo {
  file: File
  progress: number
  uploaded: boolean
}

export interface FileToUpload {
  [name: string]: FileInfo
}

function Document(): JSX.Element {
  const documentInfoState = useSelector((state) => state.documentInfo)
  const authState = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const { isFetching, hasMoreItems, tableData } = documentInfoState
  const [openSnackbar, setOpenSnackbar] = React.useState(false)
  const [fileList, setFileList] = React.useState<FileToUpload>({})
  const { currentUser, info } = React.useContext(AuthContext)

  React.useEffect(() => {
    // user 情報のセット後に発火させる
    if (hasMoreItems == true) {
      dispatch(fetchDocumentInfo())
    }
  }, [authState.user])

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

  /*
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value)
  }
  */

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetchItems = React.useCallback(async (page: number) => {
    dispatch(fetchDocumentInfo())
  }, [])

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
  const items = React.useMemo(() => {
    return tableData.map((row) => {
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
  }, [tableData])
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
            // initialLoadは無効にする
            initialLoad={false}
            // https://github.com/danbovey/react-infinite-scroller/issues/143#issuecomment-736507748
            // hasMoreはデータFetch中はfalseにしないと二重ロードが発生する
            hasMore={!isFetching && hasMoreItems && !!authState.uid}
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
