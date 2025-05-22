// ** React Imports
import { Fragment, lazy } from "react";
import { Navigate } from "react-router-dom";
// ** Layouts
import BlankLayout from "@layouts/BlankLayout";
import VerticalLayout from "@src/layouts/VerticalLayout";
import HorizontalLayout from "@src/layouts/HorizontalLayout";
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper";

// ** Route Components
import PublicRoute from "@components/routes/PublicRoute";

// ** Utils
import { isObjEmpty } from "@utils";
import WeblogAndNewsDetail from "../../components/ManegeWeblog&News/Weblog&NewsDetail";
import AddWeblog from "../../components/ManegeWeblog&News/AddWeblog";
import ManageWeblogCategory from "../../components/ManegeWeblog&News/ManageWeblogCategory/ManageWeblogCategory";
import Courses from "../../components/ManageCourses/CourseLIst/list";
import CourseDetail from "../../components/ManageCourses/CourseLIst/CourseDetail/CourseDetail";
import AddCourse from "../../components/ManageCourses/AddCourse/AddCourse";
import AllCommentList from "../../components/CommentManage/list/AllCommentList";
import ManageCourseCategory from "../../components/ManageCourses/ManageCourseCategory/ManageCourseCategory";
import ManageCourseStatus from "../../components/ManageCourses/ManageCourseStatus/ManageCourseStatus";
import ManageCourseLevel from "../../components/ManageCourses/ManageCourseLevel/ManageCourseLevel";
import ManageCourseClass from "../../components/ManageCourses/ManageCourseClass/ManageCourseClass";
import CourseDepartment from "../../components/ManageCourses/ManageCourseDepartment/CourseDepartment";
import AssistanceWork from "../../components/ManageCourses/ManageAssistance-Work/AssistanceWork";
import MnanageCourseUser from "../../components/ManageCourses/MnanageCourseUser/MnanageCourseUser";
import AllBuildingList from "../../components/Buildings/AllBuildingList";

const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />,
};

// ** Document title
const TemplateTitle = "%s - Vuexy React Admin Template";

// ** Default Route
const DefaultRoute = "/home";

const Dashboard = lazy(() =>
  import("../../components/DashboardPanel/Dashboard")
);
const SecondPage = lazy(() => import("../../pages/SecondPage"));
const Login = lazy(() => import("../../pages/Login"));
const Register = lazy(() => import("../../pages/Register"));
const ForgotPassword = lazy(() => import("../../pages/ForgotPassword"));
const Error = lazy(() => import("../../pages/Error"));
const Sample = lazy(() => import("../../pages/Sample"));

// users
const Users = lazy(() => import("../../pages/Users"));
const UserDetail = lazy(() => import("../../pages/UserDetail"));
const UsersJobHistory = lazy(() => import("../../pages/UsersJobHistory"));

const ManegeWeblogNews = lazy(() =>
  import("../../components/ManegeWeblog&News/ManegeWeblog&News")
);
// comments
const Comments = lazy(() => import("../../pages/Comments"));
// buildings
const Buildings = lazy(() => import("../../pages/Buildings"));
// schedual
const AdminSchedual = lazy(() => import("../../pages/Scheduals/AdminSchedual"));
const TeacherSchedual = lazy(() =>
  import("../../pages/Scheduals/TeacherSchedual")
);
const StudentSchedual = lazy(() =>
  import("../../pages/Scheduals/StudentSchedual")
);
// terms
const Terms = lazy(() => import("../../pages/Terms"));
// terms
const Profile = lazy(() => import("../../pages/Profile"));

// ** Merge Routes
const Routes = [
  {
    path: "/",
    index: true,
    element: <Navigate replace to={DefaultRoute} />,
  },
  {
    path: "/home",
    element: <Dashboard />,
  },
  {
    path: "/sample",
    element: <Sample />,
  },
  {
    path: "/second-page",
    element: <SecondPage />,
  },
  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/register",
    element: <Register />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/error",
    element: <Error />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "*",
    element: <Error />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/users",
    element: <Users />,
  },
  {
    path: "/users/view/:id",
    element: <UserDetail />,
  },
  {
    path: "/UsersJobHistory",
    element: <UsersJobHistory />,
  },
  {
    path: "/WeblogAndNewsList",
    element: <ManegeWeblogNews />,
  },
  {
    path: "/WeblogAndNewsList/:id",
    element: <WeblogAndNewsDetail />,
  },
  {
    path: "/AddWeblogAndNews",
    element: <AddWeblog />,
  },
  {
    path: "/ManageWeblogCategory",
    element: <ManageWeblogCategory />,
  },
  {
    path: "/courses",
    element: <Courses />,
  },
  {
    path: "/courses/:id",
    element: <CourseDetail />,
  },
  {
    path: "/AddCourse",
    element: <AddCourse />,
  },
  {
    path: "/manageCourseCategory",
    element: <ManageCourseCategory />,
  },
  {
    path: "/manageCourseStatus",
    element: <ManageCourseStatus />,
  },
  {
    path: "/manageCourseLevel",
    element: <ManageCourseLevel />,
  },
  {
    path: "/manageCourseClassRoom",
    element: <ManageCourseClass />,
  },
  {
    path: "/manageCourseDepartment",
    element: <CourseDepartment />,
  },
  {
    path: "/manageAssistanceWork",
    element: <AssistanceWork />,
  },
  {
    path: "/manageCourseUser",
    element: <MnanageCourseUser />,
  },
  {
    path: "/buildings",
    element: <Buildings />,
  },
  {
    path: "/comments",
    element: <Comments />,
  },
  {
    path: "/adminSchedual",
    element: <AdminSchedual />,
  },
  {
    path: "/teacherSchedual",
    element: <TeacherSchedual />,
  },
  {
    path: "/studentSchedual",
    element: <StudentSchedual />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
];

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta };
    } else {
      return {};
    }
  }
};

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = [];

  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false;
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        const RouteTag = PublicRoute;

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false);
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
                LayoutWrapper
              : Fragment;

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          );
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route);
      }
      return LayoutRoutes;
    });
  }
  return LayoutRoutes;
};

const getRoutes = (layout) => {
  const defaultLayout = layout || "vertical";
  const layouts = ["vertical", "horizontal", "blank"];

  const AllRoutes = [];

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout);

    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes,
    });
  });
  return AllRoutes;
};

export { DefaultRoute, TemplateTitle, Routes, getRoutes };
