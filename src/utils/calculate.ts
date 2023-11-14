import Decimal from 'decimal.js'
// 正常显示 数字
// Decimal.div(1, 3).toFixed()
// console.log('-0------------------')
// console.log(new Decimal(2).mul(3).mul(4).toFixed())
export const divided = (a, b, num = 6) => {
  if (a === '' || b === '') {
    return 0
  } else {
    if (num) {
      return Decimal.div(a, b).toFixed(num)
    } 
    return Decimal.div(a, b).toFixed()
  }
}

export const multiply = (a, b, num) => {
  if (a === '' || b === '') {
    return 0
  }
  if (num) {
    return new Decimal(a).mul(b).toFixed(num)
  }
  return new Decimal(a).mul(b).toFixed()
}