import Decimal from 'decimal.js'

// 截取位数
export const getDecimal = (num : number, floor : number) => {
  if (floor) {
    return new Decimal(num).mul(1).toFixed(floor)
  }
  return new Decimal(num).mul(1).toFixed()
}

export const getSubstring = (str, startNum, endNum) => {
  const len = str.length;
  const start= str.substring(0,startNum);
  const end= str.substring(len-endNum, len);
  return `${start}...${end}`
} 

export const numFormat = (num, digits = 2) => {
  if (num >= Math.pow(10, 6)) {
      num = Decimal.div(num, Math.pow(10, 6)).toFixed(digits) + 'M'
  } else if (num >= Math.pow(10, 3)) {
      num = Decimal.div(num, Math.pow(10, 3)).toFixed(digits) + 'K'
  }
  return num
}