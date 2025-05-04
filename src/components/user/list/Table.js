// ** React Imports
import { Fragment, useState } from 'react'

// ** Components
import Sidebar from './Sidebar'
import { columns } from './columns'
import Select from 'react-select'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy } from 'react-feather'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'

// ** Sample Static Data
const staticData = [
  {
    id: 1,
    fullName: 'Ali Rezaei',
    role: 'admin',
    username: 'alirezaei',
    currentPlan: 'enterprise',
    email: 'ali@example.com',
    status: 'active'
  },
  {
    id: 2,
    fullName: 'Sara Ahmadi',
    role: 'editor',
    username: 'sara_ahmadi',
    currentPlan: 'team',
    email: 'sara@example.com',
    status: 'inactive'
  }
]

// ** Table Header
const CustomHeader = ({ data, toggleSidebar, handlePerPage, rowsPerPage, handleFilter, searchTerm }) => {
  const convertArrayOfObjectsToCSV = array => {
    const columnDelimiter = ','
    const lineDelimiter = '\n'
    const keys = Object.keys(array[0])
    let result = keys.join(columnDelimiter) + lineDelimiter

    array.forEach(item => {
      result += keys.map(key => item[key]).join(columnDelimiter) + lineDelimiter
    })
    return result
  }

  const downloadCSV = array => {
    const link = document.createElement('a')
    let csv = convertArrayOfObjectsToCSV(array)
    if (!csv) return

    const filename = 'export.csv'
    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`
    }

    link.setAttribute('href', encodeURI(csv))
    link.setAttribute('download', filename)
    link.click()
  }

  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75'>
      <Row>
        <Col xl='6' className='d-flex align-items-center p-0'>
          <div className='d-flex align-items-center w-100'>
            <label htmlFor='rows-per-page'>Show</label>
            <Input
              className='mx-50'
              type='select'
              id='rows-per-page'
              value={rowsPerPage}
              onChange={handlePerPage}
              style={{ width: '5rem' }}
            >
              <option value='10'>10</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
            </Input>
            <label htmlFor='rows-per-page'>Entries</label>
          </div>
        </Col>
        <Col
          xl='6'
          className='d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1'
        >
          <div className='d-flex align-items-center mb-sm-0 mb-1 me-1'>
            <label className='mb-0' htmlFor='search-invoice'>
              Search:
            </label>
            <Input
              id='search-invoice'
              className='ms-50 w-100'
              type='text'
              value={searchTerm}
              onChange={e => handleFilter(e.target.value)}
            />
          </div>

          <div className='d-flex align-items-center table-header-actions'>
            <UncontrolledDropdown className='me-1'>
              <DropdownToggle color='secondary' caret outline>
                <Share className='font-small-4 me-50' />
                <span className='align-middle'>Export</span>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem className='w-100'>
                  <Printer className='font-small-4 me-50' />
                  <span className='align-middle'>Print</span>
                </DropdownItem>
                <DropdownItem className='w-100' onClick={() => downloadCSV(data)}>
                  <FileText className='font-small-4 me-50' />
                  <span className='align-middle'>CSV</span>
                </DropdownItem>
                <DropdownItem className='w-100'>
                  <Grid className='font-small-4 me-50' />
                  <span className='align-middle'>Excel</span>
                </DropdownItem>
                <DropdownItem className='w-100'>
                  <File className='font-small-4 me-50' />
                  <span className='align-middle'>PDF</span>
                </DropdownItem>
                <DropdownItem className='w-100'>
                  <Copy className='font-small-4 me-50' />
                  <span className='align-middle'>Copy</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            <Button className='add-new-user' color='primary' onClick={toggleSidebar}>
              Add New User
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  )
}

const UsersList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState({ value: '', label: 'Select Role' })
  const [currentPlan, setCurrentPlan] = useState({ value: '', label: 'Select Plan' })
  const [currentStatus, setCurrentStatus] = useState({ value: '', label: 'Select Status', number: 0 })

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const filteredData = staticData.filter(item => {
    return (
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (currentRole.value ? item.role === currentRole.value : true) &&
      (currentPlan.value ? item.currentPlan === currentPlan.value : true) &&
      (currentStatus.value ? item.status === currentStatus.value : true)
    )
  })

  const dataToRender = () => {
    return filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
  }

  const handlePagination = page => setCurrentPage(page.selected + 1)

  const handlePerPage = e => {
    setRowsPerPage(parseInt(e.currentTarget.value))
    setCurrentPage(1)
  }

  const handleFilter = val => {
    setSearchTerm(val)
    setCurrentPage(1)
  }

  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={''}
      nextLabel={''}
      pageCount={Math.ceil(filteredData.length / rowsPerPage)}
      activeClassName='active'
      forcePage={currentPage - 1}
      onPageChange={handlePagination}
      pageClassName={'page-item'}
      nextLinkClassName={'page-link'}
      nextClassName={'page-item next'}
      previousClassName={'page-item prev'}
      previousLinkClassName={'page-link'}
      pageLinkClassName={'page-link'}
      containerClassName={'pagination react-paginate justify-content-end my-2 pe-1'}
    />
  )

  const roleOptions = [
    { value: '', label: 'Select Role' },
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' }
  ]

  const planOptions = [
    { value: '', label: 'Select Plan' },
    { value: 'team', label: 'Team' },
    { value: 'enterprise', label: 'Enterprise' }
  ]

  const statusOptions = [
    { value: '', label: 'Select Status', number: 0 },
    { value: 'active', label: 'Active', number: 1 },
    { value: 'inactive', label: 'Inactive', number: 2 }
  ]

  return (
    <Fragment>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Filters</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md='4'>
              <Label for='role-select'>Role</Label>
              <Select
                isClearable={false}
                value={currentRole}
                options={roleOptions}
                className='react-select'
                classNamePrefix='select'
                theme={selectThemeColors}
                onChange={data => setCurrentRole(data)}
              />
            </Col>
            <Col className='my-md-0 my-1' md='4'>
              <Label for='plan-select'>Plan</Label>
              <Select
                theme={selectThemeColors}
                isClearable={false}
                className='react-select'
                classNamePrefix='select'
                options={planOptions}
                value={currentPlan}
                onChange={data => setCurrentPlan(data)}
              />
            </Col>
            <Col md='4'>
              <Label for='status-select'>Status</Label>
              <Select
                theme={selectThemeColors}
                isClearable={false}
                className='react-select'
                classNamePrefix='select'
                options={statusOptions}
                value={currentStatus}
                onChange={data => setCurrentStatus(data)}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card className='overflow-hidden'>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            subHeader
            sortServer
            pagination
            responsive
            paginationServer
            columns={columns}
            onSort={() => {}}
            sortIcon={<ChevronDown />}
            className='react-dataTable'
            paginationComponent={CustomPagination}
            data={dataToRender()}
            subHeaderComponent={
              <CustomHeader
                data={filteredData}
                searchTerm={searchTerm}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                handlePerPage={handlePerPage}
                toggleSidebar={toggleSidebar}
              />
            }
          />
        </div>
      </Card>

      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Fragment>
  )
}

export default UsersList
