class Game {
    constructor() {
        this.stage = "preparation" //стадия подготовки
        this.playerOrder = true // Ход игрока/бота(второго игрока)

        //создание игрока
        this.player = new Topology({
            offsetX: 60,
            offsetY: 90
        })

        //создание бота(второго игрока)
        this.computer = new Topology({
            offsetX: 600,
            offsetY: 90,
            secret: true
        })

        this.secondPlayer = new Topology({
            offsetX: 600,
            offsetY: 90,
            secret: false
        })

        this.context = new Context()

        this.computer.randoming()
        //регистрирует вызов функции перед обновлением экрана
        requestAnimationFrame(x => this.tick(x))
    }

    tick(timestamp) {
        
        //автоматически обновлять canvas и заново рисовать drawGrid
        requestAnimationFrame(x => this.tick(x))
        clearCanvas()
        drawGrid()  
        
        //отрисовка поля, кораблей и выстрелов игрока и бота
        this.player.draw(context)
        this.computer.draw(context)

        //если идет стадия подготовки, то вызывается функция расстановки кораблей
        if (this.stage === "preparation") {
            const strategyPreparation = new StrategyPreparation({
                player: this.player, 
                computer: this.computer,
                stage: "preparation"
            })
            this.context.setStrategy(strategyPreparation)
            this.tickPreparation(timestamp)
            
        }

        //если идет стадия игры с ботом, то вызывается функция игры
        else if (this.stage === "play") {
            const strategyPlayPlayer = new StrategyPlayPlayer({
                playerOrder: this.playerOrder,
                stage: "play",
                topology: this.computer
            })
            const strategyPlayBot = new StrategyPlayBot({
                playerOrder: this.playerOrder,
                stage: "play",
                topology: this.player
            })

            //Логика игрока
            if (this.playerOrder) { 
                this.context.setStrategy(strategyPlayPlayer)
                this.tickPlayPlayer(timestamp)
            }
            //Логика бота
            else { 
                this.context.setStrategy(strategyPlayBot)
                this.tickPlayBot(timestamp)
            }
            //Если игрок уничтожил все корабли бота
            if (this.computer.isEnd()) {
                this.stage = "completionWin"
                const strategyCompletion = new StrategyCompletion({
                    stage: "completionWin"
                })
                this.context.setStrategy(strategyCompletion)
                this.context.executeStrategy()
            }
            //Если бот уничтожил все корабли игрока
            else if (this.player.isEnd()) {
                this.stage = 'completionLose'
                const strategyCompletion = new StrategyCompletion({
                    stage: "completionLose"
                })
                this.context.setStrategy(strategyCompletion)
                this.context.executeStrategy()
            }
        }
        //если идет стадия игры со 2-ым игроком, то вызывается функция игры друг с другом
        else if (this.stage === "playSecondPlayer") {
            this.computer.secret = false;
            this.computer.draw(context)
            const strategyPlayPlayer = new StrategyPlayPlayer({
                playerOrder: this.playerOrder,
                stage: "playSecondPlayer",
                topology: this.secondPlayer
            })
            const strategyPlaySecondPlayer = new StrategyPlaySecondPlayer({
                playerOrder: this.playerOrder,
                stage: "playSecondPlayer",
                topology: this.player
            })

            //Логика игрока
            if (this.playerOrder) { 
                this.context.setStrategy(strategyPlayPlayer)
                this.tickPlayPlayer(timestamp)
            }
            //Логика 2-ого игрока
            else { 
                this.context.setStrategy(strategyPlaySecondPlayer)
                this.tickPlayBot(timestamp)
            }
            //Если 1-ый игрок победил
            if (this.computer.isEnd()) {
                this.stage = "completionWin"
                const strategyCompletion = new StrategyCompletion({
                    stage: "completionWin"
                })
                this.context.setStrategy(strategyCompletion)
                this.context.executeStrategy()
            }
            //Если 2-ой игрок победил
            else if (this.player.isEnd()) {
                this.stage = 'completionLose'
                const strategyCompletion = new StrategyCompletion({
                    stage: "completionLose"
                })
                this.context.setStrategy(strategyCompletion)
                this.context.executeStrategy()
            }
        }


        //для отслеживания нажатия клавиши
        mouse.pleft = mouse.left
    }

    //стадия расстановки кораблей
    tickPreparation (timestamp) {
        this.context.executeStrategy({player: this.player, computer: this.computer,})
        this.player = this.context.strategy.player
        this.computer = this.context.strategy.computer
        this.stage = this.context.strategy.stage
    }

    //стадия игры(1-ый игрок)
    tickPlayPlayer (timestamp) {
        this.context.executeStrategy({playerOrder: this.playerOrder, topology: this.computer,})
        this.computer = this.context.strategy.topology
        this.playerOrder = this.context.strategy.playerOrder
        this.stage = this.context.strategy.stage
    }

    //стадия игры(бот/2-ой игрок)
    tickPlayBot (timestamp) {
        this.context.executeStrategy({playerOrder: this.playerOrder, topology: this.player,})
        this.player = this.context.strategy.topology
        this.playerOrder = this.context.strategy.playerOrder
        this.stage = this.context.strategy.stage
    }
}