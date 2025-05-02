import { Fragment, useState } from 'react'
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Edit } from 'react-feather'
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  UncontrolledButtonDropdown
} from 'reactstrap'

// Sample static data
const data = [
  { id: 1, full_name: 'John Doe', avatar: 'https://i.pravatar.cc/40?img=1', post: 'Developer', email: 'john@example.com', age: '30', salary: '$70,000', start_date: '2023-01-15', status: 1 },
  { id: 2, full_name: 'Jane Smith', avatar: 'https://i.pravatar.cc/40?img=2', post: 'Designer', email: 'jane@example.com', age: '28', salary: '$65,000', start_date: '2022-11-20', status: 2 },
  { id: 3, full_name: 'Bob Johnson', avatar: 'https://i.pravatar.cc/40?img=3', post: 'Manager', email: 'bob@example.com', age: '35', salary: '$80,000', start_date: '2021-09-10', status: 3 },
  // می‌تونی دیتاهای بیشتر هم اضافه کنی برای تست صفحه‌بندی
]

const statusMap = {
  1: { title: 'Current', color: 'light-primary' },
  2: { title: 'Professional', color: 'light-success' },
  3: { title: 'Rejected', color: 'light-danger' },
  4: { title: 'Resigned', color: 'light-warning' },
  5: { title: 'Applied', color: 'light-info' }
}

const columns = [
  {
    name: 'Full Name',
    sortable: true,
    selector: row => row.full_name,
    cell: row => (
      <div className='d-flex align-items-center'>
        <img
          className='me-1 rounded-circle'
          src={row.avatar}
          alt='avatar'
          height='32'
          width='32'
        />
        <span className='fw-bold'>{row.full_name}</span>
      </div>
    )
  },
  { name: 'Post', selector: row => row.post, sortable: true },
  { name: 'Email', selector: row => row.email, sortable: true },
  { name: 'Age', selector: row => row.age, sortable: true },
  { name: 'Salary', selector: row => row.salary, sortable: true },
  { name: 'Start Date', selector: row => row.start_date, sortable: true },
  {
    name: 'Status',
    selector: row => row.status,
    cell: row => (
      <span className={`badge badge-${statusMap[row.status].color}`}>
        {statusMap[row.status].title}
      </span>
    )
  },
  {
    name: 'Actions',
    allowOverflow: true,
    cell: row => (
      <div className='d-flex align-items-center gap-1'>
        <Button color='link' className='p-0'>
          <Edit size={16} className='text-primary' />
        </Button>
        <UncontrolledDropdown>
          <DropdownToggle tag='button' className='btn btn-link p-0'>
            <MoreVertical size={16} className='text-secondary' />
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem>Edit</DropdownItem>
            <DropdownItem>Delete</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    )
  }  
]

const DataTableWithButtons = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const itemsPerPage = 7

  const filteredData = data.filter(
    item => 
      item.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.post.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const paginatedData = filteredData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  const handlePagination = page => {
    setCurrentPage(page.selected)
  }

  const handleSearch = event => {
    setSearchQuery(event.target.value)
  }

  const CustomPagination = () => (
    <ReactPaginate
      previousLabel=''
      nextLabel=''
      forcePage={currentPage}
      onPageChange={handlePagination}
      pageCount={Math.ceil(filteredData.length / itemsPerPage)}
      breakLabel='...'
      pageRangeDisplayed={2}
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
      containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
    />
  )

  return (
    <Fragment>
      <Card>
        <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
          <CardTitle tag='h4'>DataTable with Buttons</CardTitle>
          <div className='d-flex mt-md-0 mt-1'>
            <UncontrolledButtonDropdown>
              <DropdownToggle color='secondary' caret outline>
                <Share size={15} />
                <span className='align-middle ms-50'>Export</span>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem className='w-100' disabled>
                  <Printer size={15} />
                  <span className='align-middle ms-50'>Print</span>
                </DropdownItem>
                <DropdownItem className='w-100' disabled>
                  <FileText size={15} />
                  <span className='align-middle ms-50'>CSV</span>
                </DropdownItem>
                <DropdownItem className='w-100' disabled>
                  <Grid size={15} />
                  <span className='align-middle ms-50'>Excel</span>
                </DropdownItem>
                <DropdownItem className='w-100' disabled>
                  <File size={15} />
                  <span className='align-middle ms-50'>PDF</span>
                </DropdownItem>
                <DropdownItem className='w-100' disabled>
                  <Copy size={15} />
                  <span className='align-middle ms-50'>Copy</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
            <Button className='ms-2' color='primary'>
              <Plus size={15} />
              <span className='align-middle ms-50'>Add Record</span>
            </Button>
          </div>
        </CardHeader>
        <Row className='justify-content-end mx-0'>
          <Col className='d-flex align-items-center justify-content-end mt-1' md='6' sm='12'>
            <Label className='me-1' for='search-input'>
              Search
            </Label>
            <Input
              className='dataTable-filter mb-50'
              type='text'
              bsSize='sm'
              id='search-input'
              value={searchQuery}
              onChange={handleSearch}
            />
          </Col>
        </Row>
        <div className='react-dataTable react-dataTable-selectable-rows'>
          <DataTable
            noHeader
            pagination
            columns={columns}
            paginationPerPage={itemsPerPage}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            paginationDefaultPage={currentPage + 1}
            data={paginatedData}
          />
        </div>
      </Card>
    </Fragment>
  )
}

export default DataTableWithButtons
