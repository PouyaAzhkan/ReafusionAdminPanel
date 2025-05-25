// ** Reactstrap Imports
import { Nav, NavItem, NavLink } from "reactstrap";

// ** Icons Imports
import {
  User,
  Book,
  Briefcase,
  Bookmark,
  Heart,
  MessageSquare,
  Lock,
} from "react-feather";

const Tabs = ({ activeTab, toggleTab }) => {
  return (
    <Nav pills className="mb-2">
      <NavItem>
        <NavLink active={activeTab === "1"} onClick={() => toggleTab("1")}>
          <User size={18} className="me-50" />
          <span className="fw-bold">حساب کاربری</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "2"} onClick={() => toggleTab("2")}>
          <Book size={18} className="me-50" />
          <span className="fw-bold">دوره های من</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "3"} onClick={() => toggleTab("3")}>
          <Bookmark size={18} className="me-50" />
          <span className="fw-bold">دوره های رزرو شده</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "4"} onClick={() => toggleTab("4")}>
          <Heart size={18} className="me-50" />
          <span className="fw-bold">علاقه مندی ها</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "5"} onClick={() => toggleTab("5")}>
          <MessageSquare size={18} className="me-50" />
          <span className="fw-bold">کامنت های من</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "6"} onClick={() => toggleTab("6")}>
          <Briefcase size={18} className="me-50" />
          <span className="fw-bold">سوابق شغلی</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink active={activeTab === "7"} onClick={() => toggleTab("7")}>
          <Lock size={18} className="me-50" />
          <span className="fw-bold">اطلاعات امنیتی</span>
        </NavLink>
      </NavItem>
    </Nav>
  );
};

export default Tabs;
