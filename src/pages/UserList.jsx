import React, { Fragment } from 'react'
import Table from '../components/user/UserListTable';

const UserList = () => {
  return (
    <Fragment>
      <div>filtering box</div>

      <Table />
    </Fragment>
  )
}

export { UserList }