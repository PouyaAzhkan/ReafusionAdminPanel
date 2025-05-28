// ** Reactstrap Imports
import { Nav, NavItem, NavLink } from "reactstrap";

// ** Icons Imports
import { Book, User, CreditCard, Calendar } from "react-feather";

const Tabs = ({ activeTab, toggleTab }) => {
  const tabsData = [
    { tabId: "1", title: "همه دوره ها", icon: Book },
    { tabId: "2", title: "دوره های رزرو شده و نشده", icon: Calendar },
    { tabId: "3", title: "پرداختی دوره ها", icon: CreditCard },
    { tabId: "4", title: "دوره های من", icon: User },
  ];

  return (
    <Nav pills className="mb-2">
      {tabsData.map((tab) => {
        const Icon = tab.icon; // آیکون دینامیک
        return (
          <NavItem key={tab.tabId}>
            <NavLink
              active={activeTab === tab.tabId}
              onClick={() => toggleTab(tab.tabId)}
            >
              <Icon size={18} className="me-50" />
              <span className="fw-bold">{tab.title}</span>
            </NavLink>
          </NavItem>
        );
      })}
    </Nav>
  );
};

export default Tabs;