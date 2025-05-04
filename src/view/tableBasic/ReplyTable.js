import { useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import ReactPaginate from 'react-paginate'
import { Card } from 'reactstrap'

const ReplyTable = ({ replies = [] }) => {
  const [currentPage, setCurrentPage] = useState(0)

  const handlePagination = page => {
    setCurrentPage(page.selected)
  }

  const rowsPerPage = 5
  const paginatedData = replies.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)

  const columns = [
    {
      name: 'نام',
      selector: row => row.autor,
      sortable: true
    },
    {
      name: 'عنوان پاسخ',
      selector: row => row.title,
      sortable: true
    },
    {
      name: 'توضیحات پاسخ',
      selector: row => row.describe,
      sortable: true
    }
  ]

  const CustomPagination = () => (
    <ReactPaginate
      nextLabel=''
      breakLabel='...'
      previousLabel=''
      pageRangeDisplayed={2}
      forcePage={currentPage}
      marginPagesDisplayed={2}
      activeClassName='active'
      pageClassName='page-item'
      breakClassName='page-item'
      nextLinkClassName='page-link'
      pageLinkClassName='page-link'
      breakLinkClassName='page-link'
      previousLinkClassName='page-link'
      nextClassName='page-item next-item'
      previousClassName='page-item prev-item'
      pageCount={Math.ceil(replies.length / rowsPerPage) || 1}
      onPageChange={handlePagination}
      containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
    />
  )

  return (
    <Card className='overflow-hidden'>
      <div className='react-dataTable'>
        <DataTable
          noHeader
          pagination={replies.length > rowsPerPage}
          data={paginatedData}
          columns={columns}
          className='react-dataTable'
          sortIcon={<ChevronDown size={10} />}
          paginationComponent={replies.length > rowsPerPage ? CustomPagination : undefined}
          paginationDefaultPage={currentPage + 1}
          paginationRowsPerPageOptions={[rowsPerPage]}
        />
      </div>
    </Card>
  )
}

export default ReplyTable
