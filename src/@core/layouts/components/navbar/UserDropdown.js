// ** React Imports
import { Link } from "react-router-dom";
// ** Custom Components
import Avatar from "@components/avatar";

// ** Third Party Components
import {
  User,
  Mail,
  CheckSquare,
  MessageSquare,
  Settings,
  CreditCard,
  HelpCircle,
  Power,
} from "react-feather";

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";

// ** Default Avatar Image
import UnKnownUser from "../../../../assets/images/element/UnKnownUser.jpg";
import {
  GetDashboardUserInfo,
  useUserDetail,
} from "../../../Services/Api/UserManage/user";
import { roleTranslations } from "../../../../utility/RolesTranslation";

const UserDropdown = () => {
  const { data, isLoading, error } = GetDashboardUserInfo();
  const userId = data?.userImage?.[0]?.userProfileId;
  const {
    data: userDetail,
    userDetailisLoading,
    userDetailerror,
  } = useUserDetail(userId);

  if (isLoading || userDetailisLoading) return <p>در حال بارگذاری</p>;
  if (error || userDetailerror) return <p>خطا در بارگذاری</p>;

  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div className="user-nav d-sm-flex d-none">
          <span className="user-name fw-bold">
            {data?.fName || "بدون نام"} {data?.lName || ""}
          </span>
          <span className="user-status">
            {userDetail?.roles
              ? userDetail?.roles
                  ?.map(
                    (role) => roleTranslations[role.roleName] || role.roleName
                  )
                  .filter(Boolean)

                  .join("، ")
              : "بدون نقش"}
          </span>
        </div>
        <Avatar
          img={data.currentPictureAddress || UnKnownUser}
          imgHeight="40"
          imgWidth="40"
          status="online"
        />
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem tag={Link} to="/profile">
          <User size={14} className="me-75" />
          <span className="align-middle">حساب کاربری</span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/login">
          <Power size={14} className="me-75" />
          <span className="align-middle">خروج</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;
