import { Archive, FileText, MoreVertical, Trash2 } from "react-feather";
import { Link } from "react-router-dom";
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

const renderRole = (row) => {
  return <span className="text-capitalize">{row.role}</span>;
};

export const columns = [
  {
    name: "User",
    sortable: true,
    minWidth: "300px",
    sortField: "fullName",
    selector: (row) => row.fullName,
    cell: (row) => (
      <div className="d-flex">
         <img
            src={"../../../assets/images/element/UnKnownUser.jpg"} // Placeholder image
            className="rounded-circle me-2"
            width="30"
            height="30"
          />
          <div className="d-flex flex-column">
            <div className="d-flex align-items-center">
              {/* You can replace the src with the user's profile picture */}
              <Link
                to={`/apps/user/view/${row.id}`}
                className="user_name text-truncate text-body"
              >
                <span className="fw-bolder">{row.fullName}</span>
              </Link>
            </div>
            <small className="text-truncate text-muted mb-0">{row.email}</small>
          </div>
      </div>
    ),
  },
  {
    name: "Role",
    sortable: true,
    minWidth: "172px",
    sortField: "role",
    selector: (row) => row.role,
    cell: (row) => renderRole(row),
  },
  {
    name: "Plan",
    minWidth: "138px",
    sortable: true,
    sortField: "currentPlan",
    selector: (row) => row.currentPlan,
    cell: (row) => <span className="text-capitalize">{row.currentPlan}</span>,
  },
  {
    name: "Billing",
    minWidth: "230px",
    sortable: true,
    sortField: "billing",
    selector: (row) => row.billing,
    cell: (row) => <span className="text-capitalize">22</span>,
  },
  {
    name: "Status",
    minWidth: "138px",
    sortable: true,
    sortField: "status",
    selector: (row) => row.status,
    cell: (row) => (
      <Badge className="text-capitalize" color={'info'} pill> 22 </Badge>
    ),
  },
  {
    name: "Actions",
    minWidth: "100px",
    cell: (row) => (
      <div className="column-action">
        <UncontrolledDropdown>
          <DropdownToggle tag="div" className="btn btn-sm">
            <MoreVertical size={14} className="cursor-pointer" />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              tag={Link}
              className="w-100"
              to={`/apps/user/view/${row.id}`}
            >
              <FileText size={14} className="me-50" />
              <span className="align-middle">Details</span>
            </DropdownItem>
            <DropdownItem
              tag="a"
              href="/"
              className="w-100"
              onClick={(e) => e.preventDefault()}
            >
              <Archive size={14} className="me-50" />
              <span className="align-middle">Edit</span>
            </DropdownItem>
            <DropdownItem
              tag="a"
              href="/"
              className="w-100"
              onClick={(e) => {
                e.preventDefault();
                // Delete handler can be passed via props or context
              }}
            >
              <Trash2 size={14} className="me-50" />
              <span className="align-middle">Delete</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    ),
  },
];
