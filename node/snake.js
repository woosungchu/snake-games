window.onload = function WindowLoad(event) {
	main();
}

var UP=0, DOWN=1, LEFT=2, RIGHT=3, SCALE=10; 

function main(){
	var container = document.getElementById('container');
	snake = new Snake(container);
}

Snake = function(container){
	this.snake = null,
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
	
	/*
    public static Snake snake; 
	public JFrame jframe;
	public RenderPanel renderPanel;
	public Timer timer=new Timer(20,this);
	public ArrayList<Point> snakeParts=new ArrayList<Point>();
	public static int UP=0, DOWN=1, LEFT=2, RIGHT=3, SCALE=10;
	public int ticks=0, direction=DOWN, score, tailLength=10,time=0;
	public Point head, cherry;
	public Random random;
	public boolean over=false, paused ;
	public Dimension dim;
	 */
	
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

	
	this.init(container);
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