import DataTable from 'react-data-table-component'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import {ChevronDown} from 'react-feather'
import {Card, Spinner} from 'reactstrap'
import {useState} from 'react'
import { CustomPagination } from '../../../../../../@core/components/pagination/CustomPagination'
import { CustomHeader } from '../../../../../../@core/components/reserve/CustomHeader'
import GetAssistanceWork from '../../../../../../@core/Services/Api/Courses/CourseDetail/tabsApi/CourseAssistance/GetAssistanceWork'
import { useAssistanceWorkCol } from './useAssistanceWorkCol'
import { CreateWorkModal } from './CreateWorkModal'

export function AssistanceWorkTable({user, isCurrentUserAssistance, singleCourse}) {
    //
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [searchTerm, setSearchTerm] = useState(null)
    //const [sort, setSort] = useState({inserDate: false, direction: 'desc'})
    const columns = useAssistanceWorkCol({handleModalOpen, singleUser: user?.id, singleCourse})
    const [showEdit, setShowEdit] = useState({
        currentAssistanceWork: null,
        show: false,
        isEdit: false,
    })

    let {data: assistanceWorks, isLoading} = GetAssistanceWork();

    if (user?.id) {
        assistanceWorks = assistanceWorks?.filter(work => work.userId === user.id)
    }
    if (singleCourse) {
        assistanceWorks = assistanceWorks?.filter(item => item.courseId === singleCourse)
    }

    assistanceWorks = assistanceWorks
        ? assistanceWorks.map(work => {
              const {id, ...rest} = work
              return {...rest, assistanceId: id}
          })
        : []

    let filteredAssistanceWorks = assistanceWorks ? [...assistanceWorks] : []
    if (searchTerm && searchTerm?.trim().length !== 0) {
        filteredAssistanceWorks = assistanceWorks.filter(
            item =>
                item.worktitle?.includes(searchTerm) ||
                item.workDescribe?.includes(searchTerm) ||
                item.courseName?.includes(searchTerm) ||
                item.assistanceName?.includes(searchTerm)
        )
    }

    function dataToRender() {
        if (assistanceWorks) {
            const allData = [...filteredAssistanceWorks]

            return allData?.filter(
                (_, index) =>
                    index >= (currentPage - 1) * rowsPerPage && index < currentPage * rowsPerPage
            )
        }
    }

    function handleModalOpen(assistanceWork) {
        setShowEdit({
            currentAssistanceWork: assistanceWork,
            show: true,
            isEdit: assistanceWork.assistanceId ? true : false,
        })
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
                    totalItem={filteredAssistanceWorks.length}
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
                            <span className="my-4 fs-4 text-primary">وظایفی برای این منتور وجود ندارد</span>
                        }
                        progressComponent={<Spinner className="mb-5 mt-4" color="primary" />}
                        columns={columns}
                        sortIcon={<ChevronDown />}
                        className="react-dataTable"
                        paginationComponent={Pagination}
                        data={dataToRender()}
                        subHeaderComponent={
                            <CustomHeader
                                RowsOfPage={rowsPerPage}
                                handlePerPage={handlePerPage}
                                onSearch={handleSearch}
                                title="وظیفه"
                                handleToggleModal={handleModalOpen}
                                buttonText="ایجاد وظیفه جدید"
                                isCurrentUserAssistance={isCurrentUserAssistance}
                                assistanceUserId={user?.id}
                            />
                        }
                    />
                </div>
            </Card>

            <CreateWorkModal
                key={showEdit.isEdit}
                showEdit={showEdit}
                setShowEdit={setShowEdit}
                singleUserId={user?.id}
            /> 
        </>
    )
}
