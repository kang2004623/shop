<template>
    <div class="count_box">
        <button @click="handleSub" class="minus">-</button>
        <input class="inp" :value="value" @change="handleChange">
        <button @click="handleadd" class="add">+</button>
    </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 1
    }
  },
  methods: {
    handleSub () {
      if (this.value <= 1) {
        return
      }
      this.$emit('input', this.value - 1)
    },
    handleadd () {
      this.$emit('input', this.value + 1)
    },
    handleChange (e) {
      const num = +e.target.value// 转数字
      // 输入了不合法的文本或负值，回退成原来的value值
      if (isNaN(num) || num < 1) {
        e.target.value = this.value
        return
      }
      this.$emit('input', num)
    }

  }
}
</script>

<style lang="less" scoped>
.count_box {
    width: 110px;
    display: flex;
    .minus,.add {
        height: 30px;
        width: 30px;
        outline: none;//移除外轮廓线
        border:none;
        background-color: #efefef;
    }

    .inp {
        height: 30px;
        width: 40px;
        margin: 0 5px;
        text-align: center;
        background-color: #efefef;
        border:none;
        outline: none;
    }
}
</style>
