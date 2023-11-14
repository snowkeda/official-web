// 比较实时价格比之前的价格高了还是低了
export function comparePrice(newA, oldA, itemN, itemO) {
  if (Number(itemN) === Number(itemO)) {
    return {
      old: itemO,
      new: itemN,
      up: true,
      normal: itemN,
      incre: '',
      previous: '',
    };
  }
  if (itemN.split('.')[0].length > itemO.split('.')[0].length) {
    return {
      old: itemO,
      new: itemN,
      up: true,
      normal: '',
      incre: itemN,
      previous: itemO,
    };
  }
  if (itemN.split('.')[0].length < itemO.split('.')[0].length) {
    return {
      old: itemO,
      new: itemN,
      up: false,
      normal: '',
      incre: itemN,
      previous: itemO,
    };
  }
  for (let i = 0; i < newA.length; i += 1) {
    const n = Number(newA[i]);
    const o = Number(oldA[i]);
    if (n > o) {
      return {
        old: itemO,
        new: itemN,
        up: true,
        normal: itemN.slice(0, i),
        incre: itemN.slice(i),
        previous: itemO.slice(i),
      };
    }
    if (n < o) {
      return {
        old: itemO,
        new: itemN,
        up: false,
        normal: itemN.slice(0, i),
        incre: itemN.slice(i),
        previous: itemO.slice(i),
      };
    }
  }
  return {
    old: itemO,
    new: itemN,
    up: true,
    normal: itemN,
    incre: '',
    previous: '',
  };
}

export function reflowChart(CHART) {
  if (CHART) CHART.reflow();
}

// 单屏最小价差算法
export function getRangeMinDiff({ max, min, minRange }) {
  const dataDiff = max - min; // 数据差
  let dataRangePadding = 0;
  // 是否需要扩大范围
  if (minRange > dataDiff) {
      dataRangePadding = (minRange - dataDiff) / 2;
  }
  return {
      max: max + dataRangePadding,
      min: min - dataRangePadding,
  };
}

// 单屏上下留空算法
export function getRangePadding({ max, min, maxPadding }) {
  let dataDiffPadding = 0;
  if (maxPadding > 0 && maxPadding < 50) {
      const dataDiff = max - min; // 数据差
      const maxPaddingRate = maxPadding / 100; // 留空比例
      dataDiffPadding = (dataDiff / (1 - (maxPaddingRate * 2))) * maxPaddingRate; // 留空数据值
  }
  return {
      max: max + dataDiffPadding,
      min: min - dataDiffPadding,
  };
}