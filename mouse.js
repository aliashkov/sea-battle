//получить положение мыши над canvas
function getMouse (element) {
    const mouse = {
        x: 0,
        y: 0,
        s: false, //scrolling
        left: false,
        pLeft: false //при предыдущей итерации игры
    }

    element.addEventListener('mousemove', function(event) {
        //абсолютное положение элемента 
        //относительно верхнего левого угла страницы
        const rect = element.getBoundingClientRect()

        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    })

    //при прокрутке колёсика
    element.addEventListener('wheel', function(event) {
        mouse.s = !mouse.s
    })

    //нажатие на любую кнопку мыши
    element.addEventListener('mousedown', function(event) {
        //1 при прожатой левой кнопке мыши
        if (event.buttons === 1) {
            mouse.left = true
        }
    })

    //при отпускании кнопки мыши
    element.addEventListener('mouseup', function(event) {
        //при отжатой левой кнопке мыши
        if (event.buttons !== 1) {
            mouse.left = false
        }
    })

    return mouse
}