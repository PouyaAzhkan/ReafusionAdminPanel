// ** React Imports
import { useRef, useState } from 'react'

// ** Custom Components
import Wizard from '@components/wizard'
import PersonalInfo from './steps/PersonalInfo'
import AddImage from './steps/AddImage'
import Address from './steps/Address'
import SocialLinks from './steps/SocialLinks'
import { AddWeblog } from '../../../@core/Services/Api/Weblog&News/AddWeblog'

const WizardHorizontal = () => {
  const ref = useRef(null)
  const [stepper, setStepper] = useState(null)
  const [formData, setFormData] = useState({})
  const { mutate: AddWeblogs } = AddWeblog()

  const handleFinalSubmit = () => {
    const formPayload = new FormData()

    Object.keys(formData).forEach(key => {
      if (key === 'image' && formData[key]) {
        formPayload.append('image', formData[key])
      } else if (key === 'category' && Array.isArray(formData[key])) {
        formData[key].forEach(cat => {
          console.log('ارسال آی‌دی:', cat.value)
          formPayload.append('NewsCatregoryId', cat.value) // فقط valueها (id)
        })
      } else {
        formPayload.append(key, formData[key] || '')
      }
    })

    AddWeblogs(formPayload, {
      onSuccess: (data) => {
        console.log('پاسخ سرور:', data)
        alert('خبر با موفقیت ساخته شد!')
      },
      onError: (error) => {
        console.log('خطا:', error)
        alert('خطا در ارسال خبر: ' + error.message)
      }
    })
  }

  const steps = [
    {
      id: 'add-image',
      title: 'عکس خبر',
      subtitle: 'افزودن عکس',
      content: <AddImage stepper={stepper} formData={formData} setFormData={setFormData} />
    },
    {
      id: 'personal-info',
      title: 'اطلاعات',
      subtitle: 'اطلاعات خبر',
      content: <PersonalInfo stepper={stepper} formData={formData} setFormData={setFormData} />
    },
    {
      id: 'step-address',
      title: 'توضیح',
      subtitle: 'توضیح خبر',
      content: <Address stepper={stepper} formData={formData} setFormData={setFormData} />
    },
    {
      id: 'social-links',
      title: 'پیش نمایش / ثبت',
      subtitle: 'پیش نمایش / ثبت خبر',
      content: (
        <SocialLinks
          stepper={stepper}
          formData={formData}
          onSubmitFinal={handleFinalSubmit}
        />
      )
    }
  ]

  return (
    <div className='horizontal-wizard'>
      <Wizard instance={el => setStepper(el)} ref={ref} steps={steps} />
    </div>
  )
}

export default WizardHorizontal
