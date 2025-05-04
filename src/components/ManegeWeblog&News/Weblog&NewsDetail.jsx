import React from 'react'
import '../../assets/scss/PanelStayle/ManageWeblogs.scss'
import { Col } from 'reactstrap'
import InfoCard from './InfoCard'
import WeblogStatus from './WeblogStatus'
import { useParams } from 'react-router-dom'
import { GetDetailInfo } from '../../@core/Services/Api/Weblog&News/GetDetailInfo'

const WeblogAndNewsDetail = () => {
  const { id } = useParams();

  const {data: data, isLoading: DetailInfoLoading, erorr: DetailInfoErorr} = GetDetailInfo(id);
  if (DetailInfoLoading) return <p>درحال بارگزاری اطلاعات</p>
  if (DetailInfoErorr) return <p>خطا در بارگزاری اطلاعات</p>
  console.log(data);

  return (
    <div className='d-flex justify-content-between gap-1'> 
      <Col className='detailCard' xl="4" lg="5" xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
          <InfoCard  Api1={data?.detailsNewsDto}/>
      </Col>
      <Col className='weblogStatus'>
          <WeblogStatus Api1={data?.detailsNewsDto} CommentData={data?.commentDtos}/> 
      </Col>
    </div>
  )
}

export default WeblogAndNewsDetail