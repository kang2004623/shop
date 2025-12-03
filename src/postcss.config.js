module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      // vw适配的标准屏的宽度 iphonex
      // 设计图750，调成1倍--370屏幕
      // 设计图640，调成1倍--320
      viewportWidth: 375
    }
  }
}
