import { Fragment, useState } from "react";
import { Activity } from "react-feather";
import { Button, Tooltip } from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const ChangeStatusButton = ({ handleActiveOrDetective, id, status, view = "table" }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const MySwal = withReactContent(Swal);

  const handleSuspendedClick = (boolean, id) => {
    return MySwal.fire({
      title: "آیا مطمئن هستید؟",
      text: "البته امکان بازگشت نیز وجود دارد",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله",
      cancelButtonText: "لغو",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-outline-danger ms-1",
      },
      buttonsStyling: false,
    }).then(function (result) {
      if (result.value) {
        handleActiveOrDetective(boolean, id);
        MySwal.fire({
          icon: "success",
          title: "موفقیت",
          text: "عملیات با موفقیت انجام گردید",
          confirmButtonText: "باشه",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
        MySwal.fire({
          title: "لغو",
          text: "عملیات لغو شد",
          icon: "error",
          confirmButtonText: "باشه",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
      }
    });
  };

  // استایل‌های شرطی برای گرید و جدول
  const buttonStyle = view === "flex"
    ? {
        width: "40px",
        height: "40px",
        borderRadius: "100%",
        position: "absolute",
        top: "5px",
        left: "5px",
        zIndex: 10, // اطمینان از قرار گرفتن روی تصویر
      }
    : {
        width: "40px",
        height: "40px",
        borderRadius: "100%",
        margin: "auto",
        display: "flex",
      };

  return (
    <Fragment>
      <Tooltip
        placement="top"
        isOpen={tooltipOpen}
        target={`ChangeStatus-${id}`}
        toggle={() => setTooltipOpen(!tooltipOpen)}
      >
        تغییر وضعیت
      </Tooltip>
      <Button
        id={`ChangeStatus-${id}`}
        className="d-flex align-items-center justify-content-center p-0 change-status-button"
        style={buttonStyle}
        color="primary"
        onClick={() => {
          status
            ? handleSuspendedClick(false, id)
            : handleSuspendedClick(true, id);
        }}
      >
        <Activity size={20} />
      </Button>
    </Fragment>
  );
};

export default ChangeStatusButton;