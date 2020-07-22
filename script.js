const c = document.querySelector("canvas");
const ctx = c.getContext("2d");

var size = 800;

var current;

var offset;

var whiteMove = true;

c.width = size;
c.height = size;

size /= 8;

const board = new Board();
function draw() {
	board.show();
	board.showPieces();
	requestAnimationFrame(draw);
}
draw();

document.addEventListener("mousedown", e => {
	var x = Math.floor(e.clientX/size);
	var y = Math.floor(e.clientY/size);
	if (!current || !current.moving && current.white == whiteMove) {
		if (current = board.getPiece(x, y)) {
			document.addEventListener("mousemove", current.show);
			document.addEventListener("click", current.show);
			current.moving = true;
		}
	} else {
		x = Math.floor((current.lastpos.x-offset.x+size/2)/size);
		y = Math.floor((current.lastpos.y-offset.y+size/2)/size);
		if (current.white == whiteMove && current.canMove(x, y)) {
			if (current.constructor.name !== "checkersPiece") current.move(x, y);
			whiteMove = !whiteMove;
		}
		document.removeEventListener("mousemove", current.show);
		document.removeEventListener("click", current.show);
		current.lastpos = {x:null,y:null};
		offset = null;
		current.moving = false;
		current = null;
	}
});