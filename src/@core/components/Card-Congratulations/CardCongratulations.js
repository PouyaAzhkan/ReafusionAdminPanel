// ** Icons Imports
import { Award } from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Card, CardBody, CardText } from 'reactstrap'


import decorationLeft from '../../../assets/images/element/decore-left.png'
import decorationRight from '../../../assets/images/element/decore-right.png'
import { GetUserInfo } from '../../Services/Api/GetUserInfo'

const CardCongratulations = ({ Api }) => {

   const { data, isLoading, error } = GetUserInfo();
    if (isLoading) return <p> در حال بارگزاری </p>
    if (error) return <p> خطا در بارگزاری </p>

  return (
    <Card className='card-congratulations '>
      <CardBody className='text-center'>
        <img className='congratulations-img-left' src={decorationLeft} alt='decor-left' />
        <img className='congratulations-img-right' src={decorationRight} alt='decor-right' />
        <Avatar icon={<Award size={28} />} className='shadow' color='primary' size='xl' />
        <div className='text-center'>
          <h1 className='mb-1 text-white fw-bold'>تبریک {data.fName} جان </h1>
          <CardText className='m-auto w-75 fs-4'>
            مبلغ پرداختی تمامی دوره های تیم ریفیوژن به <strong>{Api.allPaymentCost}</strong> رسید
          </CardText>
        </div>
      </CardBody>
    </Card>
  )
}

export default CardCongratulations
