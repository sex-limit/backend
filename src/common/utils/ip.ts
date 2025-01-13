import axios from 'axios'

interface IPData {
  ip: string
  dec: string
  country: string
  countryCode: string
  province: string
  city: string
  districts: string
  idc: string
  isp: string
  net: string
  zipcode: string
  areacode: string
  protocol: string
  location: string
  myip: string
  time: string
}

export const getIpAddress = async (ip: string) => {
  const result = await axios<{ data: IPData }>({
    method: 'GET',
    url: 'https://api.mir6.com/api/ip',
    params: {
      ip,
      type: 'json',
    },
  })

  const data = result.data.data

  const meta = {
    country: data.country || '',
    province: data.province?.replace('省', '') || '',
    city: data.city.replace('市', ''),
    ip_location: '未知',
  }

  if (meta.country === '中国') {
    meta.ip_location = meta.province
  } else {
    meta.ip_location = meta.country
  }

  return meta
}
