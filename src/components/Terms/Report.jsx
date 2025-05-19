import React from 'react';
import { Row, Col } from 'reactstrap';
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal';
import { X, Check, Database } from 'react-feather';
import { getAllTerms } from '../../@core/Services/Api/Terms/Terms';

const Report = () => {
    const { data, isLoading, isError, error } = getAllTerms();

    // بررسی حالت‌های مختلف
    if (isLoading) {
        return <div>در حال بارگذاری...</div>;
    }
    else if (isError) {
        return <div>خطا در دریافت داده‌ها: {error?.message || "خطای ناشناخته"}</div>;
    }
    else if (!data || !Array.isArray(data)) {
        return <div>داده‌ای برای نمایش وجود ندارد</div>;
    }

    // filter data
    const notExpireBuildings = data.filter((building) => building.expire === false);
    const expireBuildings = data.filter((building) => building.expire === true);

    return (
        <Row>
            {/* all user */}
            <Col lg="4" sm="6">
                <StatsHorizontal
                    color="primary"
                    statTitle="کل ترم ها"
                    icon={<Database size={20} />}
                    renderStats={<h3 className="fw-bolder mb-75">
                        {isLoading ? '...' : data?.length || 0}
                    </h3>}
                />
            </Col>
            {/* administrator */}
            <Col lg="4" sm="6">
                <StatsHorizontal
                    color="success"
                    statTitle="ترم های منقضی نشده"
                    icon={<Check size={20} />}
                    renderStats={<h3 className="fw-bolder mb-75">
                        {isLoading ? '...' : notExpireBuildings?.length || 0}
                    </h3>}
                />
            </Col>
            {/* teacher */}
            <Col lg="4" sm="6">
                <StatsHorizontal
                    color="danger"
                    statTitle="ترم های منقضی شده"
                    icon={<X size={20} />}
                    renderStats={<h3 className="fw-bolder mb-75">
                        {isLoading ? '...' : expireBuildings?.length || 0}
                    </h3>}
                />
            </Col>
        </Row>
    );
};

export default Report;