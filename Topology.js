const MINIMUM = 100
const MAXIMUM = -100

class Topology {
    constructor(param) {
        this.offsetX = param.offsetX
        this.offsetY = param.offsetY
        this.drawer = new Draw({
            offsetX: this.offsetX, 
            offsetY: this.offsetY
        })
        //скрытие кораблей у бота
        this.secret = param.secret || false 

        this.ships = []
        this.checks = []
        this.injuries = []
        this.kills = []
        this.last = {}
        this.score = {}
    }

    //добавление кораблей
    //принимает какое-то кол-во кораблей и добавляет их в массив ships
    addShips(...ships) {
        //проверяем не был ли ранее добавлен данный корабль, 
        //если не был, то добавляем в ships
        for(const ship of ships) {
            if(!this.ships.includes(ship)) {
                this.ships.push(ship)
            }
        }
        return this
    }

    //добавление выстрелов
    //принимает какое-то кол-во выстрелов и добавляет их в массив checks
    addChecks(...checks) {
        //проверяем не был ли ранее добавлен данный выстрел, 
        //если не был, то добавляем в checks
        for(const check of checks) {
            if(!this.checks.includes(check)) {
                this.checks.push(check)
            }
        }
        return this
    }

    //проверяем не был ли тут произведен выстрел в этой клетке
    isChecked(point) {
        const flag = this.checks.find(check => check.x === point.x && check.y === point.y)
        if (flag) {
            return true
        } 
        return false
    }
    
    //Подсчет мертвых клеток
    countDeadCells() {
        let counterDeadCells, countProp
        counterDeadCells = countProp = 0
        for (let property of this.kills){
            for (let val of (Object.values(property)))
            {
                if (countProp % 4 == 3)
                    counterDeadCells += val
                countProp++
            }

        }
        return counterDeadCells;
    }

    //Вывести все раненые(не убитые) клетки 
    remainInjuredCells(deadCells, countInjuredCells){
        let injuredShipPoints = []
        for(let injuredCheck of this.injuries){
            if (this.injuries.includes(injuredCheck)){
                if (countInjuredCells < deadCells){
                    countInjuredCells++
                }
                else {
                    injuredShipPoints.push(injuredCheck)
                }

            }
        } 
        return injuredShipPoints   
    }

    //Вывести координаты всех раненых клеток
    getCoordinatesInjuredShips(injuredShipPoints){
        let coordinatesInjuredShips = []
        for (let property of injuredShipPoints){
            for (let val of (Object.values(property)))
                coordinatesInjuredShips.push(val)
        }
        return coordinatesInjuredShips
    }

    //Получить точку по неизвестному направлению
    getPointByUnknownDirection(coordinatesInjuredShips){
        let isCheckedProp,isInjuredProp,isExetuted,point;
        do {
            //Получить случайное из 4 направлений
            let a = Math.floor(Math.random() * 4)
            isCheckedProp = isInjuredProp = isExetuted = false
            //Проверка по X
            if ((a === 0) && (coordinatesInjuredShips[0] > 0)) {
                //Получить точку
                const array = [coordinatesInjuredShips[0] - 1,coordinatesInjuredShips[1]]
                const [x, y] = array
                point = { x, y }
                //Проверить точку, если уже была ранее обстрелена или ранена
                isCheckedProp = this.isChecked(point)
                isInjuredProp = this.isCheckedInjury(point)
                isExetuted = true
            }
            //Проверка по X
            if ((a === 1) && (coordinatesInjuredShips[0] < 9)) {
                //Получить точку
                const array = [coordinatesInjuredShips[0] + 1,coordinatesInjuredShips[1]]
                const [x, y] = array
                point = { x, y }
                //Проверить точку, если уже была ранее обстрелена или ранена
                isCheckedProp = this.isChecked(point)
                isInjuredProp = this.isCheckedInjury(point)
                isExetuted = true
            }
            //Проверка по Y
            if ((a === 2) && (coordinatesInjuredShips[1] > 0)){
                //Получить точку
                const array = [coordinatesInjuredShips[0],coordinatesInjuredShips[1] - 1]
                const [x, y] = array
                point = { x, y }
                //Проверить точку, если уже была ранее обстрелена или ранена
                isCheckedProp = this.isChecked(point)
                isInjuredProp = this.isCheckedInjury(point)
                isExetuted = true
            }
            //Проверка по Y
            if ((a === 3) && (coordinatesInjuredShips[1] < 9)) {
                //Получить точку
                const array = [coordinatesInjuredShips[0],coordinatesInjuredShips[1] + 1]
                const [x, y] = array
                point = { x, y }
                //Проверить точку, если уже была ранее обстрелена или ранена
                isCheckedProp = this.isChecked(point)
                isInjuredProp = this.isCheckedInjury(point)
                isExetuted = true
            }
        //Повторить, если точка была обстрелена или ранена
        } while (isCheckedProp || isInjuredProp || !isExetuted);

        return point
    }

