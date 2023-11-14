import ReactDOM from "react-dom/client";
export class YPDrawer {
  constructor(chart) {
      this.chart = chart;
      [this.yAxis] = chart.yAxis;
  }
  // 增加标记元素组
  addAnnotation({
      id,
      labels,
      labelOptions,
  }) {
      const annotation = this.chart.addAnnotation({
          id: `annotation${id}`,
          labelOptions: {
              y: 0,
              allowOverlap: true,
              ...labelOptions
          },
          labels,
          draggable: '',
          animation: {}
      });
      let div = labels.map((one, i) => annotation.labels[i].graphic.div);
      // 一个label返回对象，多个label返回数组
      if (div.length === 1) [div] = div;
      return { annotation, div };
  }
  // 移除标记元素组
  removeAnnotation(id) {
      this.chart.removeAnnotation(`annotation${id}`);
  }
  // 更新label位置
  updateLabel = (labelOld, y) => {
      const label = labelOld;
      label.options.point.y = y;
      if (label.points[0].isInside) {
          label.attr({
              y: label.chart.yAxis[0].toPixels(y)
          });
      } else {
          label.attr({
              x: 0,
              y: -9e9,
          });
      }
  }
  // 增加svg元素
  addShape = ({
      type,
      point,
      points,
      color,
      width = 1,
      fill,
      r,
      y = 0,
      dashStyle,
  }, annotation) => {
      annotation.initShape({
          type,
          point,
          points,
          stroke: color,
          strokeWidth: width,
          fill,
          r,
          y,
          dashStyle,
      });
  }
  // 增加点对点线
  addPath({
      points,
      color: colorOld,
      isTransparent,
      width,
      fill,
      y,
      dashStyle,
  }, annotation) {
      let color = colorOld;
      if (isTransparent) {
          color = {
              linearGradient: {
                  x1: 1, x2: 0, y1: 0, y2: 0,
              },
              stops: [
                  [0, 'transparent'],
                  [1, color],
              ]
          };
      }
      this.addShape({
          type: 'path',
          points,
          color,
          width,
          fill,
          y,
          dashStyle,
      }, annotation);
  }
  // 增加圆点
  addCircle({
      point,
      color,
      width,
      fill,
      r,
  }, annotation) {
      this.addShape({
          type: 'circle',
          point,
          color,
          width,
          fill,
          r,
      }, annotation);
  }
  // 增加全屏横线
  addPlotLine({
      id,
      value,
      color,
      dashStyle = 'ShortDash',
      width = 1,
  }) {
      return this.yAxis.addPlotLine({
          id: `line${id}`,
          value,
          color,
          dashStyle,
          width,
      });
  }
  // 移除全屏横线
  removePlotLine(id) {
      this.yAxis.removePlotLine(`line${id}`);
  }
  // 更新全屏横线位置
  updatePlotLine = (plotLine, value, width = 1) => {
      const { options } = plotLine;
      options.value = value;
      // width = plotLine.svgElem.strokeWidth();
      const path = plotLine.axis.getPlotLinePath(value, width);
      if (path) plotLine.svgElem.attr({ d: path });
  }
  // 增加div元素
  addDiv = (template, targetDOM, id) => {
    //   ReactDOM.render(template, targetDOM);
    this[id] = ReactDOM.createRoot(targetDOM).render(template);
  }
  // 移除div元素
  removeDiv = (targetDOM, id) => {
      if (!targetDOM) return null;
    //   return ReactDOM.unmountComponentAtNode(targetDOM);
      return this[id].unmount();
  }
}
