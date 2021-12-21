class Strategy {
    constructor() {
        this.stage = "completion"
    }

    execute(param) { }
}

//Конкретная стратегия (1)
class StrategyPreparation extends Strategy {
    constructor(param) {
        super();
        this.player = param.player
        this.computer = param.computer
        this.stage = param.stage
    }

    execute(param) {
        this.player = param.player
        this.computer = param.computer

        //Правила
        drawRules()

        //Счёт
        this.computer.getScore(520, 250)
        this.player.getScore(480,250)

        //Кнопки
        var a = document.getElementById('buttonRandom');
        var b = document.getElementById('buttonClear');
        var c = document.getElementById('buttonStart');
        var d = document.getElementById('buttonSecondPlayer');

        //Метод случайной расстановки кораблей
        function funcRandom(event) {
            game.player.randoming();
            game.computer.randoming();
            //game.stage = "play" 
        }
        
        //Метод перехода с перестановки к началу игры
        function funcStartGame(event) {
            if ((game.player.ships.length === 10 ) && document.getElementById('buttonSecondPlayer').innerHTML == 'Play with AI')
               game.stage = "play" 
            if ((game.player.ships.length === 10 ) && document.getElementById('buttonSecondPlayer').innerHTML == 'Play with Second Player')
               game.stage = "playSecondPlayer"
        }  

        function funcClear(event) {
            game.player.clear();
        }

        function funcChangePlayer(event){
            document.getElementById('buttonSecondPlayer').innerHTML = 'Play with Second Player';
        }

        function funcChangePlayerAI(event){
            document.getElementById('buttonSecondPlayer').innerHTML = 'Play with AI';
        }
        
        //Привязываем методы к событиям
        a.addEventListener("mousedown", funcRandom);
        b.addEventListener("mousedown", funcClear);
        c.removeEventListener("mousedown", funcStartGame);

        if (document.getElementById('buttonSecondPlayer').innerHTML == 'Play with AI')
           d.addEventListener("mousedown", funcChangePlayer);

        if (document.getElementById('buttonSecondPlayer').innerHTML == 'Play with Second Player')
           d.addEventListener("mousedown", funcChangePlayerAI);

        if (this.player.ships.length === 10) 
            c.addEventListener("mousedown", funcStartGame);
            
        //если мышь не над полем - выход
        if (!this.player.isPointUnder(mouse)) {
            return
        }

        //массив размеров кораблей
        const shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]
        //текущий размер корабля
        const shipSize = shipSizes[this.player.ships.length]
        // получаем координаты клетки
        const coordinats = this.player.getCoordinats(mouse)

        const ship = {
            x: coordinats.x,
            y: coordinats.y,
            direct: mouse.s ? 0 : 1,
            size: shipSize
        }

        //если корабль вылезает за поле выход
        if (!this.player.canStay(ship)) {
            return
        }

        this.player.drawer.drawShip(context, ship)

        //добавление корабля, если в текущей итерации прожата левая кнопка мыши
        if (mouse.left && !mouse.pleft) {
            this.player.addShips(ship)
        }
    }
}

//Конкретная стратегия (2)
class StrategyPlay extends Strategy {
    constructor(param) {
        super();
        this.playerOrder = param.playerOrder
        this.stage = param.stage
        this.topology = param.topology
    }

    execute(param) {
        this.opening(param)
        const point = this.getPoint()
        this.addPoint(point)
    }

    opening(param) {
        this.playerOrder = param.playerOrder
        this.topology = param.topology

        //Скрыть все кнопки 
        var a = document.getElementById('buttonRandom');
        var b = document.getElementById('buttonClear');
        var c = document.getElementById('buttonStart');
        var d = document.getElementById('buttonSecondPlayer');

        a.style.visibility = "hidden"; 
        b.style.visibility = "hidden"; 
        c.style.visibility = "hidden";
        d.style.visibility = "hidden";  
    }

    getPoint() {
        //получаем координаты клетки
        const point = this.topology.getCoordinats(mouse)
        return point
    }

    addPoint(point) {}
}

class StrategyPlayPlayer extends StrategyPlay {
    constructor(param) {
        super(param);
        this.playerOrder = param.playerOrder
        this.stage = param.stage
        this.topology = param.topology
    }

