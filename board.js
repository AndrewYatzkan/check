class Board {
    constructor() {
        this.white = [];
        this.black = [];
        this.setup();
    }

    setup() {
        /*
        this.white.push(new King(4, 7, true));
        this.white.push(new Queen(3, 7, true));
        this.white.push(new Bishop(2, 7, true));
        this.white.push(new Bishop(5, 7, true));
        this.white.push(new Knight(1, 7, true));
        this.white.push(new Knight(6, 7, true));
        this.white.push(new Rook(0, 7, true));
        this.white.push(new Rook(7, 7, true));
        */
        this.white.push(new King(4, 5, true));
        this.white.push(new Queen(3, 6, true));
        this.white.push(new Bishop(2, 7, true));
        this.white.push(new Bishop(5, 6, true));
        this.white.push(new Bishop(1, 6, true));
        this.white.push(new Bishop(6, 7, true));
        this.white.push(new Rook(0, 7, true));
        this.white.push(new Rook(7, 6, true));
        // for (var i = 0; i < 8; i++) this.white.push(new Pawn(i, 6, true));
        this.black.push(new checkersPiece(7, 0));
        this.black.push(new checkersPiece(5, 0));
        this.black.push(new checkersPiece(3, 0));
        this.black.push(new checkersPiece(1, 0));
        this.black.push(new checkersPiece(6, 1));
        this.black.push(new checkersPiece(4, 1));
        this.black.push(new checkersPiece(2, 1));
        this.black.push(new checkersPiece(0, 1));
        this.black.push(new checkersPiece(7, 2));
        this.black.push(new checkersPiece(5, 2));
        this.black.push(new checkersPiece(3, 2));
        this.black.push(new checkersPiece(1, 2));
        this.black.push(new checkersPiece(6, 3));
        this.black.push(new checkersPiece(4, 3));
        this.black.push(new checkersPiece(2, 3));
        this.black.push(new checkersPiece(0, 3));
    }

    showPieces() {
        for (var i = 0; i < this.white.length; i++) {
            this.white[i].show();
        }
        for (var i = 0; i < this.black.length; i++) {
            this.black[i].show();
        }
    }

    show() {
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                if ((i + j) % 2 == 0)
                    ctx.fillStyle = "rgb(228, 228, 228)";
                else
                    ctx.fillStyle = "rgb(115, 134, 183)";
                ctx.fillRect(i * size, j * size, size, size);
            }
        }
    }

    getPiece(x, y) {
        for (var i = 0; i < this.white.length; i++) {
            if (x == this.white[i].x && y == this.white[i].y && !this.white[i].taken) return this.white[i];
        }
        for (var i = 0; i < this.black.length; i++) {
            if (x == this.black[i].x && y == this.black[i].y && !this.black[i].taken) return this.black[i];
        }
    }
}