    //Получить точку по известному направлению(вертикаль или горизонталь)
    getPointByKnownDirection(coordinatesInjuredShips){
        let point, min, max, direction, lengthInjuredShips;
        min = MINIMUM;
        max = MAXIMUM;
        lengthInjuredShips = coordinatesInjuredShips.length;
        //Если 2 клетки расположены по горизонтали
        if (coordinatesInjuredShips[0] === coordinatesInjuredShips[lengthInjuredShips - 2]) {
            direction = coordinatesInjuredShips[0]
            //Найти минимальный и максимальный Y
            for(let i = 1; i <= lengthInjuredShips - 1 ; i += 2){
                if (coordinatesInjuredShips[i] > max) 
                    max = coordinatesInjuredShips[i]
                if (coordinatesInjuredShips[i] < min) 
                    min = coordinatesInjuredShips[i]
            }
        }
        //Если 2 клетки расположены по вертикали
        if (coordinatesInjuredShips[1] === coordinatesInjuredShips[lengthInjuredShips - 1]) {
            direction = coordinatesInjuredShips[1];
            for (let i = 0; i <= lengthInjuredShips - 2 ; i += 2) {
                //Найти минимальный и максимальный X
                if (coordinatesInjuredShips[i] > max)
                    max = coordinatesInjuredShips[i]
                if (coordinatesInjuredShips[i] < min) 
                    min = coordinatesInjuredShips[i]
            }
        }
        let isCheckedProp,isInjuredProp,isExetuted;
        do {
            //Получить случайное из 2 направлений
            let a = Math.floor(Math.random() * 2)
            isCheckedProp = isInjuredProp = isExetuted = false;
            if ((a === 0) && (min > 0)) {
                //Если одинаковая горизонталь
                if (coordinatesInjuredShips[0] === coordinatesInjuredShips[lengthInjuredShips - 2])
                {
                    const array = [direction , min - 1]
                    const [x, y] = array
                    point = { x, y }
                }
                //Если одинаковая вертикаль
                else if (coordinatesInjuredShips[1] === coordinatesInjuredShips[lengthInjuredShips - 1]){
                    const array = [ min - 1 , direction]
                    const [x, y] = array
                    point = { x, y }
                }
                //Проверить точку, если уже была ранее обстрелена или ранена
                isCheckedProp = this.isChecked(point)
                isInjuredProp = this.isCheckedInjury(point)
                isExetuted = true
            }
            if ((a === 1) && (max < 9)) {
                //Если одинаковая горизонталь
                if (coordinatesInjuredShips[0] === coordinatesInjuredShips[lengthInjuredShips - 2])
                {
                    const array = [direction , max + 1]
                    const [x, y] = array
                    point = { x, y} 
                }
                 //Если одинаковая вертикаль
                else if (coordinatesInjuredShips[1] === coordinatesInjuredShips[lengthInjuredShips - 1]) {
                    const array = [max + 1 , direction]
                    const [x, y] = array
                    point = { x, y }
                }
                //Проверить точку, если уже была ранее обстрелена или ранена
                isCheckedProp = this.isChecked(point)
                isInjuredProp = this.isCheckedInjury(point)
                isExetuted = true
            }
        //Повторить, если точка была обстрелена или ранена
        } while (isCheckedProp || isInjuredProp || !isExetuted);  

        return point
    }


