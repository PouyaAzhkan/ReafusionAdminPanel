import { useState, useEffect, useRef } from 'react'
import { X, Trello, Calendar, AlignJustify } from 'react-feather'
import {
  Modal,
  Input,
  Label,
  Button,
  ModalHeader,
  ModalBody,
  InputGroup,
  InputGroupText
} from 'reactstrap'
import { useCreateBuilding } from '../../../@core/Services/Api/Buildings/Buildings'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { useQueryClient } from '@tanstack/react-query' // وارد کردن useQueryClient
import toast from 'react-hot-toast'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// تنظیم آیکون Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

// کامپوننت نقشه
const MapComponent = ({ position, setPosition, setForm }) => {
  const mapRef = useRef(null)

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng
        setPosition([lat, lng])
        setForm((prev) => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString()
        }))
      }
    })
    return null
  }

  return (
    <MapContainer
      ref={mapRef}
      center={position}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      key={`${position[0]}-${position[1]}`}
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapClickHandler />
      <Marker
        position={position}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const { lat, lng } = e.target.getLatLng()
            setPosition([lat, lng])
            setForm((prev) => ({
              ...prev,
              latitude: lat.toString(),
              longitude: lng.toString()
            }))
          }
        }}
      />
    </MapContainer>
  )
}

const AddBuildingModal = ({ open, handleModal }) => {
  const [form, setForm] = useState({
    buildingName: '',
    workDate: '',
    floor: '',
    latitude: '',
    longitude: ''
  })
  const [position, setPosition] = useState(null)
  const [isClient, setIsClient] = useState(false)
  const containerRef = useRef(null)

  const { mutate, isLoading } = useCreateBuilding()
  const queryClient = useQueryClient() // دسترسی به کلاینت کوئری

  useEffect(() => {
    setIsClient(true)
  }, [])

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setForm((prev) => ({
            ...prev,
            latitude: latitude.toString(),
            longitude: longitude.toString()
          }))
          setPosition([latitude, longitude])
        },
        (error) => {
          toast.error(
            error.code === error.PERMISSION_DENIED
              ? 'لطفاً اجازه دسترسی به لوکیشن را بدهید.'
              : 'خطا در دریافت لوکیشن: ' + error.message
          )
          setPosition([35.6892, 51.3890])
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    } else {
      toast.error('مرورگر شما از Geolocation پشتیبانی نمی‌کند.')
      setPosition([35.6892, 51.3890])
    }
  }

  useEffect(() => {
    if (open && isClient) {
      setForm({
        buildingName: '',
        workDate: '',
        floor: '',
        latitude: '',
        longitude: ''
      })
      getUserLocation()
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
      setPosition(null)
    }
  }, [open, isClient])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    if (!form.buildingName || !form.floor || !form.latitude || !form.longitude) {
      toast.error('لطفاً تمام فیلدهای اجباری (نام ساختمان، طبقه، لوکیشن) را پر کنید.')
      return
    }

    mutate(
      { ...form, command: 'create' },
      {
        onSuccess: (response) => {
          if (response?.success) {
            toast.success('ساختمان با موفقیت ایجاد شد!')
            queryClient.invalidateQueries(['buildings']) // invalidate کوئری
            handleModal()
            setForm({
              buildingName: '',
              workDate: '',
              floor: '',
              latitude: '',
              longitude: ''
            })
            setPosition(null)
          } else {
            toast.error('خطایی در ایجاد ساختمان رخ داد.')
          }
        },
        onError: (error) => {
          const messages = error.response?.data?.ErrorMessage || ['خطایی رخ داد']
          toast.error(messages.join(', '))
        }
      }
    )
  }

  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal} />

  return (
    <Modal
      isOpen={open}
      toggle={handleModal}
      className='sidebar-sm'
      modalClassName='modal-slide-in'
      contentClassName='pt-0'
    >
      <ModalHeader className='mb-1' toggle={handleModal} close={CloseBtn} tag='div'>
        <h5 className='modal-title'>افزودن ساختمان</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>
        <div className='mb-1'>
          <Label className='form-label' for='buildingName'>
            نام ساختمان <span className='text-danger'>*</span>
          </Label>
          <InputGroup>
            <InputGroupText>
              <Trello size={15} />
            </InputGroupText>
            <Input
              id='buildingName'
              name='buildingName'
              value={form.buildingName}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='workDate'>
            تایم کاری
          </Label>
          <InputGroup>
            <InputGroupText>
              <Calendar size={15} />
            </InputGroupText>
            <Input
              type='date'
              id='workDate'
              name='workDate'
              value={form.workDate}
              onChange={handleChange}
            />
          </InputGroup>
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='floor'>
            طبقه <span className='text-danger'>*</span>
          </Label>
          <InputGroup>
            <InputGroupText>
              <AlignJustify size={15} />
            </InputGroupText>
            <Input id='floor' name='floor' value={form.floor} onChange={handleChange} required />
          </InputGroup>
        </div>

        <div className='mb-1'>
          <Label className='form-label'>
            انتخاب لوکیشن <span className='text-danger'>*</span>
          </Label>
          <div ref={containerRef} style={{ height: '300px', width: '100%' }}>
            {isClient && open && position && (
              <MapComponent
                position={position}
                setPosition={setPosition}
                setForm={setForm}
              />
            )}
          </div>
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='latitude'>
            عرض جغرافیایی <span className='text-danger'>*</span>
          </Label>
          <InputGroup>
            <InputGroupText>
              <AlignJustify size={15} />
            </InputGroupText>
            <Input
              id='latitude'
              name='latitude'
              value={form.latitude}
              onChange={handleChange}
              readOnly
            />
          </InputGroup>
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='longitude'>
            طول جغرافیایی <span className='text-danger'>*</span>
          </Label>
          <InputGroup>
            <InputGroupText>
              <AlignJustify size={15} />
            </InputGroupText>
            <Input
              id='longitude'
              name='longitude'
              value={form.longitude}
              onChange={handleChange}
              readOnly
            />
          </InputGroup>
        </div>

        <Button className='me-1' color='primary' onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'در حال ارسال...' : 'ایجاد ساختمان'}
        </Button>
        <Button color='secondary' onClick={handleModal} outline disabled={isLoading}>
          انصراف
        </Button>
      </ModalBody>
    </Modal>
  )
}

export default AddBuildingModal