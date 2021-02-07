import React from 'react'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import Grid from '@material-ui/core/Grid'
import styled from 'styled-components'

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

function Document(): JSX.Element {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  return (
    <Grid container xs={12}>
      <Grid item xs={12} spacing={2}>
        ドキュメント一覧
      </Grid>
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
  )
}

const RootPaper = styled(Paper)`
  width: 100%;
`
const StyledTableContainer = styled(TableContainer)`
  max-height: 440px;
`

export default Document
