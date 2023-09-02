function getCorners(id, arr) {
    let corners = [];
    let directions = ['u', 'd', 'r', 'l', 'ur', 'ul', 'dr', 'dl'];

    directions.forEach(d => {
        let mot = motion(1, d, id);
        if (mot !== null) {
            corners.push(String(mot[0] + 1) + String(mot[1] + 1));
        }
    });
    
    for (let move of arr) {
        if (corners.indexOf(move) !== -1) return true;
    }
    return false;
}

const opponent = new Brain(false);

class Board {
    constructor(perspective) {
        this.held_piece_index = null;
        this.turn = true;
        this.promoting = false;
        this.perspective = perspective;
        this.promote = {
            oldPieceIndex: null,
            show: null
        };

        this.position = [
            ["r", "n", "b", "q", "k", "b", "n", "r"],
            ["p", "p", "p", "p", "p", "p", "p", "p"],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            ["P", "P", "P", "P", "P", "P", "P", "P"],
            ["R", "N", "B", "Q", "K", "B", "N", "R"] 
        ]

        this.board = [
            ["11", "12", "13", "14", "15", "16", "17", "18"],
            ["21", "22", "23", "24", "25", "26", "27", "28"],
            ["31", "32", "33", "34", "35", "36", "37", "38"],
            ["41", "42", "43", "44", "45", "46", "47", "48"],
            ["51", "52", "53", "54", "55", "56", "57", "58"],
            ["61", "62", "63", "64", "65", "66", "67", "68"],
            ["71", "72", "73", "74", "75", "76", "77", "78"],
            ["81", "82", "83", "84", "85", "86", "87", "88"]
        ];

        this.boxes = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];

