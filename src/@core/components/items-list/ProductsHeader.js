// ProductsHeader.js
import React, { useState } from "react";
import Select from "react-select";
import { Row, Col } from "reactstrap";

const ProductsHeader = ({ rowsFunc, sortOptions }) => {
  const ShowCurrentOption = [
    { label: "15", value: 15 },
    { label: "24", value: 24 },
    { label: "48", value: 48 },
  ];

  const [selectedShowOption, setSelectedShowOption] = useState(ShowCurrentOption[0]);
  const [selectedSortOptions, setSelectedSortOptions] = useState(
    sortOptions?.map((item) => item.Options[0]) || []
  );

  const handleShowChange = (option) => {
    setSelectedShowOption(option);
    rowsFunc(option.value);
  };

  const handleSortChange = (option, index) => {
    const newSorts = [...selectedSortOptions];
    newSorts[index] = option;
    setSelectedSortOptions(newSorts);
    sortOptions[index].setState(option.value);
  };

  return (
    <div className="d-flex justify-content-between flex-wrap gap-1">
        <div className="d-flex gap-1 align-items-center">
          نمایش
          <Select
            className="select1"
            classNamePrefix="select"
            defaultValue={selectedShowOption}
            onChange={(option) => handleShowChange(option)}
            options={ShowCurrentOption}
          />
        </div>
        <div className="d-flex gap-1">
            <div className="d-flex gap-1 align-items-center">
              مرتب سازی:
              {sortOptions?.map((item, index) => (
                <Select
                  key={index}
                  className="select2"
                  classNamePrefix="select"
                  value={selectedSortOptions[index]}
                  onChange={(option) => handleSortChange(option, index)}
                  options={item.Options}
                />
              ))}
            </div>
        </div>
    </div>
  );
};

export default ProductsHeader;
