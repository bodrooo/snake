const run = document.getElementById("run")
const loading = document.getElementById("loading")
const landingPage = document.getElementById("landing-page")
const body = document.body

const eatSong = document.getElementById("eat")
const loseSong = document.getElementById("lose")

function fullscreen() {
  if (body.requestFullscreen) {
    body.requestFullscreen();
  } else if (body.webkitRequestFullscreen) {
    body.webkitRequestFullscreen();
  } else if (body.msRequestFullscreen) {
    body.msRequestFullscreen();
  }
}

run.addEventListener("click", () => {

  fullscreen()
  landingPage.style.display = "none"
  run.style.display = "none"

  const cvs = document.querySelector("canvas")
  const c = cvs.getContext('2d')

  const controlButtons = document.querySelectorAll(".btnControl button")
  const reset = document.getElementById('reset')
  const setting = document.getElementById("setting")
  const menuSetting = document.getElementById('menuSetting')
  const speed = document.getElementById("speed")

  reset.style.display = "none"

  cvs.width = 400
  cvs.height = 400

  let gameControl = 7

  let score = 0

  const grid = 20

  let snake = {
    x: grid * 3,
    y: grid * 3,

    snakeParts: [],
    tail: 3,

    move: {
      x: 0,
      y: 0
    }
  }

  let gameOver = false

  const arrColor = ["#0002A1", "rgba(0, 255, 227, 0.8)", "rgba(255, 243, 0, 0.8)", "rgba(101, 107, 237, 0.8)", "rgba(168, 0, 255, 1)"]

  let food = {
    x: Math.floor(Math.random() * grid) * grid,
    y: Math.floor(Math.random() * grid) * grid,
    i: Math.floor(Math.random() * arrColor.length)
  }

  const funcGrid = () => {
    for (let i = grid; i < cvs.width; i += grid) {
      c.strokeStyle = "white"
      c.beginPath()
      c.moveTo(i, 0)
      c.lineTo(i, cvs.height)
      c.stroke()
      c.closePath()
    }
    for (let i = grid; i < cvs.height; i += grid) {
      c.strokeStyle = "white"
      c.beginPath()
      c.moveTo(0, i)
      c.lineTo(cvs.height, i)
      c.stroke()
      c.closePath()
    }
  }

  let showGridline = false

  let highScore

  const main = () => {
    c.clearRect(0, 0, cvs.width, cvs.height)

    showGridline ? funcGrid(): undefined

    c.fillStyle = arrColor[food.i]
    c.fillRect(food.x, food.y, grid, grid)

    for (let i = 1; i < snake.snakeParts.length; i++) {
      c.fillStyle = "lime"
      c.fillRect(snake.snakeParts[i].x+1, snake.snakeParts[i].y+1, grid-2, grid-2)
      if (snake.x == snake.snakeParts[i].x && snake.y == snake.snakeParts[i].y) {
        if (snake.tail > 3) {
          gameOver = true
        }
      }
      if (snake.snakeParts[i].x == food.x && snake.snakeParts[i].y == food.y) {
        food = {
          x: Math.floor(Math.random() * grid) * grid,
          y: Math.floor(Math.random() * grid) * grid
        }
      }
    }

    snake.snakeParts.push({
      x: snake.x, y: snake.y
    })

    c.fillStyle = "red"
    c.fillRect(snake.x, snake.y, grid, grid)

    while (snake.snakeParts.length > snake.tail) {
      snake.snakeParts.shift()
    }

    if (snake.x == food.x && snake.y == food.y) {

      food = {
        x: Math.floor(Math.random() * grid) * grid,
        y: Math.floor(Math.random() * grid) * grid,
        i: Math.floor(Math.random() * arrColor.length)
      }

      eat.play()
      snake.tail++
      score++
      localStorage.setItem("highScore", score)
    }

    c.fillStyle = "white"
    c.font = "12px Arial"
    c.textAlign = "left"
    c.fillText(`Score: ${score}`, grid * 2, cvs.height - grid - 5)
    c.fillText(`Score High: ${highScore}`, grid * 2, cvs.height - 5)

    let vx = snake.move.x * grid
    let vy = snake.move.y * grid

    if (snake.x + vx < 0) {
      snake.x = cvs.width - grid
    } else if (snake.x + vx >= cvs.width) {
      snake.x = 0
    } else {
      snake.x += vx
    }

    if (snake.y + vy < 0) {
      snake.y = cvs.height - grid
    } else if (snake.y + vy >= cvs.height) {
      snake.y = 0
    } else {
      snake.y += vy
    }

    if (gameOver) {
      loseSong.play()
      clearInterval(game)
      reset.style.display = "block"
      speed.removeAttribute("disabled", true)
      showGridline = false
      c.fillStyle = 'white'
      c.font = "50px Arial"
      c.textAlign = "center"
      c.fillText("U Lose", cvs.width/2, cvs.height/2)
    }

  }

  highScore = localStorage.getItem("highScore") || 0

  const direction = (e) => {
    const id = e.target.id
    if (id == "up" && snake.move.y != 1) {
      snake.move.x = 0
      snake.move.y = -1
      speed.setAttribute("disabled", true)
    } else if (id == "down" && snake.move.y != -1) {
      snake.move.x = 0
      snake.move.y = 1
      speed.setAttribute("disabled", true)
    } else if (id == "left" && snake.move.x != 1) {
      snake.move.x = -1
      snake.move.y = 0
      speed.setAttribute("disabled", true)
    } else if (id == "right" && snake.move.x != -1) {
      snake.move.x = 1
      snake.move.y = 0
      speed.setAttribute("disabled", true)
    }
  }

  for (const btn of controlButtons) {
    btn.addEventListener("click", direction)
  }

  reset.addEventListener('click', () => {
    reset.style.display = "none"
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }


    c.fillText(`Score High: ${highScore}`, grid*2, cvs.height - 5)

    score = 0

    gameOver = false

    snake = {
      x: grid * 3,
      y: grid * 3,

      snakeParts: [],
      tail: 2,

      move: {
        x: 0,
        y: 0
      }
    }

    food = {
      x: Math.floor(Math.random() * grid) * grid,
      y: Math.floor(Math.random() * grid) * grid
    }

    game = setInterval(main, 1000/gameControl)
  })

  const showGrid = document.querySelector("#grid label input")

  showGrid.addEventListener("change",
    () => {
      if (showGrid.checked) {
        document.getElementById("text-grid").textContent = "Hide Grid"
        showGridline = true
      } else {
        document.getElementById("text-grid").textContent = "Show Grid"
        showGridline = false
      }
    })

  speed.addEventListener('change',
    () => {
      const id = speed.value
      if (id == "lambat") {
        gameControl = 5
      } else if (id == "lumayan") {
        gameControl = 7
      }
      if (id == "cepat") {
        gameControl = 10
      }
      if (id == "sangatCepat") {
        gameControl = 14
      }
    })

  let settingIcon = false
  menuSetting.style.display = "none"
  setting.addEventListener('click',
    () => {
      settingIcon = !settingIcon
      if (settingIcon == true) {
        setting.classList = 'fa fa-close'
        menuSetting.style.display = "block"
        clearInterval(game)
      } else {
        menuSetting.style.display = "none"
        setting.classList = 'fa fa-gear'
        game = setInterval(main, 1000/gameControl)
      }
    })


  setTimeout(() => {
    loading.style.display = "none"
  },
    2000)

  var game = setInterval(main,
    1000/gameControl)
})