    //добавление последнего хода
    addThelast(last) {
        this.last = last
        return this
    }

    getScore(x, y) {
        this.score = {
            x: x,
            y: y,
            count: this.kills.length
        }
    }

    //Отрисовка кораблей
    draw (context) {
        this.drawer.drawFields(context)

        if (!this.secret) {
            for(const ship of this.ships) {
               this.drawer.drawShip(context, ship)
            }
        }
        
        for (const check of this.checks) {
            this.drawer.drawCheck(context, check)
        }

        for (const injury of this.injuries) {
            this.drawer.drawInjury(context, injury)
        }

        for (const ship of this.kills) {
            this.drawer.drawCheckAroundKills(context, ship, this.checks)
        }

        this.drawer.drawLast(context, this.last)

        this.drawer.drawScore(context, this.score)

        return this
    }

    //положение мышки, если в области поля морского боя
    isPointUnder (point) {
        if (
            point.x < this.offsetX + FIELD_SIZE || 
            point.x > this.offsetX + 11 * FIELD_SIZE ||
            point.y < this.offsetY + FIELD_SIZE || 
            point.y > this.offsetY + 11 * FIELD_SIZE
        ) {
            return false
        }
        return true     
    }


    //получить координаты клетки
    getCoordinats (point) {
        //если мышка не над полем, то возвращаем false
        if (!this.isPointUnder(point)) {
            return false
        }

        //иначе - её координаты
        const x = parseInt((point.x - this.offsetX - FIELD_SIZE) / FIELD_SIZE)
        const y = parseInt((point.y - this.offsetY - FIELD_SIZE) / FIELD_SIZE)

        //причем между 0 и 9
        return {
            x: Math.max(0, Math.min(9, x)),
            y: Math.max(0, Math.min(9, y)),
        }
    }

    //проверяем можно ли разместить корабль на поле
    canStay (ship) {

        //проверяем не выходит ли корабль за область поля
        if (ship.direct === 0 && ship.x + ship.size > 10) {
            return false
        }
        if (ship.direct === 1 && ship.y + ship.size > 10) {
            return false
        }

        //пока ничего нет на поле - корабль можно поставить в любое место
        const map = []
        for (let i = 0; i < 10; i++) {
            map[i] = []
            for (let j = 0; j < 10; j++) {
                map[i][j] = true
            }
        }

        //если на поле стоит корабль, то все его клетки и все клетки вокруг него становятся false
        for (const ship of this.ships) {
            if (ship.direct === 0) {
                for (let x = ship.x - 1; x < ship.x + ship.size + 1; x++) {
                    for (let y = ship.y - 1; y < ship.y + 2; y++) {
                        if (map[y] && map[y][x]) {
                            map[y][x] = false
                        }
                    }
                }
            }
            else {
                for (let x = ship.x - 1; x < ship.x + 2; x++) {
                    for (let y = ship.y - 1; y < ship.y + ship.size + 1 ; y++) {
                        if (map[y] && map[y][x]) {
                            map[y][x] = false
                        }
                    }
                }
            }
        }

        if (ship.direct === 0) {
            for (let i = 0; i < ship.size; i++) {
                if(!map[ship.y][ship.x + i]) {
                    return false
                }
            }
        }
        else {
            for (let i = 0; i < ship.size; i++) {
                if(!map[ship.y + i][ship.x]) {
                    return false
                }
            }
        }
        return true
    }

