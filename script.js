const FIELD_SIZE = 30 //размер клетки морского боя

//поиск тега canvas в index.html
const canvas = document.querySelector('canvas') 
//контекст тега canvas
const context = canvas.getContext('2d') 

//размеры canvas
canvas.width = 1020
canvas.height = 510

//координаты мыши над canvas
const mouse = getMouse(canvas)

//алгоритм обработки действий пользователя
const game = new Game()

//очистка canvas
function clearCanvas() {
    canvas.width |= 0
}

//функция отрисовки тетрадного поля
function drawGrid() {
    context.strokeStyle = 'blue'
    context.lineWidth = 0.5

    //вертикльные линии клеток
    for (let i = 0; i < canvas.width / FIELD_SIZE; i++) {
        context.beginPath() 
        context.moveTo(i * FIELD_SIZE, 0) 
        context.lineTo(i * FIELD_SIZE, canvas.height)
        context.stroke()
    }

    //горизонтальные линии клеток
    for (let i = 0; i < canvas.height / FIELD_SIZE; i++) {
        context.beginPath() 
        context.moveTo(0, i * FIELD_SIZE) 
        context.lineTo(canvas.width, i * FIELD_SIZE)
        context.stroke()
    }

    //красная линия
    context.strokeStyle ='red'
    context.lineWidth = 2

    context.beginPath()
    context.moveTo(0, 90)
    context.lineTo(canvas.width, 90)
    context.stroke()
}

function drawRules() {
    context.strokeStyle = 'black'
    context.fillStyle = 'rgba(0, 0, 0, 0.75)'
    context.lineWidth = 1.7

    context.beginPath()
    context.rect(300, 30, 120, 30) 
    context.fill()
    context.stroke()

    context.beginPath()
    context.rect(510, 30, 90, 30) 
    context.fill()
    context.stroke()

    context.beginPath()
    context.rect(690, 30, 60, 30) 
    context.fill()
    context.stroke()

    context.beginPath()
    context.rect(840, 30, 30, 30) 
    context.fill()
    context.stroke()

    context.textAlign = "center"
    context.font = "30px comics sans"
    context.fillStyle = "black";

    const text = "Расставьте корабли:"
    context.fillText(text, 142, 53)

    const x1 = "x1"
    context.fillText(x1, 467, 53)

    const x2 = "x2"
    context.fillText(x2, 645, 53)

    const x3 = "x3"
    context.fillText(x3, 796, 53)

    const x4 = "x4"
    context.fillText(x4, 915, 53)
}
