// ** User List Component
import Table from './Table'

// ** Styles
import '@styles/react/apps/app-users.scss'
import Report from './Report'

const AllBuildingList = () => {

  return (
    <div className='app-user-list'>
      <Report />

      <Table />
    </div>
  )
}

export default AllBuildingList
