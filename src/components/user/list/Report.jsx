import React from 'react';
import { GetUserList } from './../../../@core/Services/Api/UserManage/user';
import { Row, Col } from 'reactstrap';
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal';
import { Users, User, UserPlus, UserCheck, UserX, Book, UserMinus } from 'react-feather';

const Report = () => {
    // داده کل کاربران (مثلاً مجموع یا یک نقش خاص)
    const { data: totalData, isError: totalError, isLoading: totalLoading } = GetUserList({ roleId: null });

    // فراخوانی GetUserList برای هر roleId
    const { data: administratorData, isLoading: administratorLoading } = GetUserList({ roleId: 1 });
    const { data: teacherData, isLoading: teacherLoading } = GetUserList({ roleId: 2 });
    const { data: employeeAdminData, isLoading: employeeAdminLoading } = GetUserList({ roleId: 3 });
    const { data: employeeWriterData, isLoading: employeeWriterLoading } = GetUserList({ roleId: 4 });
    const { data: studentData, isLoading: studentLoading } = GetUserList({ roleId: 5 });
    const { data: courseAssistanceData, isLoading: courseAssistanceLoading } = GetUserList({ roleId: 6 });
    const { data: tournamentAdminData, isLoading: tournamentAdminLoading } = GetUserList({ roleId: 7 });
    const { data: refereeData, isLoading: refereeLoading } = GetUserList({ roleId: 8 });
    const { data: tournamentMentorData, isLoading: tournamentMentorLoading } = GetUserList({ roleId: 9 });
    const { data: supportData, isLoading: supportLoading } = GetUserList({ roleId: 10 });

    return (
        <Row>
            {/* all user */}
            <Col lg="3" sm="6">
                <StatsHorizontal
                    color="primary"
                    statTitle="کل کاربران"
                    icon={<Users size={20} />}
                    renderStats={<h3 className="fw-bolder mb-75">
                        {totalLoading ? '...' : totalData?.totalCount || 0}
                    </h3>}
                />
            </Col>
            {/* administrator */}
            <Col lg="3" sm="6">
                <StatsHorizontal
                    color="success"
                    statTitle="ادمین‌ها"
                    icon={<UserCheck size={20} />}
                    renderStats={<h3 className="fw-bolder mb-75">
                        {administratorLoading ? '...' : administratorData?.totalCount || 0}
                    </h3>}
                />
            </Col>
            {/* teacher */}
            <Col lg="3" sm="6">
                <StatsHorizontal
                    color="danger"
                    statTitle="اساتید"
                    icon={<Book size={20} />}
                    renderStats={<h3 className="fw-bolder mb-75">
                        {teacherLoading ? '...' : teacherData?.totalCount || 0}
                    </h3>}
                />
            </Col>
            {/* employee admin */}
            <Col lg="3" sm="6">
                <StatsHorizontal
                    color="secondary"
                    statTitle="کارمند-ادمین"
                    icon={<UserMinus size={20} />}
                    renderStats={<h3 className="fw-bolder mb-75">
                        {employeeAdminLoading ? '...' : employeeAdminData?.totalCount || 0}
                    </h3>}
                />
            </Col>
            {/* employee writer */}
            <Col lg="3" sm="6">
                <StatsHorizontal
                    color="secondary"
                    statTitle="کارمند-نویسنده"
                    icon={<UserMinus size={20} />}
                    renderStats={<h3 className="fw-bolder mb-75">
                        {employeeWriterLoading ? '...' : employeeWriterData?.totalCount || 0}
                    </h3>}
                />
            </Col>
            {/* student */}
            <Col lg="3" sm="6">
                <StatsHorizontal
                    color="info"
                    statTitle="دانشجویان"
                    icon={<UserPlus size={20} />}
                    renderStats={<h3 className="fw-bolder mb-75">
                        {studentLoading ? '...' : studentData?.totalCount || 0}
                    </h3>}
                />
            </Col>
            {/* Course Assistance */}
            <Col lg="3" sm="6">
                <StatsHorizontal
                    color="warning"
                    statTitle="کمک دوره"
                    icon={<User size={20} />}
                    renderStats={<h3 className="fw-bolder mb-75">
                        {courseAssistanceLoading ? '...' : courseAssistanceData?.totalCount || 0}
                    </h3>}
                />
            </Col>
            {/* tournament Admin */}
            <Col lg="3" sm="6">
                <StatsHorizontal
                    color="warning"
                    statTitle="مدیر مسابقات"
                    icon={<User size={20} />}
                    renderStats={<h3 className="fw-bolder mb-75">
                        {tournamentAdminLoading ? '...' : tournamentAdminData?.totalCount || 0}
                    </h3>}
                />
            </Col>
            {/* refree */}
            <Col lg="3" sm="6">
                <StatsHorizontal
                    color="danger"
                    statTitle="داور ها"
                    icon={<UserX size={20} />}
                    renderStats={<h3 className="fw-bolder mb-75">
                        {refereeLoading ? '...' : refereeData?.totalCount || 0}
                    </h3>}
                />
            </Col>
            {/* tournament Mentor */}
            <Col lg="3" sm="6">
                <StatsHorizontal
                    color="success"
                    statTitle="منتور مسابقات"
                    icon={<UserCheck size={20} />}
                    renderStats={<h3 className="fw-bolder mb-75">
                        {tournamentMentorLoading ? '...' : tournamentMentorData?.totalCount || 0}
                    </h3>}
                />
            </Col>
            {/* support */}
            <Col lg="3" sm="6">
                <StatsHorizontal
                    color="success"
                    statTitle="پشتیبان ها"
                    icon={<UserCheck size={20} />}
                    renderStats={<h3 className="fw-bolder mb-75">
                        {supportLoading ? '...' : supportData?.totalCount || 0}
                    </h3>}
                />
            </Col>
        </Row>
    );
};

export default Report;