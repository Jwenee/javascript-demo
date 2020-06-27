/**
 * 
 * @param {*} areaDom 轮播图区域
 * @param {Array} options 轮播图配置 [{imgUrl,link}]
 */
function createBannerArea(areaDom, options) {
  // 1.创建一个区域用于显示图片
  const imgsArea = document.createElement('div')
  // 2.创建一个区域用于显示角标
  const signArea = document.createElement('div')

  let curIndex = 0 // 当前显示第几张图片
  let changeTimer = null // 切换定时器
  const changeDuration = 3000 // 
  let animationTimer = null
  const animationDuration = 20 // 动画间隔

  initImgs()
  initSigns()
  // 设置状态
  setStatus()
  // 自动切换
  autoChange()

  function initImgs() {
    imgsArea.style.width = '100%'
    imgsArea.style.height = '100%'
    imgsArea.style.display = 'flex'
    imgsArea.style.overflow = 'hidden'

    for (let i = 0; i < options.length; i++) {
      const obj = options[i]
      const imgEl = document.createElement('img')
      imgEl.src = obj.imgUrl
      imgEl.style.width = '100%'
      imgEl.style.height = '100%'
      imgEl.style.marginLeft = '0'
      imgEl.style.cursor = 'pointer'

      imgEl.addEventListener('click', function() {
        location.href = options[i].link
      })
      imgsArea.appendChild(imgEl)
    }

    areaDom.addEventListener('mouseenter', function() {
      clearInterval(changeTimer)
      changeTimer = null
    })
    areaDom.addEventListener('mouseleave', function() {
      autoChange()
    })

    areaDom.appendChild(imgsArea)
  }

  function initSigns() {
    signArea.style.textAlign = 'center'
    signArea.style.marginTop = '-25px'

    for (let i = 0; i < options.length; i++) {
      const sp = document.createElement('span')
      sp.style.display = 'inline-block'
      sp.style.width = '12px'
      sp.style.height = '12px'
      sp.style.background = 'lightgray'
      sp.style.margin = '0 7px'
      sp.style.borderRadius = '50%'
      sp.style.cursor = 'pointer'

      sp.addEventListener('click', function() {
        curIndex = i
        setStatus()
      })
      signArea.appendChild(sp)
    }

    areaDom.appendChild(signArea)
  }

  function setStatus() {
    // 1.设置圆圈的背景颜色
    for (let i = 0; i < signArea.children.length; i++) {
      if (i === curIndex) {
        // 设置为选中状态
        signArea.children[i].style.background = '#be926f'
      } else {
        signArea.children[i].style.background = 'lightgray' // 设置为普通状态
      }
    }
    // 2.显示图片
    let start = parseInt(imgsArea.children[0].style.marginLeft)
    const end = curIndex * -100
    const dis = end - start
    const durationTime = 500
    const speed = dis / durationTime

    // 如果之前存在动画则先清除
    if (animationTimer) {
      clearInterval(animationTimer)
    }
    animationTimer = setInterval(function() {
      start += speed * animationDuration
      imgsArea.children[0].style.marginLeft = `${start}%`
      if (Math.abs(end - start) < 1) {
        imgsArea.children[0].style.marginLeft = `${end}%`
        clearInterval(animationTimer)
      }
    }, animationDuration)
    
  }

  function autoChange() {
    if (changeTimer) {
      return
    }
    changeTimer = setInterval(function() {
      if (curIndex === options.length - 1) {
        curIndex = 0
      } else {
        curIndex++
      }
      setStatus()
    }, changeDuration)
  }
}