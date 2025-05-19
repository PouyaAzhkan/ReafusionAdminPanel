import DataTable from 'react-data-table-component'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import {ChevronDown} from 'react-feather'
import {Card, Spinner} from 'reactstrap'
import {useState} from 'react'
import {useAssistanceColumn} from '../../../../../../components/ManageCourses/CourseLIst/CourseDetail/tabs//AssistanceWork/useAssistanceColumn'
import { CustomHeader } from '../../../../../../@core/components/reserve/CustomHeader'
import { CustomPagination } from '../../../../../../@core/components/pagination/CustomPagination'
import GetCourseAssistance from '../../../../../../@core/Services/Api/Courses/CourseDetail/tabsApi/CourseAssistance/GetCourseAssistance'

export function AssistanceTable({selectable, onSelect, singleUserId}) {
    //
    const [currentPage, setCurrentPage] = useState(1)
    const [showEdit, setShowEdit] = useState({currentAssistance: null, show: false, isEdit: false})
    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [searchTerm, setSearchTerm] = useState(null)
    const [sort, setSort] = useState({inserDate: false, direction: 'desc'})
    const columns = useAssistanceColumn({handleModalOpen, selectable})

    let {data: assistance, isLoading} = GetCourseAssistance();

    if (singleUserId) {
        assistance = assistance?.filter(work => work.userId === singleUserId)
    }

    let filteredAssistance = assistance ? [...assistance] : []
    if (searchTerm && searchTerm?.trim().length !== 0) {
        filteredAssistance = assistance.filter(
            item =>
                item.courseName?.includes(searchTerm) || item.assistanceName?.includes(searchTerm)
        )
    }

    // console.log(filteredAssistance)

    function dataToRender() {
        if (assistance) {
            const allData = [...filteredAssistance]

            if (sort.inserDate) {
                if (sort.direction === 'desc') {
                    allData.sort((a, b) => new Date(a.inserDate) - new Date(b.inserDate))
                } else {
                    allData.sort((a, b) => new Date(b.inserDate) - new Date(a.inserDate))
                }
            }

            return allData?.filter(
                (_, index) =>
                    index >= (currentPage - 1) * rowsPerPage && index < currentPage * rowsPerPage
            )
        }
    }

    function handleSelectedRowsChange({selectedRows}) {
        onSelect(selectedRows[0])
    }

    function handleModalOpen(assistance) {
        setShowEdit({
            currentAssistance: assistance,
            show: true,
            isEdit: assistance.courseId ? true : false,
        })
    }

    function handleSort(_, sortDirection) {
        setSort({inserDate: true, direction: sortDirection})
    }

    const handlePagination = page => {
        setCurrentPage(page.selected + 1)
    }
    function handlePerPage(e) {
        const value = parseInt(e.currentTarget.value)
        setRowsPerpage(value)
        setCurrentPage(1)
    }
    function handleSearch(val) {
        setSearchTerm(val)
        setCurrentPage(1)
    }
    function Pagination() {
        return (
            <>
                <CustomPagination
                    totalItem={filteredAssistance.length}
                    rowsPerPage={rowsPerPage}
                    currentPage={currentPage}
                    handlePagination={handlePagination}
                />
            </>
        )
    }
    return (
        <>
            <Card className="overflow-hidden">
                <div className="react-dataTable app-user-list">
                    <DataTable
                        noHeader
                        subHeader
                        sortServer
                        pagination
                        responsive
                        paginationServer
                        progressPending={isLoading}
                        noDataComponent={
                            <span className="my-4 fs-4 text-primary">دیتایی وجود ندارد</span>
                        }
                        progressComponent={<Spinner className="mb-5 mt-4" color="primary" />}
                        columns={columns}
                        onSort={handleSort}
                        sortIcon={<ChevronDown />}
                        className="react-dataTable"
                        paginationComponent={Pagination}
                        data={dataToRender()}
                        selectableRows={selectable}
                        selectableRowsSingle
                        onSelectedRowsChange={handleSelectedRowsChange}
                        subHeaderComponent={
                            <CustomHeader
                                RowsOfPage={rowsPerPage}
                                handlePerPage={handlePerPage}
                                onSearch={handleSearch}
                                title="دستیار"
                                handleToggleModal={handleModalOpen}
                                buttonText="ایجاد دستیار جدید"
                                selectable={selectable}
                            />
                        }
                    />
                </div>
            </Card>
        </>
    )
}
