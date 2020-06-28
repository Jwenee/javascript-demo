/**
 * 创建瀑布流
 * @param {*} domArea 容器
 * @param {*} urls 图片数组地址
 * @param {*} perWidth 每张图片宽度
 */
function createWaterFall(domArea, urls, perWidth) {
  let colNum // 多少列
  let gap // 每一列之间间隙
  // 1.创建图片
  createImgDoms()
  // 2.设置图片的坐标
  setImgPosition()

  let timer = null
  window.onresize = function() {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function() {
      setImgPosition()
    }, 500)
  }


  function cal() {
    const containerWidth = parseInt(domArea.clientWidth)
    console.log(containerWidth)
    colNum = Math.floor(containerWidth / perWidth)
    // 剩余空间
    const space = containerWidth - colNum * perWidth
    gap = space / (colNum + 1)
  }

  function createImgDoms() {
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const img = document.createElement('img')
      img.src = url
      img.style.width = perWidth + 'px'
      img.style.position = 'absolute'
      img.onload = function() {
        setImgPosition()
      }
      // img.style.left = ''
      // img.style.top = ''

      domArea.appendChild(img)
    }
  }

  function setImgPosition() {
    //  计算多少列
    cal()
    let colY = new Array(colNum) // 存放每一列下一个坐标
    colY.fill(0)
    // [0,0,0,0]
    // 依次找到最小值，下一个图片排列到对应位置，并更新数组
    
    for (let i = 0; i < domArea.children.length; i++) {
      const img = domArea.children[i]
      // 求出下一次排列最小y值
      const y = Math.min(...colY)
      // 求出第几列
      const index = colY.indexOf(y)
      // index
      // 0      1*gap + 0 *width
      // 1      2*gap + 1 *width
      // 2      3*gap + 2 *width
      const x = (index + 1) * gap + index * perWidth

      img.style.left = x + 'px'
      img.style.top = y + 'px'
      // 更新已经排列图片的列数值
      // 当图片设置了src属性之后，不会同步完成图片加载，而是异步加载
      // img.height = 0
      colY[index] += parseInt(img.height) + gap
    }

    // 找到数组中最大数组
    const height = Math.max(...colY)
    // 解决父元素高度塌陷问题
    domArea.style.height = height + 'px'
  }
}