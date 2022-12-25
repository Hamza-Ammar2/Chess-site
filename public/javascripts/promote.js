class Promote {
    constructor(isblack) {
        this.isblack = isblack;
        this.height = canvas.height*0.9;
        this.width = 0.5*(canvas.width/2);
        this.x = canvas.width/2 - this.width/2;
        this.y = canvas.height/2 - this.height/2;

        this.pieceHeight = ((this.height/4));

        this.gapX = (this.width - this.pieceHeight)/2;
        this.knight = {
            image: new Image(this.pieceHeight, this.pieceHeight),
            x: this.x + this.gapX,
            y: this.y + this.pieceHeight*3,
            type: isblack ? "n" : "N"
        }
        this.knight.image.src = isblack ? "assets/n.png" : "assets/wN.png";

        this.bishop = {
            image: new Image(this.pieceHeight, this.pieceHeight),
            x: this.x + this.gapX,
            y: this.y + this.pieceHeight*2,
            type: isblack ? "b" : "B" 
        }

        this.bishop.image.src = isblack ? "assets/b.png" : "assets/wB.png";

        this.rook = {
            image: new Image(this.pieceHeight, this.pieceHeight),
            x: this.x + this.gapX,
            y: this.y + this.pieceHeight,
            type: isblack ? "r" : "R"
        }

        this.rook.image.src = isblack ? "assets/r.png" : "assets/wR.png";

        this.queen = {
            image: new Image(this.pieceHeight, this.pieceHeight),
            x: this.x + this.gapX,
            y: this.y, 
            type: isblack ? "q" : "Q"
        }

        this.queen.image.src = isblack ? "assets/q.png" : "assets/wQ.png";

        this.pieces = [];
        this.pieces.push(this.knight);
        this.pieces.push(this.queen);
        this.pieces.push(this.rook);
        this.pieces.push(this.bishop);
    }


    draw() {
        ctx.fillStyle = 'rgb(150, 150, 150, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = this.isblack ? "white" : "rgb(255, 255, 255, 0.8)";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = null;
        ctx.drawImage(this.queen.image, this.queen.x, this.queen.y, this.pieceHeight, this.pieceHeight);
        ctx.drawImage(this.rook.image, this.rook.x, this.rook.y, this.pieceHeight, this.pieceHeight);
        ctx.drawImage(this.bishop.image, this.bishop.x, this.bishop.y, this.pieceHeight, this.pieceHeight);
        ctx.drawImage(this.knight.image, this.knight.x, this.knight.y, this.pieceHeight, this.pieceHeight);
    }

    choose(pos, id, height, boxes, perspective) {
        let newPiece = null;
        this.pieces.forEach(piece => {
            if (pos.x > piece.x && pos.x < piece.x + this.pieceHeight &&
                pos.y > piece.y && pos.y < piece.y + this.pieceHeight) {
                    return newPiece = new Piece(piece.type, this.isblack, {x: Number(id[1]), y: Number(id[0])}, height, id, boxes, perspective);
                }
        });
        
        return newPiece;
    }
}