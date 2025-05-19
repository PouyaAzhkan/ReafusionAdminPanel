import Avatar from '../../../../../../@core/components/avatar/index'
import {Edit3, ExternalLink} from 'react-feather'
import {Link} from 'react-router-dom'
import {Button} from 'reactstrap'
import userImageFallback from '../../../../../../assets/images/element/UnKnownUser.jpg'
import CourseFallback from '../../../../../../assets/images/element/CourseImage.jpg'
import { convertGrigorianDateToJalaali, isValidUrl } from '../../../../../../@core/utils/formatter.utils'

export function useAssistanceWorkCol({handleModalOpen, singleUser, singleCourse}) {
    //

    const renderCourseAvatar = row => {
        return (
            <Avatar
                className="me-1 overflow-hidden"
                img={isValidUrl(row.tumbImageAddress) ? row.tumbImageAddress : CourseFallback}
                width="32"
                height="32"
            />
        )
    }
    const renderUserAvatar = row => {
        return (
            <Avatar
                className="me-1 overflow-hidden"
                img={
                    isValidUrl(row.addUserProfileImage)
                        ? row.addUserProfileImage
                        : userImageFallback
                }
                width="32"
                height="32"
            />
        )
    }

    return [
        {
            name: 'عنوان وظیفه',
            minWidth: '150px',
            sortField: 'worktitle',
            selector: row => row.worktitle,
            cell: row => <span className="text-truncate">{row.worktitle}</span>,
        },
        {
            name: 'شرح وظیفه',
            minWidth: '150px',
            sortField: 'workDescribe',
            selector: row => row.workDescribe,
            cell: row => <span className="text-truncate">{row.workDescribe}</span>,
        },
        {
            omit: singleUser,
            name: 'نام دستیار',
            minWidth: '200px',
            sortField: 'assistanceName',
            selector: row => row.assistanceName,
            cell: row => (
                <div className="d-flex justify-content-left align-items-center ">
                    {renderUserAvatar(row)}
                    <div className="d-flex flex-column overflow-hidden" style={{maxWidth: 170}}>
                        <Link
                            to={`/user/view/${row.userId}`}
                            className="user_name text-truncate text-body"
                        >
                            <span className="fw-bolder">{row.assistanceName}</span>
                        </Link>
                    </div>
                </div>
            ),
        },
        {
            omit: singleCourse,
            name: 'نام دوره',
            minWidth: '230px',
            sortField: 'courseName',
            selector: row => row.courseName,
            cell: row => (
                <div className="d-flex justify-content-left align-items-center ">
                    {renderCourseAvatar(row)}
                    <div className="d-flex flex-column overflow-hidden" style={{maxWidth: 170}}>
                        <Link
                            to={`/courses/${row.courseId}`}
                            className="user_name text-truncate text-body"
                        >
                            <span className="fw-bolder">{row.courseName}</span>
                        </Link>
                        <small className="text-truncate text-muted mb-0">{row.levelName}</small>
                    </div>
                </div>
            ),
        },
        {
            // name: <span className="text-success">تاریخ کار</span>,
            name: 'تاریخ کار',
            minWidth: '120px',
            // sortable: true,
            sortField: 'workDate',
            selector: row => row.workDate,
            cell: row => <span className="">{convertGrigorianDateToJalaali(row.workDate)}</span>,
        },
        // {
        //     name: 'صفحه مدرس',
        //     minWidth: '100px',
        //     sortField: 'groupLink',
        //     selector: row => row.groupLink,
        //     cell: row => (
        //         <Link
        //             to={`/user/view/${row.teacherId}`}
        //             className="d-flex align-items-center gap-1 fs-6 text-info"
        //         >
        //             <span>لینک</span>
        //             <ExternalLink size={18} />
        //         </Link>
        //     ),
        // },
        {
            name: 'عملیات',
            minWidth: '50px',
            cell: row => (
                <Button.Ripple
                    className="btn-icon"
                    color="primary"
                    onClick={() => handleModalOpen(row)}
                >
                    <Edit3 size={14} />
                </Button.Ripple>
            ),
        },
    ]
}
