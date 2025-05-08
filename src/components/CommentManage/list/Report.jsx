import React from 'react';
import { Row, Col } from 'reactstrap';
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal';
import { X, Check, MessageSquare } from 'react-feather';
import { GetCommentList } from '../../../@core/Services/Api/CommentManage/CommentManage';

const Report = () => {
    const { data: totalData, isError: totalError, isLoading: totalLoading } = GetCommentList();

    const { data: acceptedCommentData, isLoading: acceptedCommentLoading } = GetCommentList({ accept: true });
    const { data: notAcceptedCommentData, isLoading: notAcceptedCommentLoading } = GetCommentList({ accept: false });

    return (
        <Row>
            {/* all user */}
            <Col lg="4" sm="6">
                <StatsHorizontal
                    color="primary"
                    statTitle="همه ی کامنت ها"
                    icon={<MessageSquare size={20} />}
                    renderStats={<h3 className="fw-bolder mb-75">
                        {totalLoading ? '...' : totalData?.totalCount || 0}
                    </h3>}
                />
            </Col>
            {/* administrator */}
            <Col lg="4" sm="6">
                <StatsHorizontal
                    color="success"
                    statTitle="کامنت های تایید شده"
                    icon={<Check size={20} />}
                    renderStats={<h3 className="fw-bolder mb-75">
                        {acceptedCommentLoading ? '...' : acceptedCommentData?.totalCount || 0}
                    </h3>}
                />
            </Col>
            {/* teacher */}
            <Col lg="4" sm="6">
                <StatsHorizontal
                    color="danger"
                    statTitle="کامنت های تایید نشده"
                    icon={<X size={20} />}
                    renderStats={<h3 className="fw-bolder mb-75">
                        {notAcceptedCommentLoading ? '...' : notAcceptedCommentData?.totalCount || 0}
                    </h3>}
                />
            </Col>
        </Row>
    );
};

export default Report;