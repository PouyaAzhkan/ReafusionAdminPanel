import { Home, Users, Circle, Book, BookOpen } from "react-feather";

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
    icon: <Users size={20} />,
    // navLink: "/sample",
    children: [
      {
        id: "users",
        title: "لیست کاربران",
        icon: <Circle size={12} />,
        navLink: "/users",
      },
      {
        id: "usersJobHistory",
        title: "سوابق شغلی کاربران",
        icon: <Circle size={12} />,
        navLink: "/usersJobHistory",
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
      {
        id: "AddWeblog",
        title: "افزودن اخبار مقالات",
        icon: <Circle size={12} />,
        navLink: "AddWeblogAndNews",
      },
      {
        id: "ManageWeblogCategory",
        title: "مدیریت دسته بندی اخبار",
        icon: <Circle size={12} />,
        navLink: "/ManageWeblogCategory",
      },
      
    ],
  },
  {
    id: "Course",
    title: "مدیریت دوره ها",
    icon: <BookOpen size={20} />,
    children: [
      {
        id: "CourseList",
        title: "لیست دوره ها",
        icon: <Circle size={12} />,
        navLink: "/courses",
      },
    ],
  },
];
