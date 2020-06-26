let sw = 20, // 方块宽
    sh = 20, // 方块高  
    tr = 30, // 行数
    td = 30; // 列数
let snake = null,
    food = null,
    game = null;

function Square(x, y, classname) {
  // 0,0  0,0
  // 20,0  1,0
  // 40,0  2,0
  this.x = x * sw
  this.y = y * sh
  this.class = classname

  this.viewContent = document.createElement('div') // 方块对应dom元素
  this.viewContent.className = this.class // 
  this.parent = document.getElementById('snake-wrap')  //
}

Square.prototype.create = function() {  // 创建方块dom
  this.viewContent.style.position = 'absolute'
  this.viewContent.style.width = `${sw}px`
  this.viewContent.style.height = `${sh}px`
  this.viewContent.style.left = `${this.x}px`
  this.viewContent.style.top = `${this.y}px`

  this.parent.appendChild(this.viewContent)
}

Square.prototype.remove = function() {
  this.parent.removeChild(this.viewContent)
}

function Snake() {
  this.head = null // save snake head info
  this.tail = null // save snake tail info
  this.pos = [] // 存储蛇身上的每一个方块信息 
  this.directionNum = {
    left: {
      x: -1,
      y: 0,
      rotate: 180
    },
    right: {
      x: 1,
      y: 0,
      rotate: 0
    },
    up: {
      x: 0,
      y: -1,
      rotate: -90
    },
    down: {
      x: 0,
      y: 1,
      rotate: 90
    }
  } // 存储蛇走的方向
}

Snake.prototype.init = function() {
  // create snake head
  const snakeHead = new Square(2, 0, 'snake-head')
  snakeHead.create()
  this.head = snakeHead // 蛇头信息
  this.pos.push([2, 0])

  // create body one
  const snakeBody1 = new Square(1, 0, 'snake-body')
  snakeBody1.create()
  this.pos.push([1, 0])

  // create body two
  const snakeBody2 = new Square(0, 0, 'snake-body')
  snakeBody2.create()
  this.tail = snakeBody2 // 蛇尾信息
  this.pos.push([0, 0])

  // 形成链表
  snakeHead.last = null
  snakeHead.next = snakeBody1

  snakeBody1.last = snakeHead
  snakeBody1.next = snakeBody2

  snakeBody2.last = snakeBody1
  snakeBody2.next = null

  // 初始方向
  this.direction = this.directionNum.right
}

Snake.prototype.getNextPos = function() { // 获取蛇头下一个位置对应元素 
  // 蛇头下一个点
  const nextPos = [
    this.head.x / sw + this.direction.x,
    this.head.y / sh + this.direction.y
  ]
  // 下个点自身，over
  let selfCollied = false
  this.pos.forEach(function(value) {
    if (value[0] == nextPos[0] && value[1] == nextPos[1]) {
      selfCollied = true
    }
  })
  if (selfCollied) {
    // do something
    this.strategies.over.call(this)
    return
  }
  // 下个点是边界，over
  if (nextPos[0] < 0 || nextPos[1] < 0 || nextPos[0] > td -1 || nextPos[1] > tr -1) {
    this.strategies.over.call(this)
    return
  }
  // 下个点是食物，增加
  if (food && food.pos[0] == nextPos[0] && food.pos[1] == nextPos[1]) {
    this.strategies.eat.call(this)
    return
  }
  // 下个点空，移动
  this.strategies.move.call(this)
}

Snake.prototype.strategies = {
  move: function(format) { // 参数决定是否删除最后一个方块蛇尾
    // create new body, base old head
    const newBody = new Square(this.head.x / sw, this.head.y / sh, 'snake-body')
    newBody.next = this.head.next
    newBody.next.last = newBody
    newBody.last = null
    this.head.remove()
    newBody.create()

    // create new head
    const newHead = new Square(
      this.head.x / sw + this.direction.x,
      this.head.y / sh + this.direction.y,
      'snake-head'
    )
    newHead.next = newBody
    newHead.last = null
    newBody.last = newHead
    newHead.viewContent.style.transform = `rotate(${this.direction.rotate}deg)`
    newHead.create()

    // update pos,比原先增加了newHead
    this.pos.splice(0, 0, [this.head.x / sw + this.direction.x, this.head.y / sh + this.direction.y])
    this.head = newHead

    if (!format) {
      console.log(this.pos)
      this.tail.remove()
      this.tail = this.tail.last
      this.pos.pop()
    }
  },
  eat: function() {
    this.strategies.move.call(this, true)
    createFood()
    game.score++
  },
  over: function() {
    game.pass()
  }
}

snake = new Snake()
// snake.init()
// snake.getNextPos()

function createFood() {
  let x = null,
      y = null
  
  let include = true //  食物坐标在蛇身上循环，否则不循环
  while (include) {
    x = Math.round(Math.random() * (td - 1))
    y = Math.round(Math.random() * (tr - 1))

    snake.pos.forEach(function(value) {
      if (x != value[0] && y != value[1]) { // 不存在蛇身上
        include = false
      }
    })
  }

  food = new Square(x, y, 'food')
  food.pos = [x, y]

  let foodDom = document.querySelector('.food')
  if (foodDom) {
    foodDom.style.left = `${x * sw}px`
    foodDom.style.top = `${y * sh}px`
  } else {
    food.create()
  }
}

function Game() {
  this.timer = null
  this.score = 0
}

Game.prototype.init = function() {
  snake.init()
  createFood()

  document.onkeydown = function(e) {
    if (e.which == 37 && snake.direction != snake.directionNum.right) {
      snake.direction = snake.directionNum.left
    }
    if (e.which == 38 && snake.direction != snake.directionNum.down) {
      snake.direction = snake.directionNum.up
    }
    if (e.which == 39 && snake.direction != snake.directionNum.left) {
      snake.direction = snake.directionNum.right
    }
    if (e.which == 40 && snake.direction != snake.directionNum.up) {
      snake.direction = snake.directionNum.down
    }
  }

  this.start()
}

Game.prototype.start = function() {
  this.timer = setInterval(function() {
    snake.getNextPos()
  }, 200)
}

Game.prototype.pause = function() {
  clearInterval(this.timer)
}

Game.prototype.pass = function() {
  clearInterval(this.timer)
  alert(`你的得分为:${this.score}`)

  const snakeWrap = document.getElementById('snake-wrap')
  snakeWrap.innerHTML = ''
  snake = new Snake()
  game = new Game()

  const startBtnWrap = document.querySelector('.start')
  startBtnWrap.style.display = 'block'
}

game = new Game()

const startBtn = document.querySelector('.start button')
startBtn.onclick = function() {
  startBtn.parentNode.style.display = 'none'
  game.init()
}

const snakeWrap = document.getElementById('snake-wrap')
const pauseBtn = document.querySelector('.pause button')
snakeWrap.onclick = function() {
  game.pause()

  pauseBtn.parentNode.style.display = 'block'
}

pauseBtn.onclick = function() {
  game.start()

  pauseBtn.parentNode.style.display = 'none'
}
