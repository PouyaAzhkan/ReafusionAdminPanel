import { Mail, Home, Airplay, Circle } from "react-feather";

export default [
  {
    id: "home",
    title: "داشبورد",
    icon: <Home size={20} />,
    navLink: "/home",
  },
  {
    id: "secondPage",
    title: "Second Page",
    icon: <Mail size={20} />,
    navLink: "/second-page",
  },
  {
    id: "smaplePage",
    title: "مدیریت کاربر",
    icon: <Airplay size={20} />,
    // navLink: "/sample",
    children: [
      {
        id: "invoiceList",
        title: "لیست کاربران",
        icon: <Circle size={12} />,
        navLink: "/UserList",
      },
    ],
  },
];
