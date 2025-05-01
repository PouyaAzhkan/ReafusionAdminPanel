import React from 'react'
import { Award, Book, CheckCircle, Globe, Send, Sliders, TrendingDown, User, Users, UserX, XCircle } from 'react-feather'

import StatsWithLineChart from '../widgets/stats/StatsWithLineChart'
import { GetLandingReport } from '../../Services/Api/DashboardPanel/GetLandingReport'
import { GetCommentCount } from '../../Services/Api/DashboardPanel/GetCommentCount'
import { GetCourseGroup } from '../../Services/Api/DashboardPanel/GetCourseGroup'

const StatusCard = ({ Api }) => {
  
  const { data: LandingReport, isLoading: LandingReportLoading, error: LandingReportError } = GetLandingReport();
  const {data: commentCount, isLoading: commentCountLoading, error: commentCountError } = GetCommentCount();
  const {data: courseCroupe, isLoading: courseCroupeLoading, error: courseCroupeError } = GetCourseGroup();
  if (LandingReportLoading || commentCountLoading || courseCroupeLoading) return <p>درحال آمدن اطلاعات</p>
  if (LandingReportError || commentCountError || courseCroupeError) return <p>خطا در آمدن اطلاعات</p>

  return (
    <>
        <StatsWithLineChart
            icon={<Users size={20} />}
            color='info'
            stats={Api.allUser}
            statTitle='کاربران'
        />
        <StatsWithLineChart
            icon={<Book size={20} />}
            color='secondary'
            stats={Api.allReserve}
            statTitle='دوره ها'
        />
        <StatsWithLineChart
            icon={<CheckCircle size={20} />}
            color='success'
            stats={Api.allReserveAccept}
            statTitle='دوره رزرو شده'
        />
          <StatsWithLineChart
            icon={<XCircle size={22} />}
            color='warning'
            stats={Api.allReserveNotAccept}
            statTitle='دوره رزرو نشده'
        />
          <StatsWithLineChart
            icon={<UserX size={20} />}
            color='danger'
            stats={Api.deactiveUsers}
            statTitle='کاربران غیر فعال'
        />
          <StatsWithLineChart
            icon={<User size={20} />}
            color='success'
            stats={LandingReport.studentCount}
            statTitle='تعداد دانشجویان'
        />
          <StatsWithLineChart
            icon={<Award size={20} />}
            color='warning'
            stats={LandingReport.teacherCount}
            statTitle='تعداد استاد ها'
        />
          <StatsWithLineChart
            icon={<Globe size={20} />}
            color='primary'
            stats={LandingReport.newsCount}
            statTitle='خبرها'
        />
          <StatsWithLineChart
            icon={<Send size={20} />}
            color='secondary'
            stats={commentCount.totalCount}
            statTitle='تعداد کامنت ها'
        />
          <StatsWithLineChart
            icon={<Sliders size={20} />}
            color='info'
            stats={courseCroupe.totalCount}
            statTitle='گروه های دوره'
        />
    </>
  )
}

export default StatusCard