    //расстановка кораблей случайным образом
    randoming() {
        this.ships = []

        for (let size = 4; size > 0; size--) {
            for (let n = 0; n < 5 - size; n++) {
                let flag = false

                while (!flag) {
                    const ship = {
                        x: Math.floor(Math.random() * 10),
                        y: Math.floor(Math.random() * 10),
                        direct: Math.random() > Math.random() ? 0 : 1,
                        size
                    }
    
                    if(this.canStay(ship)) {
                        this.addShips(ship)
                        flag = true
                    } 
                }
                
            }
        }
        return true
    }

    clear() {
        this.ships = [];
        return this.ships;
    }

    getShipsMap () {
        const map = []
        for (let i = 0; i < 10; i++) {
            map[i] = []
            for (let j = 0; j < 10; j++) {
                map[i][j] = false
            }
        }

        for (const ship of this.ships) {
            if (ship.direct === 0) {
                for (let x = ship.x; x < ship.x + ship.size; x++) {
                    if (map[ship.y] && !map[ship.y][x]) {
                        map[ship.y][x] = true
                    }
                }
            }
            else {
                for (let y = ship.y; y < ship.y + ship.size; y++) {
                    if (map[y] && !map[y][ship.x]) {
                        map[y][ship.x] = true
                    }
                }
            }
        }

        return map
    }

    
    isCheckedInjury(point) {
        const flag = this.injuries.find(injury => injury.x === point.x && injury.y === point.y)
        if (flag) {
            return true
        } 
        return false
    }

    update () {
        //убрать возможность добавления в массив повторных точек
        this.checks = this.checks
            .map(check => JSON.stringify(check))
            //фильтруем все повторяющиеся элементы(элем, инд, лист)
            //если послед индекс элемента вернёт несовпад с инд элемент - удаляем
            .filter((e, i, l) => l.lastIndexOf(e) === i)
            .map(check => JSON.parse(check))

        const map = this.getShipsMap()
        
        for (const check of this.checks) {
            if (map[check.y][check.x]) {
                if (!this.isCheckedInjury(check)) {
                    this.injuries.push(check)
                }

                const index = this.checks.indexOf(check)
                this.checks.splice(index, 1)
            }
        }
    }

    //возвращаем true, если в ячейке стоит корабль
    isShipUnderPoint (point) {
        const map = this.getShipsMap()

        return map[point.y][point.x]
    }

    //проверяем был ли выстрел по клетке
    getUnknownFields () {
        const unknownFields = []

        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                let flag = true
                for (const check of this.checks) {
                    if (check.x === x && check.y === y) {
                        flag = false
                        break
                    }
                }

                if (flag) {
                    for (const injury of this.injuries) {
                        if (injury.x === x && injury.y === y) {
                            flag = false
                            break
                        }
                    }
                }

                if (flag) {
                    unknownFields.push({ x, y })
                }
            }
        }
        return unknownFields
    }


    addKills() {
        for (const ship of this.ships) {
            if (ship.direct === 0) {
                const flag = ship.size
                let i = 0
                for (let x = ship.x; x < ship.x + ship.size; x++) {
                    for (const injury of this.injuries) {
                        if (injury.x === x && injury.y === ship.y) {
                            i++
                            
                        }
                    }
                }
                if (flag === i) {
                    if (!this.kills.includes(ship)) {
                        this.kills.push(ship)
                    }
                }
            }
            else {
                const flag = ship.size
                let i = 0
                for (let y = ship.y; y < ship.y + ship.size; y++) {
                    for (const injury of this.injuries) {
                        if (injury.y === y && injury.x === ship.x) {
                            i++
                        }
                    }
                }
                if (flag === i) {
                    if (!this.kills.includes(ship)) {
                        this.kills.push(ship)
                    }         
                }
            }
        }
    }

    //проверяет убиты ли все корабли
    isEnd() {
        const map = this.getShipsMap()

        for (const injury of this.injuries) {
            map[injury.y][injury.x] = false
        }

        for (let status of map.flat()) {
            if (status) {
                return false
            }
        }

        return true
    }
}