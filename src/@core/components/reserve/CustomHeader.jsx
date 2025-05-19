import {DataCountDropDown} from '../../../components/ManageCourses/CourseLIst/CourseDetail/tabs/AssistanceWork/DataCountDropDown'
import {Button, Col, Row} from 'reactstrap'
import { SearchInput } from '../../../components/ManageCourses/CourseLIst/CourseDetail/tabs/AssistanceWork/SearchInput'

export function CustomHeader({
    handlePerPage,
    RowsOfPage,
    singleCourseId,
    onSearch,
    title,
    handleToggleModal,
    buttonText,
    selectable,
    assistanceUserId,
    isCurrentUserAssistance,
}) {
    const isAssistance = assistanceUserId
        ? isCurrentUserAssistance?.length > 0
            ? true
            : false
        : true

    // console.log(isAssistance)

    return (
        <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
            <Row className="gap-3 gap-xl-0">
                {singleCourseId && <span className="fs-4">رزرو های دوره</span>}
                {!singleCourseId && (
                    <Col xl="5">
                        <SearchInput onSearch={onSearch} />
                    </Col>
                )}

                <Col
                    xl="7"
                    className="d-flex gap-4 align-items-center justify-content-start justify-content-xl-end"
                >
                    {!singleCourseId && !assistanceUserId && (
                        <DataCountDropDown
                            RowsOfPage={RowsOfPage}
                            handlePerPage={handlePerPage}
                            title={title}
                            counts={[10, 25, 50]}
                        />
                    )}

                    {buttonText && !selectable && isAssistance && (
                        <Button
                            className="add-new-user ms-1"
                            color="primary"
                            onClick={handleToggleModal}
                        >
                            {buttonText}
                        </Button>
                    )}
                </Col>
            </Row>
        </div>
    )
}
