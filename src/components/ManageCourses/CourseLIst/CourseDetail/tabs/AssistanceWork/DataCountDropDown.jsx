import {Input} from 'reactstrap'

export function DataCountDropDown({RowsOfPage, handlePerPage, title, counts}) {
    return (
        <>
            <div className="d-flex align-items-center justify-content-end ">
                <label htmlFor="rows-per-page">تعداد</label>
                <Input
                    className="mx-50"
                    type="select"
                    id="rows-per-page"
                    value={RowsOfPage}
                    onChange={handlePerPage}
                    style={{width: '5rem'}}
                >
                    {counts.map(item => (
                        <option key={item} value={`${item}`}>
                            {item}
                        </option>
                    ))}
                </Input>
                <label htmlFor="rows-per-page">{title} در صفحه</label>
            </div>
        </>
    )
}