    addPoint() {
        //если мышь над полем бота
        if (!this.topology.isPointUnder(mouse)) {
            return
        }
        //получам координаты клетки
        const point = this.topology.getCoordinats(mouse)

        //добавить выстрел, если нажали левую кнопку мыши
        if (mouse.left && !mouse.pleft) {
            //нельзя стрелять в одну и ту же клетку
            if (!this.topology.isChecked(point)) {

                this.topology.addChecks(point)
                //добавляем последний ход
                this.topology.addThelast(point)

                //логика добавления точки
                this.topology.update()

                this.topology.addKills()

                this.topology.getScore(520, 250)
        
                //проверяем был ли выстрел в корабль или нет
                if (!this.topology.isShipUnderPoint(point)) {
                    //передаём ход
                    this.playerOrder = false
                }
            }
        }
    }

}

class StrategyPlaySecondPlayer extends StrategyPlay {
    constructor(param) {
        super(param);
        this.playerOrder = param.playerOrder
        this.stage = param.stage
        this.topology = param.topology
    }

    addPoint() {
        //если мышь над полем бота
        if (!this.topology.isPointUnder(mouse)) {
            return
        }
        //получам координаты клетки
        const point = this.topology.getCoordinats(mouse)

        //добавить выстрел, если нажали левую кнопку мыши
        if (mouse.left && !mouse.pleft) {
            //нельзя стрелять в одну и ту же клетку
            if (!this.topology.isChecked(point)) {

                this.topology.addChecks(point)
                //добавляем последний ход
                this.topology.addThelast(point)

                //логика добавления точки
                this.topology.update()

                this.topology.addKills()

                this.topology.getScore(480,250)
        
                //проверяем был ли выстрел в корабль или нет
                if (!this.topology.isShipUnderPoint(point)) {
                    //передаём ход
                    this.playerOrder = true
                }
            }
        }
    }

}

//Случайный выстрел по игроку
function getRandomFrom (array) {
    const index = Math.floor(Math.random() * array.length)
    return array[index]
}


class StrategyPlayBot extends StrategyPlay {
    constructor(param) {
        super(param);
        this.playerOrder = param.playerOrder
        this.stage = param.stage
        this.topology = param.topology
    }

    getPoint() {
        let deadCells = 0
        let countInjuredCells = 0
        let injuredShipPoints = []
        let coordinatesInjuredShips = []
        //Подсчитать количество мертвых клеток
        deadCells = this.topology.countDeadCells()
        //Подсчитать количество раненых клеток(не мертвых)
        injuredShipPoints = this.topology.remainInjuredCells(deadCells, countInjuredCells)

        let point;
        //Если нет раненых клеток, то получаем рандомную точку среди доступным непроверенных
        if (injuredShipPoints.length === 0)
            point = getRandomFrom(this.topology.getUnknownFields());
        else {
            //Вывести координаты всех раненых клеток
            coordinatesInjuredShips = this.topology.getCoordinatesInjuredShips(injuredShipPoints)
            if (coordinatesInjuredShips.length === 2)
                point = this.topology.getPointByUnknownDirection(coordinatesInjuredShips)
            else if (coordinatesInjuredShips.length >= 4)
                point = this.topology.getPointByKnownDirection(coordinatesInjuredShips)
        }      
        //console.log(injuredShipPoints);
        return point;

    }
    

    addPoint(point) {
        this.topology.addChecks(point)
        //добавляем последний ход
        this.topology.addThelast(point)

        //логика добавления точки
        this.topology.update()

        this.topology.addKills()

        this.topology.getScore(480,250)


        //проверяем был ли выстрел в корабль или нет
        if (!this.topology.isShipUnderPoint(point)) {
            //передаём ход
            this.playerOrder = true
        }
    }
}

//Конкретная стратегия (3)
class StrategyCompletion extends Strategy {
    constructor(param) {
        super();
        this.stage = param.stage
    }

    execute(param) {
        if (this.stage === 'completionWin') {
            setTimeout("alert('Вы выиграли! Начать заново?')", 500)
            setTimeout("window.location.reload()", 1000)
        }
        else if (this.stage === 'completionLose') {
            setTimeout("alert('Вы проиграли! Начать заново?')", 500)
            setTimeout("window.location.reload()", 1000)
        }
    }
}

class Context {
    constructor() {
        this.strategy = new Strategy()
    }

    setStrategy(strategy) {
        this.strategy = strategy
    }

    executeStrategy(param) {
        this.strategy.execute(param)
    }
}

