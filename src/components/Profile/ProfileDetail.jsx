// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import axios from 'axios'

// ** Reactstrap Imports
import { Row, Col, TabContent, TabPane } from 'reactstrap'

// ** Demo Components
import Tabs from './Tabs'
import AccountTabContent from './AccountTabContent'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'
import CoursesTab from './CoursesTab'
import JobHistoryTab from './JobHistoryTab'
import ReservedCoursesTab from './ReservedCoursesTab'
import FavoritesTabs from './FavoritesTabs'
import MyCommentsTabs from './MyCommentsTabs'
import SecurityManageTab from './SecurityManageTab'

const ProfileDetail = () => {

  // ** States
  const [activeTab, setActiveTab] = useState('1')

  const toggleTab = tab => {
    setActiveTab(tab)
  }

  return (
    <Fragment>
      <Row>
        <Col xs={12}>
          <Tabs className='mb-2' activeTab={activeTab} toggleTab={toggleTab} />
          <TabContent activeTab={activeTab}>
            <TabPane tabId='1'>
              <AccountTabContent />
            </TabPane>
          </TabContent>
          <TabContent activeTab={activeTab}>
            <TabPane tabId='2'>
              <CoursesTab />
            </TabPane>
          </TabContent>
          <TabContent activeTab={activeTab}>
            <TabPane tabId='3'>
              <ReservedCoursesTab />
            </TabPane>
          </TabContent>
          <TabContent activeTab={activeTab}>
            <TabPane tabId='4'>
              <FavoritesTabs />
            </TabPane>
          </TabContent>
          <TabContent activeTab={activeTab}>
            <TabPane tabId='5'>
              <MyCommentsTabs />
            </TabPane>
          </TabContent>
          <TabContent activeTab={activeTab}>
            <TabPane tabId='6'>
              <JobHistoryTab />
            </TabPane>
          </TabContent>
          <TabContent activeTab={activeTab}>
            <TabPane tabId='7'>
              <SecurityManageTab />
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </Fragment>
  )
}

export default ProfileDetail
