/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import React from 'react'
import styled from 'styled-components'
import firebase, { storage } from '../../common/firebase/firebaseClient'
import ProgresSnackBar from './ProgressSnackbar'
import UploadButton from './UploadButton'
import update from 'immutability-helper'

interface Column {
  id: 'name' | 'modifiedAt' | 'fileSize' | 'status' | 'tags'
  columnName: string
  minWidth?: number
  align?: 'right' | 'left'
  format?: (value: string) => string
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
  fileSize: string
  modifiedAt: string
  tags: string
}

function createData(
  name: string,
  status: string,
  fileSize: number,
  modifiedAt: string,
  tags: string
): Data {
  const fileMbSize = `${fileSize} MB`
  return { name, status, fileSize: fileMbSize, modifiedAt, tags }
}

const rows = [
  createData('India', 'アップロード完了', 27, '2020/11/27', 'test'),
  createData('China', '解析完了', 10, '2020/11/27', 'test'),
  createData('Italy', 'HTML変換中', 15, '2020/11/27', 'test'),
  createData('United States', 'アップロード失敗', 17, '2021/1/27', 'test'),
  createData('India1', 'アップロード完了', 27, '2020/11/27', 'test'),
  createData('China1', '解析完了', 10, '2020/11/27', 'test'),
  createData('Italy1', 'HTML変換中', 15, '2020/11/27', 'test'),
  createData('United States1', 'アップロード失敗', 17, '2021/1/27', 'test'),
  createData('India2', 'アップロード完了', 27, '2020/11/27', 'test'),
  createData('China2', '解析完了', 10, '2020/11/27', 'test'),
  createData('Italy2', 'HTML変換中', 15, '2020/11/27', 'test'),
  createData('United States2', 'アップロード失敗', 17, '2021/1/27', 'test'),
  createData('India3', 'アップロード完了', 27, '2020/11/27', 'test'),
  createData('China3', '解析完了', 10, '2020/11/27', 'test'),
  createData('Italy3', 'HTML変換中', 15, '2020/11/27', 'test'),
  createData('United States3', 'アップロード失敗', 17, '2021/1/27', 'test')
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
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [openSnackbar, setOpenSnackbar] = React.useState(false)
  const [fileList, setFileList] = React.useState<FileToUpload>({})

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

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
    setPage(0)
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
    console.log(fileList)
    setOpenSnackbar(true)
    await Promise.all(files.map(uploadFiles))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const uploadFiles = async (file: File) => {
    /*
    const name = file.name
    setFileList((prevState) => {
      const newState = update(prevState, {
        name: { $set: { file: file, progress: 10, uploaded: false } }
      })
      return prevState
    })
    console.log(fileList)
    */

    const storageRef = storage.ref()
    const uploadTask = storageRef.child(`documents/${file.name}`).put(file)
    try {
      uploadTask.on('state_changed', (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        const uploaded = progress >= 100 ? true : false
        console.log('Upload is ' + progress + '% done')
        console.log(fileList)
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
            console.log('Upload is paused')
            break
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running')
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
        <Grid item xs={12}>
          <RootPaper>
            <StyledTableContainer>
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
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.name}
                        >
                          {columns.map((column) => {
                            const value = row[column.id]
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === 'number'
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </StyledTableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </RootPaper>
        </Grid>
      </Grid>
      <ProgresSnackBar
        open={openSnackbar}
        fileList={fileList}
        handleCloseIcon={handleCloseSnackbarIcon}
        handleClose={handleCloseSnackbar}
      />
    </>
  )
}
export default Document

const RootPaper = styled(Paper)`
  width: 100%;
`

const StyledTableContainer = styled(TableContainer)`
  max-height: 440px;
`
const MenuGridContainer = styled(Grid)`
  margin-bottom: 1em;
`
