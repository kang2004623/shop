import request from '@/utils/request'
// 获取收货地址列表
export const getAddressList = () => {
  return request.get('http://smart-shop.itheima.net/index.php?s=/api/address/list')
}
// 添加收货地址
export const addAddress = (data) => {
  return request.post('http://smart-shop.itheima.net/index.php?s=/api/address/add', {
    form: {
      name: data.name,
      phone: data.phone,
      region: data.region || [],
      detail: data.detail
    }
  })
}

// 设置默认地址
export const setDefaultAddress = (addressId) => {
  return request.post('http://smart-shop.itheima.net/index.php?s=/api/address/setDefault', { addressId })
}

// 编辑收货地址
export const editAddress = (data) => {
  return request.post('http://smart-shop.itheima.net/index.php?s=/api/address/edit', {
    addressId: data.addressId,
    form: {
      name: data.name,
      phone: data.phone,
      region: data.region || [],
      detail: data.detail
    }
  })
}

// 获取收货地址详情
export const getAddressDetail = (addressId) => {
  return request.get('http://smart-shop.itheima.net/index.php?s=/api/address/detail', {
    params: { addressId }
  })
}

// 删除收货地址
export const deleteAddress = (addressId) => {
  return request.post('http://smart-shop.itheima.net/index.php?s=/api/address/remove', { addressId })
}
