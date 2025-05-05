import { Mail, Home, Airplay, Circle, Book } from "react-feather";

export default [
  {
    id: "home",
    title: "داشبورد",
    icon: <Home size={20} />,
    navLink: "/home",
  },
  {
    id: "userManage",
    title: "مدیریت کاربر",
    icon: <Airplay size={20} />,
    // navLink: "/sample",
    children: [
      {
        id: "users",
        title: "لیست کاربران",
        icon: <Circle size={12} />,
        navLink: "/users",
      },
    ],
  },
  {
    id: "weblog",
    title: "مدیریت اخبار مقالات",
    icon: <Book size={20} />,
    children: [
      {
        id: "weblogList",
        title: "لیست اخبار مقالات",
        icon: <Circle size={12} />,
        navLink: "/WeblogAndNewsList",
      },
    ],
  },
];
