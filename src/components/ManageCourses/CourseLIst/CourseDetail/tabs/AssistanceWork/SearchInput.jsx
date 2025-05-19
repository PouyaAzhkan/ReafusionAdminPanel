import {useRef} from 'react'
import {Input} from 'reactstrap'

export function SearchInput({onSearch}) {
    const timeout = useRef(null)

    function handleSearch(val) {
        if (timeout.current) {
            clearTimeout(timeout.current)
        }

        timeout.current = setTimeout(() => {
            onSearch(val)
            timeout.current = null
        }, 1000)
    }

    return (
        <div className="d-flex align-items-center mb-sm-0 mb-1 me-1" style={{maxWidth: 300}}>
            <label className="mb-0" htmlFor="search-invoice">
                جستوجو:
            </label>
            <Input
                id="search-invoice"
                className="ms-50 w-100"
                type="text"
                onChange={e => handleSearch(e.target.value)}
            />
        </div>
    )
}