        this.boxArea = canvas.height/8;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let isblack = true;
                if ( (i+j) % 2 > 0) {isblack = false;}
                this.boxes[i][j] = new Box(this.boxArea, {x: j, y: i}, this.board[i][j], isblack);
            }
        }

        this.pieces = [
            new Piece("K", false, {y: 8, x: 5}, this.boxArea, "85", this.perspective),
            new Piece("k", true, {y: 1, x: 5}, this.boxArea, "15", this.perspective),
            new Piece("r", true, {y: 1, x: 1}, this.boxArea, "11", this.perspective),
            new Piece("n", true, {y: 1, x: 2}, this.boxArea, "12", this.perspective),
            new Piece("b", true, {y: 1, x: 3}, this.boxArea, "13", this.perspective),
            new Piece("q", true, {y: 1, x: 4}, this.boxArea, "14", this.perspective),
            new Piece("b", true, {y: 1, x: 6}, this.boxArea, "16", this.perspective),
            new Piece("n", true, {y: 1, x: 7}, this.boxArea, "17", this.perspective),
            new Piece("r", true, {y: 1, x: 8}, this.boxArea, "18", this.perspective),
            new Piece("p", true, {y: 2, x: 1}, this.boxArea, "21", this.perspective),
            new Piece("p", true, {y: 2, x: 2}, this.boxArea, "22", this.perspective),
            new Piece("p", true, {y: 2, x: 3}, this.boxArea, "23", this.perspective),
            new Piece("p", true, {y: 2, x: 4}, this.boxArea, "24", this.perspective),
            new Piece("p", true, {y: 2, x: 5}, this.boxArea, "25", this.perspective),
            new Piece("p", true, {y: 2, x: 6}, this.boxArea, "26", this.perspective),
            new Piece("p", true, {y: 2, x: 7}, this.boxArea, "27", this.perspective),
            new Piece("p", true, {y: 2, x: 8}, this.boxArea, "28", this.perspective),


            new Piece("R", false, {y: 8, x: 1}, this.boxArea, "81", this.perspective),
            new Piece("N", false, {y: 8, x: 2}, this.boxArea, "82", this.perspective),
            new Piece("B", false, {y: 8, x: 3}, this.boxArea, "83", this.perspective),
            new Piece("Q", false, {y: 8, x: 4}, this.boxArea, "84", this.perspective),
            new Piece("B", false, {y: 8, x: 6}, this.boxArea, "86", this.perspective),
            new Piece("N", false, {y: 8, x: 7}, this.boxArea, "87", this.perspective),
            new Piece("R", false, {y: 8, x: 8}, this.boxArea, "88", this.perspective),
            new Piece("P", false, {y: 7, x: 1}, this.boxArea, "71", this.perspective),
            new Piece("P", false, {y: 7, x: 2}, this.boxArea, "72", this.perspective),
            new Piece("P", false, {y: 7, x: 3}, this.boxArea, "73", this.perspective),
            new Piece("P", false, {y: 7, x: 4}, this.boxArea, "74", this.perspective),
            new Piece("P", false, {y: 7, x: 5}, this.boxArea, "75", this.perspective),
            new Piece("P", false, {y: 7, x: 6}, this.boxArea, "76", this.perspective),
            new Piece("P", false, {y: 7, x: 7}, this.boxArea, "77", this.perspective),
            new Piece("P", false, {y: 7, x: 8}, this.boxArea, "78", this.perspective),  
        ];

        this.pieces.forEach(piece => {
            let y = Number(piece.id[0]) - 1;
            let x = Number(piece.id[1]) - 1;

            this.boxes[y][x].piece = piece.type;
            piece.update(piece.id);
        });

        //this.updatePieces();
        this.firstUpdate()
        this.enpass = null;
        this.blackCastleR = true;
        this.blackCastleL = true;
        this.whiteCastleR = true;
        this.whiteCastleL = true;
    }
    
    draw() {
        this.boxes.forEach(row => {
            row.forEach(box => {
                box.draw();
            });
        });

        this.pieces.forEach(piece => {
            piece.draw();
        });

        if (this.promoting) this.promote.show.draw();

        if (this.held_piece_index === null) return;
        this.pieces[this.held_piece_index].draw();
    }

    getIFI(id) {
        let index;
        this.pieces.forEach((piece, i) => {
            if (piece.id === id) return index = i;
        });
        return index;
    }


    doPromote(pos) {
        let id = this.pieces[this.promote.oldPieceIndex].id;
        if (this.perspective) id = String(9 - Number(id[0])) + String(9 - Number(id[1]));
        let newPiece = this.promote.show.choose(pos, id, this.boxArea, this.boxes);

        if (newPiece === null) return;
        this.pieces.splice(this.promote.oldPieceIndex, 1, newPiece);
        this.promoting = false;
        this.promote.oldPieceIndex = null;
        this.promote.show = null;
        this.boxes[Number(id[0]) - 1][Number(id[1]) - 1].piece = newPiece.type;
    }

    
    firstUpdate() {
        this.pieces.forEach(piece => {
            let kingID = piece.isblack ? this.pieces[1].id : this.pieces[0].id;
            piece.updateMoves(this.position, kingID, false);
        }); 
    }


    updatePieces() {
        let isInCheckWhite = isInCheck(this.position, 'K', this.pieces[0].id);
        let isInCheckBlack = isInCheck(this.position, 'k', this.pieces[1].id);
        this.pieces.forEach(piece => {
            if (piece.dead !== true) {
                let kingID = piece.isblack ? this.pieces[1].id : this.pieces[0].id;
                let isInCheck = piece.isblack ? isInCheckBlack : isInCheckWhite;
                if (piece.type.toLowerCase() === 'p') {
                    piece.updateMoves(this.position, kingID, isInCheck, this.enpass);
                } else if (piece.type.toLowerCase() === 'k') {
                    let castle = {
                        r: piece.isblack ? this.blackCastleR : this.whiteCastleR,
                        l: piece.isblack ? this.blackCastleL : this.whiteCastleL
                    };
                    piece.updateMoves(this.position, kingID, isInCheck, this.enpass, castle)
                } else piece.updateMoves(this.position, kingID, isInCheck, this.enpass, null);
            }
        });
    }

    updatePos(oldPos, newPos) {
        let y = Number(oldPos[0]) - 1;
        let x = Number(oldPos[1]) - 1;
        let Y = Number(newPos[0]) - 1;
        let X = Number(newPos[1]) - 1;

        let type = this.position[y][x];
        this.position[y][x] = 0;

        this.position[Y][X] = type;        
    }

    castle(piece, newPos) {
        if (piece.castle.r !== newPos && piece.castle.l !== newPos) return;
        
        if (newPos === piece.castle.r) {
            this.pieces[this.getIFI(newPos[0] + "8")].update(newPos[0] + "6");
            this.updatePos(newPos[0] + "8", newPos[0] + "6")
        } else {
            this.pieces[this.getIFI(newPos[0] + "1")].update(newPos[0] + "4");
            this.updatePos(newPos[0] + "1", newPos[0] + "4");
        }
    }

    checkPieces(pos) {
        if (this.promoting) return;
        let piecefound = false
        this.pieces.forEach(piece => {
            if (piece.isTarget(pos) /*&& !piece.isblack === this.turn*/) {
                piecefound = true;
                this.held_piece_index = this.pieces.indexOf(piece);
                return;
            }
        });

        return piecefound;
    }

    checkBoxes(pos) {
        let dropped = false;
        this.boxes.forEach(row => {
            row.forEach(bxx => {
                if (bxx.isTarget(pos)) {
                    let by = 8 - Number(bxx.id[0]);
                    let bx = 8 - Number(bxx.id[1]);

                    let box = this.perspective === true ? this.boxes[by][bx] : bxx;
                    if (this.pieces[this.held_piece_index].isLegal(box.id) === false) return;
                    if (this.held_piece_index === 1 | this.held_piece_index === 0) {
                        this.castle(this.pieces[this.held_piece_index], box.id);
                    }
                    this.enpass = null;

                    if (box.id === this.pieces[this.held_piece_index].enpass) {
                        let eY = this.pieces[this.held_piece_index].isblack ? '3' : '6';
                        this.enpass = eY + box.id[1];
                    }
                    let id = this.pieces[this.held_piece_index].id
                    let y = Number(id[0]) - 1;
                    let x = Number(id[1]) - 1;

                    //this.boxes[y][x].piece = null;
                    if (this.position[Number(box.id[0]) - 1][Number(box.id[1]) - 1] !== 0) this.pieces[this.getIFI(box.id)].die();
                    if (this.pieces[this.held_piece_index].type.toLowerCase() === 'p' &&
                        Object.keys(this.pieces[this.held_piece_index].captures).indexOf(box.id) !== -1 &&
                        this.position[Number(box.id[0]) - 1][Number(box.id[1]) - 1] === 0) {
                            console.log("huh")
                            this.pieces[this.getIFI(id[0] + box.id[1])].die();
                            let empf = this.position[Number(id[0]) - 1][Number(box.id[1]) - 1];
                            this.position[Number(id[0]) - 1][Number(box.id[1]) - 1] = empf.slice(1);
                        }

                    //box.piece = this.pieces[this.held_piece_index].type;
                    let piece = this.pieces[this.held_piece_index];
                    if (piece.type.toLowerCase() === 'r') {
                        if (piece.isblack) {
                            if (piece.id[1] === "1") this.blackCastleL = false;
                            if (piece.id[1] === "8") this.blackCastleR = false;
                        } else {
                            if (piece.id[1] === "1") this.whiteCastleL = false;
                            if (piece.id[1] === "8") this.whiteCastleR = false;
                        }
                    } else if (piece.type.toLowerCase() === 'k') {
                        if (piece.isblack) {
                            this.blackCastleL = false;
                            this.blackCastleR = false;
                        } else {
                            this.whiteCastleL = false;
                            this.whiteCastleR = false;
                        }
                    }

                    this.updatePos(this.pieces[this.held_piece_index].id, box.id);
                    
                    this.pieces[this.held_piece_index].update(box.id);
                    this.updatePieces(); 

                    this.held_piece_index = null;
                    dropped = true;
                    //opponent.makeMove(opponent.board2Pos(this.position), isblack, this.enpass, castle);

                    this.turn = !this.turn;
                    return;
                }
            });
        });

        if (!dropped) {
            this.pieces[this.held_piece_index].update(this.pieces[this.held_piece_index].id);
            this.held_piece_index = null;
        }
        return dropped
    }

    getCastleStatus() {
        //console.log(this.blackCastleL)
        //console.log(this.blackCastleR)
        //console.log(this.whiteCastleL)
        //console.log(this.whiteCastleR)
        let castle = {white: {}, black: {}};
        castle.black.l = this.blackCastleL;
        castle.black.r = this.blackCastleR;
        castle.white.l = this.whiteCastleL;
        castle.white.r = this.whiteCastleR;

        //console.log(castle)
        return castle;
    }

    applyPosition(pos) {
        this.position = opponent.pos2Board(pos);
        let keys = Object.keys(pos);
        this.pieces.forEach(piece => {
            piece.die();
            for (let key of keys) {
                if (pos[key] === piece.type) {
                    piece.dead = false;
                    piece.update(key);
                    keys.splice(keys.indexOf(key), 1);
                    break;
                }
            }
        });

        this.updatePieces();
    }


    switch() {
        this.perspective = !this.perspective;
        this.pieces.forEach(piece => piece.switch());
        return;
    }
}

