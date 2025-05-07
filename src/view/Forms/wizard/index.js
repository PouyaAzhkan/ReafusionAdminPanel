// ** React Imports
import { Fragment } from 'react'
// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'
import WizardModernVertical from './WizardModernVertical'

const Wizard = () => {
  return (
    <Fragment>
      <Row>
          <Col sm='12'>
              <WizardModernVertical />
          </Col>
      </Row>
    </Fragment>
  )
}
export default Wizard
