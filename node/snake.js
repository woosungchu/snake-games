window.onload = function WindowLoad(event) {
	main();
}

var container,snake,renderer;
var UP=0, DOWN=1, LEFT=2, RIGHT=3, SCALE=10; 

function main(){
	container = document.getElementById('container');
	snake = new Snake(container);
	renderer = new Renderer(container,snake);
}

Snake = function(container){
//	this.snake = null,
	this.keyHandler = new KeyHandler(this);
	this.timer = new Timer(20),
	this.snakeParts = [],
	this.ticks =0,
	this.direction = DOWN,
	this.score,
	this.tailLength = 10,
	this.time = 0,
	this.over = false,
	this.paused = false;
	
	this.head = new Point();
	this.cherry = new Point();
	
	this.init = function(container){
		container.style.width = '800px';
		container.style.height = '700px';
		container.style.margin = '0 auto';
		
		this.over=false;
		this.score=0;
		this.tailLength=1;
		this.ticks=0;
		this.time=0;
		this.direction=DOWN;
		
		this.startGame();
	}
	
	this.startGame = function(){
		
		head= new Point(0,-1);
		x = getRandomInt(0,78);
		y = getRandomInt(0,66);
		snakeParts = [];
		cherry= new Point(x, y);
		
		for (var i = 0; i < this.tailLength; i++) {
			snakeParts.push(new Point(head.x,head.y));
		}
		this.timer.start();
	}

	
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
	
	this.init(container);
}

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