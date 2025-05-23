import { useState } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import FavoritesCoursesTab from './FavoritesCoursesTab'
import FavoritesNewsTab from './FavoritesNewsTab'

const FavoritesTabs = () => {
  const [active, setActive] = useState('1')

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  return (
    <div className='nav-vertical'>
      <Nav tabs className='nav-left'>
        <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              toggle('1')
            }}
          >
            دوره ها
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2')
            }}
          >
            اخبار
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId='1'>
          <FavoritesCoursesTab />
        </TabPane>
        <TabPane tabId='2'>
          <FavoritesNewsTab />
        </TabPane>
      </TabContent>
    </div>
  )
}
export default FavoritesTabs