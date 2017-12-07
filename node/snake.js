window.onload = function WindowLoad(event) {
	main();
}

var container,game;
var UP=0, DOWN=1, LEFT=2, RIGHT=3, SCALE=10; 
var pixelSize = 10;
var limitH = 78; 
var limitW = 66;

function main(){
	container = document.getElementById('container');
	game = new Game(container);
}

Game = function(container){
	this.container = container;
	this.snake = null;
	
	this.keyHandler = new KeyHandler(this);
	this.timer = new Timer(20);
	this.ticks =0;
	this.score = 0;
	this.time = 0;
	this.over = false;
	this.paused = false;
	this.cherry = new Cherry();
	this.speed = 0.5;
	
	this.run = function(){
		this.ticks++;
		this.snake.move(this);
		this.render();
	};
	
	this.render = function(){
		while (this.container.firstChild) {
			this.container.removeChild(this.container.firstChild);
		}
		
		this.snake && this.snake.draw();
		this.cherry && this.cherry.draw();
	};
	
	(function start(game){
		game.snake = new Snake(game.container);
		setInterval(game.run.bind(game),game.speed * 1000);
	})(this);
	
}

Snake = function(container){
	this.container = container;
	this.snakeParts = [];
	this.direction = DOWN;
	this.tailLength = 10;
	this.head = new Point(0,0);
	
	
	this.move = function(game){
		if (game && game.ticks % 2 == 0 && this.head!=null&&!game.over&&!game.paused) {
			
			this.snakeParts.push(new Point(this.head.x, this.head.y));
			// start
			if (this.direction == UP){
				if(this.head.y -1>=0&&this.noTailAt(this.head.x,this.head.y-1))
					this.head=new Point(this.head.x, this.head.y - 1);
				else over=true;
			}else if (this.direction == DOWN){
				if(this.head.y +1<67&&this.noTailAt(this.head.x,this.head.y+1))
					this.head=new Point(this.head.x, this.head.y + 1);
				else over=true;
			}else if (this.direction == LEFT){
				if(this.head.x -1>=0&&this.noTailAt(this.head.x-1,this.head.y))
					this.head=new Point(this.head.x - 1, this.head.y);
				else over=true;
			}else if (this.direction == RIGHT){
				if(this.head.x +1< 79&&this.noTailAt(this.head.x+1,this.head.y))
					this.head=new Point(this.head.x + 1, this.head.y);
				else over=true;
			}
			
			if(this.snakeParts.length > this.tailLength){
				this.snakeParts.shift();
			}
			if(game.cherry != null){
				if(this.head.equals(game.cherry)){
					game.score+=10;
					this.tailLength++;
					game.cherry.setLocation(random.nextInt(limitH), random.nextInt(limitW));
				}
			}
			// end
			
		}
	}
	
	this.noTailAt = function(x,y){
		var result = true;
		this.snakeParts.forEach(function(p){
			if(p.equals(new Point(x,y))){
				result = false;
				return false;
			}
		});
		return result;
	}
	
	this.draw = function(){
		for (var i = 0; i < this.snakeParts.length; i++) {
			var part = document.createElement('div');
			part.className = "snakeParts";
			part.style.left = (this.snakeParts[i].x * pixelSize) + 'px';
			part.style.top = (this.snakeParts[i].y * pixelSize) + 'px';
			
			this.container.appendChild(part);
		}
	}
	
	this.init = function(){
		this.snakeParts = [];
		this.tailLength=1;
		this.direction=DOWN;
		
		this.head= new Point(0,0);
	}
	this.init();
	
	/*
	 * not working - context of this.move were not snake but window
	(function init(snake){
		snake.snakeParts = [];
		snake.tailLength=1;
		snake.direction=DOWN;
		
		snake.head= new Point(0,0);
		console.log('init')
		console.log(snake);
		snake.move.call(snake);
	})(this);
	*/
	/*
	 
	 @Override
	public void actionPerformed(ActionEvent arg0) {
		renderPanel.repaint();
		ticks++;
		
		if (ticks % 2 == 0 && head!=null&&!over&&!paused) {
			time++;
			snakeParts.add(new Point(head.x, head.y));
			if (direction == UP)
				if(head.y -1>=0&&noTailAt(head.x,head.y-1))
				head=new Point(head.x, head.y - 1);
				else
					over=true;
			if (direction == DOWN)
				if(head.y +1<67&&noTailAt(head.x,head.y+1))
				head=new Point(head.x, head.y + 1);
				else
					over=true;
			if (direction == LEFT)
				if(head.x -1>=0&&noTailAt(head.x-1,head.y))
				head=new Point(head.x - 1, head.y);
				else
					over=true;
			if (direction == RIGHT)
				if(head.x +1< 79&&noTailAt(head.x+1,head.y))
				head=new Point(head.x + 1, head.y);
				else
					over=true;
			if(snakeParts.size()>tailLength)
				snakeParts.remove(0);
			if(cherry != null){
				if(head.equals(cherry)){
					score+=10;
					tailLength++;
					cherry.setLocation(random.nextInt(78), random.nextInt(66));
				}
				
			}
		}
	}
	 */
	
}

Cherry = function(container){
	this.x = null;
	this.y = null;
	this.cherry = null;
	
	this.create = function(){
		this.x = getRandomInt(0,limitW);
		this.y = getRandomInt(0,limitH);
		this.cherry= new Point(this.x, this.y);
	}
	
	// remove current Cherry and create new one
	this.setLocation = function(x,y){
		this.cherry= new Point(x, y);
	}
	
	this.draw = function(){
		
	}
	
	this.create();
	
//	this.cherry = document.createElement('div');
//	this.cherry.setAttribute("id", "cherry")
//	container.appendChild(this.cherry);
	
};

/*
Renderer = function(container,snake,options){
	console.log(snake.snakeParts);
	
	this.snake = document.createElement('div');
	this.cherry = document.createElement('div');
	this.timer = document.createElement('div');
	
	this.snake.setAttribute("id", "snake")
	this.cherry.setAttribute("id", "cherry")
	this.timer.setAttribute("id", "timer")
	
	container.appendChild(this.snake);
	container.appendChild(this.cherry);
	container.appendChild(this.timer);
}
*/
KeyHandler = function(snake){
	this.snake = snake;
	
	this.handler = function(e){
		console.log(e.key)
	};
	
	window.addEventListener('keydown',this.handler/*,true*/);
}

Point = function(x,y){
	this.x =x;
	this.y =y;
	
	this.equals = function(a,b){
		return a && b && a.x == b.x && a.y == b.y;
	}
}

Timer = function(speed){
	this.time = 0;
	this.speed= speed;
	
	this.start = function(){
		var inc = 50 * this.speed;
		
		setInterval(increment.bind(this,inc),inc);
		
		function increment(val){
			this.time += val;
		}
	}
	
	this.getTimer = function(){
		return this.time;
	}
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}