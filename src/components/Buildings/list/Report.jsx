import React from 'react';
import { GetUserList } from './../../../@core/Services/Api/UserManage/user';
import { Row, Col } from 'reactstrap';
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal';
import { X, Check, Trello } from 'react-feather';
import { getAllBuildings } from './../../../@core/Services/Api/Buildings/Buildings';

const Report = () => {
    const { data, isLoading, isError, error } = getAllBuildings();

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
    const activeBuildings = data.filter((building) => building.active === true);
    const inactiveBuildings = data.filter((building) => building.active === false);


    return (
        <Row>
            {/* all user */}
            <Col lg="4" sm="6">
                <StatsHorizontal
                    color="primary"
                    statTitle="کل ساختمان ها"
                    icon={<Trello size={20} />}
                    renderStats={<h3 className="fw-bolder mb-75">
                        {isLoading ? '...' : data?.length || 0}
                    </h3>}
                />
            </Col>
            {/* administrator */}
            <Col lg="4" sm="6">
                <StatsHorizontal
                    color="success"
                    statTitle="ساختمان های فعال"
                    icon={<Check size={20} />}
                    renderStats={<h3 className="fw-bolder mb-75">
                        {isLoading ? '...' : activeBuildings?.length || 0}
                    </h3>}
                />
            </Col>
            {/* teacher */}
            <Col lg="4" sm="6">
                <StatsHorizontal
                    color="danger"
                    statTitle="ساختمان های غیر فعال"
                    icon={<X size={20} />}
                    renderStats={<h3 className="fw-bolder mb-75">
                        {isLoading ? '...' : inactiveBuildings?.length || 0}
                    </h3>}
                />
            </Col>
        </Row>
    );
};

export default Report;