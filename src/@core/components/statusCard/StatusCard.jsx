import React from 'react'
import { Award, Book, CheckCircle, Globe, Send, Sliders, TrendingDown, User, Users, UserX, XCircle } from 'react-feather'

import StatsWithLineChart from '../widgets/stats/StatsWithLineChart'
import { GetLandingReport } from '../../Services/Api/DashboardPanel/GetLandingReport'
import { GetCommentCount } from '../../Services/Api/DashboardPanel/GetCommentCount'
import { GetCourseGroup } from '../../Services/Api/DashboardPanel/GetCourseGroup'
const StatusCard = ({ Api, count = 10, offset = 0 }) => {
  const { data: LandingReport, isLoading: LandingReportLoading, error: LandingReportError } = GetLandingReport();
  const { data: commentCount, isLoading: commentCountLoading, error: commentCountError } = GetCommentCount();
  const { data: courseCroupe, isLoading: courseCroupeLoading, error: courseCroupeError } = GetCourseGroup();

  if (LandingReportLoading || commentCountLoading || courseCroupeLoading) return <p>درحال آمدن اطلاعات</p>;
  if (LandingReportError || commentCountError || courseCroupeError) return <p>خطا در آمدن اطلاعات</p>;

  const cards = [
    {
      icon: <Users size={20} />,
      color: 'info',
      stats: Api.allUser,
      statTitle: 'کاربران'
    },
    {
      icon: <Book size={20} />,
      color: 'secondary',
      stats: Api.allReserve,
      statTitle: 'دوره ها'
    },
    {
      icon: <CheckCircle size={20} />,
      color: 'success',
      stats: Api.allReserveAccept,
      statTitle: 'دوره رزرو شده'
    },
    {
      icon: <XCircle size={22} />,
      color: 'warning',
      stats: Api.allReserveNotAccept,
      statTitle: 'دوره رزرو نشده'
    },
    {
      icon: <UserX size={20} />,
      color: 'danger',
      stats: Api.deactiveUsers,
      statTitle: 'کاربران غیر فعال'
    },
    {
      icon: <User size={20} />,
      color: 'success',
      stats: LandingReport.studentCount,
      statTitle: 'تعداد دانشجویان'
    },
    {
      icon: <Award size={20} />,
      color: 'warning',
      stats: LandingReport.teacherCount,
      statTitle: 'تعداد استاد ها'
    },
    {
      icon: <Globe size={20} />,
      color: 'primary',
      stats: LandingReport.newsCount,
      statTitle: 'خبرها'
    },
    {
      icon: <Send size={20} />,
      color: 'secondary',
      stats: commentCount.totalCount,
      statTitle: 'تعداد کامنت ها'
    },
    {
      icon: <Sliders size={20} />,
      color: 'info',
      stats: courseCroupe.totalCount,
      statTitle: 'گروه های دوره'
    }
  ];

  return (
    <>
      {cards.map((card, index) => (
        <StatsWithLineChart
          key={index}
          icon={card.icon}
          color={card.color}
          stats={card.stats}
          statTitle={card.statTitle}
          CardWidth="140px"
        />
      ))}
    </>
  );
};


export default StatusCard