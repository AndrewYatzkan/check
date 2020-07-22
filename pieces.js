/*
idea: chess pieces can only move to dark squares
(pieces that begin on light squares aren't in play)
*/
class Piece {
    constructor(x, y, white, img) {
        this.x = x;
        this.y = y;
        this.white = white;
        this.img = img;
        this.moving = false;
        this.lastpos = {
            x: this.x * size + size / 2,
            y: this.y * size + size / 2
        };
    }

    show(e) {
        if (this.taken) return;
        if (e) {
            current.lastpos = {
                x: e.clientX,
                y: e.clientY
            };
            if (!offset) offset = {
                x: current.lastpos.x - current.x * size,
                y: current.lastpos.y - current.y * size
            };
        }
        if (this.moving && this.lastpos.x && offset) {
            ctx.drawImage(this.img, this.lastpos.x - offset.x, this.lastpos.y - offset.y, size, size);
        } else {
            if (!this.img) return;
            ctx.drawImage(this.img, this.x * size, this.y * size, size, size);
        }
    }

    move(x, y, passive=false) {
        var attacking = board.getPiece(x, y);
        if (attacking && !passive) attacking.taken = true;
        // add && !canEscapeCheck which will need to check for check in every possible move
        // var blackOutOfPieces = false;
        // for (var i = 0; i < board.black.length; i++) {
        // 	let piece = board.black[i];
        // 	if (!piece.taken) break;
        // 	if (i === board.black.length - 1) blackOutOfPieces = true;
        // }
        // if (blackOutOfPieces || (attacking && attacking.constructor.name == "King") || (!whiteMove && !this.white && this.kingInCheck())) {
        // var winningSide = this.white ? "White" : "Black";
        // alert(winningSide + " wins!");
        // }
        this.x = x;
        this.y = y;
	if (this.constructor.name === "checkersPiece" && y === 7 && !this.isKing) {
		this.isKing = true;
		this.img.src = "assets/checkersKing.png";
	}
        return true;
    }

    validPath(x, y) {
        var pos = {
            x: x - this.x,
            y: y - this.y
        };
        var dir = {
            x: 0,
            y: 0
        };
        if (pos.x > 0) {
            dir.x = 1;
        } else if (pos.x < 0) {
            dir.x = -1;
        }
        if (pos.y > 0) {
            dir.y = 1;
        } else if (pos.y < 0) {
            dir.y = -1;
        }
        pos = {
            x: this.x,
            y: this.y
        };
        pos.x += dir.x;
        pos.y += dir.y;
        while (pos.x != x || pos.y != y) {
            if (board.getPiece(pos.x, pos.y)) {
                return false;
            }
            pos.x += dir.x;
            pos.y += dir.y;
        }
        return true;
    }

    kingInCheck() {
        var kingPos = {
            x: -1,
            y: -1
        };
        for (var i = 0; i < board.white.length; i++) {
            let piece = board.white[i];
            if (piece.constructor.name === "King") {
                kingPos = {
                    x: piece.x,
                    y: piece.y
                };
                break;
            }
        }
        for (var i = 0; i < board.black.length; i++) {
            let piece = board.black[i];
            if (piece.taken) continue;
            // in check
            if (piece.canAttack(kingPos.x, kingPos.y)) return true;
        }
        return false;
    }

    attackingAllies(x, y) {
        // Maybe disable? Only dark squares
        if ((x + y) % 2 === 0) return true;
        // Also check if in check
        if (this.white) {
		var attacking = board.getPiece(x, y);
		if (attacking) attacking.taken = true;
		var original = {x: this.x, y: this.y};
            this.move(x, y, true);
            if (this.kingInCheck()) {
                this.move(original.x, original.y);
		if (attacking) attacking.taken = false;
                return true;
            }
            this.move(original.x, original.y);
		if (attacking) attacking.taken = false;
        }
        // Also check if move is on board
        if (x > 7 || x < 0 || y > 7 || y < 0) return true;
	// King cannot touch side
	if (this.constructor.name === "King" && (x > 6 || x < 1 || y > 6 || y < 1)) return true;
        // Check if attacking allies
        var attacking = board.getPiece(x, y);
        if (attacking) {
            if (attacking.white == this.white) {
                return true;
            }
        }
        return false;
    }
}

class checkersPiece extends Piece {
    constructor(x, y, white = false, isKing = false) {
        super(x, y, white);
        this.img = new Image();
        this.img.src = "assets/checkers.png";
    }

    canAttack(x, y) {
        var pos = {
            x: this.x,
            y: this.y
        };
        return this.canMove(x + x - pos.x, y + y - pos.y, pos);
    }

