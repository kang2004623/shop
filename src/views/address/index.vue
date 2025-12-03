<template>
  <div class="address-page">
    <van-nav-bar title="地址管理" left-arrow @click-left="$router.back()" />

    <div class="address-list">
      <van-swipe-cell v-for="item in list" :key="item.address_id">
        <van-cell :class="{ selected: selectedId === item.address_id }" @click="onSelect(item)">
          <div class="info">
            <div class="top">
              <span class="name">{{ item.name }}</span>
              <span class="phone">{{ item.phone }}</span>
              <van-tag v-if="item.is_default === 1" size="mini" type="danger">默认</van-tag>
            </div>
            <div class="address-detail">{{ getFullAddress(item) }}</div>
          </div>
          <template #right-icon>
            <van-icon name="edit" @click.stop="onEdit(item)" />
          </template>
        </van-cell>

        <template #right>
          <van-button square text="删除" type="danger" @click="onDelete(item.address_id)" />
          <van-button
            v-if="item.is_default !== 1"
            square
            text="设默认"
            type="primary"
            @click="onDefault(item.address_id)"
          />
        </template>
      </van-swipe-cell>
    </div>

    <div class="bottom-btn">
      <van-button block type="primary" @click="onAdd">新增收货地址</van-button>
    </div>

    <!-- 编辑弹窗 -->
    <van-popup v-model="showPopup" position="bottom" round>
      <van-form @submit="onSubmit">
        <van-field
          v-model="formData.name"
          label="收货人"
          placeholder="姓名"
          :rules="[{ required: true, message: '请输入收货人' }]"
        />
        <van-field
          v-model="formData.phone"
          label="手机号"
          placeholder="手机号"
          :rules="[
            { required: true, message: '请输入手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
          ]"
        />

        <!-- 地区选择 -->
        <van-field
          v-model="formData.regionText"
          label="所在地区"
          placeholder="请选择省市区"
          readonly
          is-link
          @click="showAreaPicker = true"
          :rules="[{ required: true, message: '请选择所在地区' }]"
        />

        <van-field
          v-model="formData.detail"
          label="详细地址"
          placeholder="街道、小区、门牌号等"
          :rules="[{ required: true, message: '请输入详细地址' }]"
        />

        <div class="form-btn">
          <van-button block type="primary" native-type="submit" :loading="loading">保存</van-button>
        </div>
      </van-form>
    </van-popup>

    <!-- 省市区选择器 -->
    <van-popup v-model="showAreaPicker" position="bottom" round>
      <van-area
        :area-list="areaList"
        @confirm="onAreaConfirm"
        @cancel="showAreaPicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { getAddressList, addAddress, editAddress, deleteAddress, setDefaultAddress } from '@/api/address'
import { Toast, Dialog } from 'vant'
import { areaList } from '@vant/area-data' // 导入 Vant 的地区数据

export default {
  name: 'AddressIndex',
  data () {
    return {
      list: [],
      showPopup: false,
      showAreaPicker: false,
      loading: false,
      selectedId: null,
      areaList: areaList, // 使用 Vant 的地区数据

      formData: {
        addressId: '',
        name: '',
        phone: '',
        region: [], // 存储地区对象数组
        regionText: '', // 显示的地区文本
        detail: '' // 详细地址
      }
    }
  },
  async created () {
    await this.loadList()
  },
  methods: {
    async loadList () {
      try {
        const res = await getAddressList()
        this.list = res.data.list || []
        console.log('地址列表:', this.list)
      } catch (error) {
        Toast.fail('加载地址失败')
      }
    },

    getFullAddress (item) {
      // 根据后端返回的数据格式构建完整地址
      let address = ''
      if (item.region && Array.isArray(item.region)) {
        address = item.region.map(r => r.label).join('')
      }
      // 如果后端有 detail 字段就加上，没有就不加
      return address + (item.detail || '')
    },

    onAdd () {
      this.resetForm()
      this.showPopup = true
    },

    onEdit (item) {
      this.formData = {
        addressId: item.address_id,
        name: item.name,
        phone: item.phone,
        region: item.region || [],
        regionText: this.getRegionText(item.region),
        detail: item.detail || ''
      }
      this.showPopup = true
    },

    getRegionText (region) {
      if (!region || !Array.isArray(region)) return ''
      return region.map(r => r.label).join('')
    },

    onAreaConfirm (selectedOptions) {
      // 将选中的地区转换为需要的格式
      this.formData.region = selectedOptions.map(option => ({
        value: option.code,
        label: option.name
      }))
      this.formData.regionText = selectedOptions.map(option => option.name).join('')
      this.showAreaPicker = false
    },

    async onSubmit () {
      this.loading = true
      try {
        console.log('提交的数据:', this.formData)

        // 构建请求数据
        const requestData = {
          name: this.formData.name,
          phone: this.formData.phone,
          region: this.formData.region,
          detail: this.formData.detail // 如果有 detail 字段
        }

        if (this.formData.addressId) {
          // 编辑地址
          requestData.addressId = this.formData.addressId
          await editAddress(requestData)
          Toast.success('修改成功')
        } else {
          // 新增地址
          await addAddress(requestData)
          Toast.success('添加成功')
        }

        this.showPopup = false
        await this.loadList()
      } catch (error) {
        console.error('请求错误:', error)
        // 根据错误类型显示不同提示
        if (error.message && error.message.includes('timeout')) {
          Toast.fail('请求超时，请检查网络')
        } else {
          Toast.fail(error.message || '操作失败')
        }
      } finally {
        this.loading = false
      }
    },

    async onDelete (addressId) {
      try {
        await Dialog.confirm({
          title: '确认删除',
          message: '确定要删除这个地址吗？'
        })
        await deleteAddress(addressId)
        Toast.success('删除成功')
        await this.loadList()
      } catch (error) {
        if (error === 'cancel') return
        Toast.fail('删除失败')
      }
    },

    async onDefault (addressId) {
      try {
        await setDefaultAddress(addressId)
        Toast.success('设置成功')
        await this.loadList()
      } catch (error) {
        Toast.fail('设置失败')
      }
    },

    onSelect (item) {
      // 如果是从支付页面跳转过来的
      if (this.$route.query.from === 'pay') {
        this.$router.replace({
          path: '/pay',
          query: {
            ...this.$route.query,
            addressId: item.address_id
          }
        })
      }
    },

    resetForm () {
      this.formData = {
        addressId: '',
        name: '',
        phone: '',
        region: [],
        regionText: '',
        detail: ''
      }
    }
  }
}
</script>

<style scoped>
.address-page {
  min-height: 100vh;
  padding-bottom: 60px;
}

.address-list {
  margin-top: 46px;
}

.info {
  font-size: 14px;
}
.top {
  margin-bottom: 5px;
}
.name {
  margin-right: 10px;
  font-weight: bold;
}
.phone {
  margin-right: 10px;
  color: #666;
}
.address-detail {
  color: #666;
  line-height: 1.5;
}

.bottom-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: white;
}

.form-btn {
  padding: 20px 16px;
}

.selected {
  background: #f5f5f5;
}
</style>
