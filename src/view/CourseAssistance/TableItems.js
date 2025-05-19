import { Edit, ChevronUp, ChevronDown } from "react-feather";
import ChangeMoment from "../../utility/moment";

const TableItems = ({ toggle, setAccId, item, onClick, openRow, index, toggleRow }) => {
  return (
    <tr className="text-center" onClick={onClick}>
      <td className="px-0" style={{ width: "80px" }}>
        {item.userId}
      </td>
      <td className="px-0" style={{ width: "180px" }}>
        {item.assistanceName ? item.assistanceName : "ناشناس"}
      </td>
      <td className="px-0" style={{ width: "100px" }}>
        {ChangeMoment(item.inserDate, "YYYY/MM/DD", "persian")}
      </td>
      <td
        className="px-0 text-primary"
        style={{ width: "100px" }}
      >
        <span
          onClick={(event) => {
            event.stopPropagation();
            setAccId(item.id);
            toggle();
          }}
          className="mx-1"
        >
          <Edit size={17} className="mx-75" />
          ویرایش
        </span>
        <span onClick={() => toggleRow(index)} className="transition-all">
          {openRow === index ? (
            <ChevronDown size={17} className="mx-75" />
          ) : (
            <ChevronUp size={17} className="mx-75" />
          )}
        </span>
      </td>
    </tr>
  );
};

export default TableItems;