// ** React Imports
import { useState } from 'react'
import { Eye, ChevronDown } from 'react-feather'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import { Card } from 'reactstrap'

// ** Components
import CommentModal from './CommentModal'

// ✅ ستون‌های جدول
const DataTablesReOrder = ({ CommentData = [] }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [selectedComment, setSelectedComment] = useState(null)

  const handlePagination = page => {
    setCurrentPage(page.selected)
  }

  const rowsPerPage = 7
  const paginatedData = CommentData.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)

  const handleShowReplies = (comment) => {
    setSelectedComment(comment)
    setShowModal(true)
  }

  const columns = [
    {
      name: 'نام',
      selector: row => row.autor,
      sortable: true
    },
    {
      name: 'عنوان کامنت',
      selector: row => row.title,
      sortable: true
    },
    {
      name: 'توضیحات کامنت',
      selector: row => row.describe,
      sortable: true
    },
    {
      name: 'پاسخ‌ها',
      cell: row =>
        row.replyCount > 0 ? (
          <Eye
            size={18}
            className='text-primary cursor-pointer'
            onClick={() => handleShowReplies(row)}
          />
        ) : <p className='text-danger'>موجود نیست</p>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true
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
      pageCount={Math.ceil(CommentData.length / rowsPerPage) || 1}
      onPageChange={handlePagination}
      containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
    />
  )

  return (
    <>
      <Card className='overflow-hidden mt-1'>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            pagination
            data={paginatedData}
            columns={columns}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            paginationDefaultPage={currentPage + 1}
            paginationRowsPerPageOptions={[rowsPerPage]}
          />
        </div>
      </Card>

      {/* مودال نمایش پاسخ‌ها */}
      <CommentModal
        isOpen={showModal}
        toggle={() => setShowModal(false)}
        comment={selectedComment}
      />
    </>
  )
}

export default DataTablesReOrder