const game = new Board(false);
/*
game.applyPosition({
    '14': 'R',
    '24': 'R',
    '34': 'K',
    '54': 'k'
});
*/

let animationID;

function animate() {
    animationID = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.draw();
}

animate();


canvas.addEventListener('mousedown', e => {
    if (game.promoting) return;

    const target = e.target;

    // Get the bounding rectangle of target
    const rect = target.getBoundingClientRect();

    // Mouse position
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    game.checkPieces({x, y});
});


canvas.addEventListener('mousemove', e => {
    const target = e.target;

    // Get the bounding rectangle of target
    const rect = target.getBoundingClientRect();

    // Mouse position
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    if (game.held_piece_index === null) return;
    game.pieces[game.held_piece_index].move({x, y});
});
counter = 0

canvas.addEventListener('mouseup', e => {
    if (game.held_piece_index === null) return;
    const target = e.target;

    // Get the bounding rectangle of target
    const rect = target.getBoundingClientRect();

    // Mouse position
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    let dropped = game.checkBoxes({x, y});
    let castle = game.getCastleStatus();
    if (dropped && counter !== 0) {
        
        let move = opponent.makeMove(opponent.board2Pos(game.position), true, game.enpass, castle)

        if (!move) return console.log("fuck")
        let ids = move.move.split(",");
        let newID = ids[1].length > 2 ? ids[1].slice(1) : ids[1];
        let box = game.boxes[Number(newID[0]) - 1][Number(newID[1]) - 1];
        game.held_piece_index = game.getIFI(ids[0].slice(1));
        game.checkBoxes({x: box.x + 5, y: box.y + 5});
    }
    counter++
    
});


canvas.addEventListener('click', e => {
    if (game.promoting === false) return;
    const target = e.target;

    // Get the bounding rectangle of target
    const rect = target.getBoundingClientRect();

    // Mouse position
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    game.doPromote({x, y});
});