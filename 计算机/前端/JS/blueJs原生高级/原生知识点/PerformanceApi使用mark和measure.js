// 标记一个开始点
performance.mark("mySetTimeout-start");

// 等待1000ms
setTimeout(function() {
  // 标记一个结束点
  performance.mark("mySetTimeout-end");

  // 标记开始点和结束点之间的时间戳
  performance.measure(
    "mySetTimeout",
    "mySetTimeout-start",
    "mySetTimeout-end"
  );

  // 获取所有名称为mySetTimeout的measures
  var measures = performance.getEntriesByName("mySetTimeout");
  var measure = measures[0];
  console.log("setTimeout milliseconds:", measure.duration)

  // 清除标记
  performance.clearMarks();
  performance.clearMeasures();
}, 1000);


//以上程序输出是：setTimeout milliseconds: 1001.0999999940395

/*

可以看到，高精度的时间戳是非常精准的。（我们知道由于执行队列的原因，setTimeout不会在给定的1000ms之后就立即执行）
Performance API提供了很多方便测试我们程序性能的接口。比如mark和measure。很多优秀的框架也用到了这个API进行测试，
比如我最近在看的Vue框架。它里面就频繁用到了mark和measure来测试程序性能。所以想要开发高性能的web程序，
了解Performace API还是非常重要的。
*/