    canMove(x, y, justChecking = false) {
        if (this.attackingAllies(x, y)) return false;
        if (board.getPiece(x, y)) return false;
        let cx = this.x - x;
        let cy = y - this.y;
        let dx = Math.abs(cx);
        let dy = cy;
        if (this.isKing) dy = Math.abs(dy);
        if (dx === 1 && dy === 1) {
            if (!justChecking) this.move(x, y);
            return true;
        }
        if (dx === 2 && dy === 2) {
            let piece = board.getPiece(x + cx / 2, y - cy / 2);
            if (piece && piece.white) {
                if (!justChecking) {
                    piece.taken = true;
                    this.move(x, y);
                    /*
                    automatically move in same direction if possible
                    if (this.canMove(x - cx, y + cy)) this.move(x - cx, y + cy);
                    */
                    if (this.canMove(x - 2, y + 2, {
                            x: x,
                            y: y
                        }) || this.canMove(x + 2, y + 2, {
                            x: x,
                            y: y
                        }) || (this.isKing && (this.canMove(x - 2, y - 2, {
                            x: x,
                            y: y
                        }) || this.canMove(x + 2, y - 2, {
                            x: x,
                            y: y
                        })))) {
                        // can double jump somewhere
                        // after this function is called, whiteMove = !whiteMove is called, so by calling it here, it will reverse itself and stays black's turn
                        whiteMove = !whiteMove;
                    }
                } else if (!this.canMove(x - cx, y + cy, justChecking) && !(justChecking.x === this.x && justChecking.y === this.y)) this.move(justChecking.x, justChecking.y);
                return true;
            }
        }
        return false;
    }
}

class King extends Piece {
    constructor(x, y, white) {
        super(x, y, white);
        this.img = new Image();
        this.img.src = "assets/" + this.white + "king.svg";
    }

    canMove(x, y) {
        if (this.attackingAllies(x, y)) return false;
        // if new location is only one away
        if ((Math.abs(x - this.x) == 1 || Math.abs(y - this.y) == 1) && (!board.getPiece(x, y) || board.getPiece(x, y).white != this.white) && this.validPath(x, y))
            return true
        return false;
    }
}

class Queen extends Piece {
    constructor(x, y, white) {
        super(x, y, white);
        this.img = new Image();
        this.img.src = "assets/" + this.white + "queen.svg";
    }

    canMove(x, y) {
        if (this.attackingAllies(x, y)) return false;
        if (!this.validPath(x, y)) return false;
        // straight line
        if ((x == this.x || y == this.y) && (!board.getPiece(x, y) || board.getPiece(x, y).white != this.white))
            return true
        // diagonal
        if (Math.abs(x - this.x) == Math.abs(y - this.y))
            return true;
        return false;
    }
}

class Rook extends Piece {
    constructor(x, y, white) {
        super(x, y, white);
        this.img = new Image();
        this.img.src = "assets/" + this.white + "rook.svg";
    }

    canMove(x, y) {
        if (this.attackingAllies(x, y)) return false;
        if ((x == this.x || y == this.y) && (!board.getPiece(x, y) || board.getPiece(x, y).white != this.white) && this.validPath(x, y))
            return true
        return false;
    }
}

class Bishop extends Piece {
    constructor(x, y, white) {
        super(x, y, white);
        this.img = new Image();
        this.img.src = "assets/" + this.white + "bishop.svg";
    }

    canMove(x, y) {
        if (this.attackingAllies(x, y)) return false;
        if (Math.abs(x - this.x) == Math.abs(y - this.y) && this.validPath(x, y))
            return true;
        return false;
    }
}

class Knight extends Piece {
    constructor(x, y, white) {
        super(x, y, white);
        this.img = new Image();
        this.img.src = "assets/" + this.white + "knight.svg";
    }

    canMove(x, y) {
        if (this.attackingAllies(x, y)) return false;
        if ((Math.abs(x - this.x) == 2 && Math.abs(y - this.y) == 1) || (Math.abs(x - this.x) == 1 && Math.abs(y - this.y) == 2))
            return true;
        return false;
    }
}

class Pawn extends Piece {
    constructor(x, y, white) {
        super(x, y, white);
        this.img = new Image();
        this.img.src = "assets/" + this.white + "pawn.svg";
    }

    canMove(x, y) {
        if (this.attackingAllies(x, y)) return false;
        if (x != this.x) {
            if ((this.white && y - this.y == -1) || (!this.white && y - this.y == 1) && Math.abs(x - this.x) == 1 && board.getPiece(x, y) && board.getPiece(x, y).white != this.white) {
                return true;
            }
            return false;
        }
        if (!this.validPath(x, y)) return false;
        if ((this.white && y - this.y == -1) || (!this.white && y - this.y == 1)) {
            if (board.getPiece(x, y))
                return false;
            return true;
        }
        // first move
        if ((this.white && this.y == 6 && y - this.y == -2) || (!this.white && this.y == 1 && y - this.y == 2))
            return true;
        return false;
    }
}