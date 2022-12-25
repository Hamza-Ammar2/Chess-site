//const canvas = document.querySelector("canvas");

class Board {
    constructor(perspective, islocal) {
        this.end = false;
        this.islocal = islocal ? islocal : false;
        this.held_piece_index = null;
        this.turn = false;
        this.promoting = false;
        this.positions = [];
        this.hold = null;
        this.branchIndex = null;
        this.branched = false;
        this.branch = [];
        this.currentPosIndex = null;
        this.perspective = perspective;
        this.promote = {
            oldPieceIndex: null,
            show: null
        };

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
            new Piece("K", false, {y: 8, x: 5}, this.boxArea, "85", this.boxes, this.perspective),
            new Piece("k", true, {y: 1, x: 5}, this.boxArea, "15", this.boxes, this.perspective),
            new Piece("r", true, {y: 1, x: 1}, this.boxArea, "11", this.boxes, this.perspective),
            new Piece("n", true, {y: 1, x: 2}, this.boxArea, "12", this.boxes, this.perspective),
            new Piece("b", true, {y: 1, x: 3}, this.boxArea, "13", this.boxes, this.perspective),
            new Piece("q", true, {y: 1, x: 4}, this.boxArea, "14", this.boxes, this.perspective),
            new Piece("b", true, {y: 1, x: 6}, this.boxArea, "16", this.boxes, this.perspective),
            new Piece("n", true, {y: 1, x: 7}, this.boxArea, "17", this.boxes, this.perspective),
            new Piece("r", true, {y: 1, x: 8}, this.boxArea, "18", this.boxes, this.perspective),
            new Piece("p", true, {y: 2, x: 1}, this.boxArea, "21", this.boxes, this.perspective),
            new Piece("p", true, {y: 2, x: 2}, this.boxArea, "22", this.boxes, this.perspective),
            new Piece("p", true, {y: 2, x: 3}, this.boxArea, "23", this.boxes, this.perspective),
            new Piece("p", true, {y: 2, x: 4}, this.boxArea, "24", this.boxes, this.perspective),
            new Piece("p", true, {y: 2, x: 5}, this.boxArea, "25", this.boxes, this.perspective),
            new Piece("p", true, {y: 2, x: 6}, this.boxArea, "26", this.boxes, this.perspective),
            new Piece("p", true, {y: 2, x: 7}, this.boxArea, "27", this.boxes, this.perspective),
            new Piece("p", true, {y: 2, x: 8}, this.boxArea, "28", this.boxes, this.perspective),


            new Piece("R", false, {y: 8, x: 1}, this.boxArea, "81", this.boxes, this.perspective),
            new Piece("N", false, {y: 8, x: 2}, this.boxArea, "82", this.boxes, this.perspective),
            new Piece("B", false, {y: 8, x: 3}, this.boxArea, "83", this.boxes, this.perspective),
            new Piece("Q", false, {y: 8, x: 4}, this.boxArea, "84", this.boxes, this.perspective),
            new Piece("B", false, {y: 8, x: 6}, this.boxArea, "86", this.boxes, this.perspective),
            new Piece("N", false, {y: 8, x: 7}, this.boxArea, "87", this.boxes, this.perspective),
            new Piece("R", false, {y: 8, x: 8}, this.boxArea, "88", this.boxes, this.perspective),
            new Piece("P", false, {y: 7, x: 1}, this.boxArea, "71", this.boxes, this.perspective),
            new Piece("P", false, {y: 7, x: 2}, this.boxArea, "72", this.boxes, this.perspective),
            new Piece("P", false, {y: 7, x: 3}, this.boxArea, "73", this.boxes, this.perspective),
            new Piece("P", false, {y: 7, x: 4}, this.boxArea, "74", this.boxes, this.perspective),
            new Piece("P", false, {y: 7, x: 5}, this.boxArea, "75", this.boxes, this.perspective),
            new Piece("P", false, {y: 7, x: 6}, this.boxArea, "76", this.boxes, this.perspective),
            new Piece("P", false, {y: 7, x: 7}, this.boxArea, "77", this.boxes, this.perspective),
            new Piece("P", false, {y: 7, x: 8}, this.boxArea, "78", this.boxes, this.perspective),  
        ];

        this.pieces.forEach(piece => {
            let values = piece.id.split("");
            let y = Number(values[0]) - 1;
            let x = Number(values[1]) - 1;

            this.boxes[y][x].piece = piece.type;
            piece.update(piece.id);
        });

        this.pieces.forEach(piece => piece.updateMoves(this.boxes));
        let pos = "";
        this.pieces.forEach(piece => {
            if (piece.dead === false) pos += piece.type + piece.id + ",";
        });
        this.positions.push({pos, turn: !this.turn, black: {
            castleR: true,
            castleL: true
        },
        white: {
            castleR: true,
            castleL: true
        }
        });

        this.boxes[0][4].canCastleR = true;
        this.boxes[0][4].canCastleL = true;
        this.boxes[7][4].canCastleR = true;
        this.boxes[7][4].canCastleL = true;
    }
    
    draw() {
        this.boxes.forEach(row => {
            row.forEach(box => {
                box.draw();
            });
        });

        this.pieces.forEach(piece => {
            if(piece.draw) piece.draw();
        });

        if (this.promoting) this.promote.show.draw();

        
        if (this.held_piece_index !== null) this.pieces[this.held_piece_index].draw();
        if (this.hold !== null) this.pieces[this.hold].draw();
    }

    addPos() {
        let pos = "";
        this.pieces.forEach(piece => {
            if (piece.dead === false) pos += piece.type + piece.id + ",";
        });
        

        if (this.currentPosIndex !== this.positions.length - 1 && this.currentPosIndex !== null) {
            this.branched = true;
            if (this.branchIndex !== this.branch.length - 1 && this.branchIndex !== null) this.branch =  this.branch.slice(0, this.branchIndex + 1);
            this.branch.push({pos, turn: this.turn, black: {
                castleR: this.boxes[0][4].canCastleR,
                castleL: this.boxes[0][4].canCastleL 
            },
            white: {
                castleR: this.boxes[7][4].canCastleR,
                castleL: this.boxes[7][4].canCastleL  
            }});
            this.branchIndex = this.branch.length - 1;
            return;
        }
        this.positions.push({pos, turn: this.turn, black: {
            castleR: this.boxes[0][4].canCastleR,
            castleL: this.boxes[0][4].canCastleL 
        },
        white: {
            castleR: this.boxes[7][4].canCastleR,
            castleL: this.boxes[7][4].canCastleL  
        }
        });
        this.currentPosIndex = this.positions.length - 1;
    }

    promo(index, piece) {
        this.pieces.splice(index, 1, new Piece(piece.type, piece.isblack, {x: (Number(piece.id[1])), y: (Number(piece.id[0]))}, this.boxArea, piece.id, this.boxes, this.perspective));
    }


    doPromote(pos, cb) {
        let id = this.pieces[this.promote.oldPieceIndex].id;
        //if (this.perspective) id = String(9 - Number(id[0])) + String(9 - Number(id[1]));
        let newPiece = this.promote.show.choose(pos, id, this.boxArea, this.boxes, this.perspective);

        if (newPiece === null) return;

        if (cb) cb(this.promote.oldPieceIndex, newPiece);
        this.pieces.splice(this.promote.oldPieceIndex, 1, newPiece);
        this.promoting = false;
        this.promote.oldPieceIndex = null;
        this.promote.show = null;
        this.boxes[Number(id[0]) - 1][Number(id[1]) - 1].piece = newPiece.type;

        this.addPos();
    }

    castleBox(isblack) {
        let castleBoxes = []

        if (isblack) {
            let checkersR = [this.boxes[0][5], this.boxes[0][6]];
            let checkersL = [this.boxes[0][3], this.boxes[0][2], this.boxes[0][1]];
            let right = 0;
            let left = 0;

            checkersL.forEach(box => {
                let check = box.attackers.join("");
                if (box.piece === null && !/[A-Z]/.test(check)) left++
            });

            checkersR.forEach(box => {
                let check = box.attackers.join("");
                if (box.piece === null && !/[A-Z]/.test(check)) right++
            });

            if (this.boxes[0][7].piece === "r" && this.boxes[0][4].canCastleR) right++;
            if (this.boxes[0][0].piece === "r" && this.boxes[0][4].canCastleL) left++;

            if (right === checkersR.length + 1) castleBoxes.push(this.boxes[0][6].id);
            if (left === checkersL.length + 1) castleBoxes.push(this.boxes[0][2].id);
        } else {
            let checkersR = [this.boxes[7][5], this.boxes[7][6]];
            let checkersL = [this.boxes[7][3], this.boxes[7][2], this.boxes[7][1]];
            let right = 0;
            let left = 0;

            checkersL.forEach(box => {
                let check = box.attackers.join("");
                if (box.piece === null && !/[a-z]/.test(check)) left++
            });

            checkersR.forEach(box => {
                let check = box.attackers.join("");
                if (box.piece === null && !/[a-z]/.test(check)) right++
            });

            if (this.boxes[7][7].piece === "R" && this.boxes[7][4].canCastleR) right++;
            if (this.boxes[7][0].piece === "R" && this.boxes[7][4].canCastleL) left++;

            if (right === checkersR.length + 1) castleBoxes.push(this.boxes[7][6].id);
            if (left === checkersL.length + 1) castleBoxes.push(this.boxes[7][2].id);
        }

        return castleBoxes;
    }

    checkCastle() {
        if (this.boxes[0][7].piece !== "r") this.boxes[0][4].canCastleR = false;
        if (this.boxes[0][0].piece !== "r") this.boxes[0][4].canCastleL = false;
        if (this.boxes[0][4].piece !== "k") {
            this.boxes[0][4].canCastleR = false;
            this.boxes[0][4].canCastleL = false;
        }

        if (this.boxes[7][7].piece !== "R") this.boxes[7][4].canCastleR = false;
        if (this.boxes[7][0].piece !== "R") this.boxes[7][4].canCastleL = false;
        if (this.boxes[7][4].piece !== "K") {
            this.boxes[7][4].canCastleR = false;
            this.boxes[7][4].canCastleL = false;
        }
    }

    castle(id, isblack) {
        if (this.castleBox(isblack).indexOf(id) === -1) return false;
        let rookID;
        let rookIndex;
        let kingIndex = isblack ? 1 : 0;
        let values = id.split("");
        let y = Number(values[0]);
        let x = Number(values[1]);

        if (x - 5 > 0) {
            rookID = String(y) + String(8);
        } else rookID = String(y) + String(1);    
            
        this.pieces.forEach(piece => {
            if (piece.id === rookID) rookIndex = this.pieces.indexOf(piece);
            return;
        });

        if (x - 5 > 0){
            this.pieces[rookIndex].update(String(y) + String(x-1));
            this.boxes[y-1][(x-1) - 1].piece = this.pieces[rookIndex].type;
            this.boxes[y-1][7].piece = null;
            this.boxes[y-1][4].piece = null;
            this.boxes[y-1][x-1].piece = this.pieces[kingIndex].type;
            this.pieces[kingIndex].update(id);
        } else {
            this.pieces[rookIndex].update(String(y) + String(x+1));
            this.boxes[y-1][(x-1) + 1].piece = this.pieces[rookIndex].type;
            this.boxes[y-1][0].piece = null;
            this.boxes[y-1][4].piece = null;
            this.boxes[y-1][x-1].piece = this.pieces[kingIndex].type;
            this.pieces[kingIndex].update(id);
        }
        
        return true;
    }

    isInCheck(isblack) {
        if (isblack) {
            let kvalues = this.pieces[1].id.split("");
            let Y = Number(kvalues[0]) - 1;
            let X = Number(kvalues[1]) - 1;
            let check = this.boxes[Y][X].attackers.join("");

            if (/[A-Z]/.test(check)) return true;
            return false;
        } else {
            let kvalues = this.pieces[0].id.split("");
            let Y = Number(kvalues[0]) - 1;
            let X = Number(kvalues[1]) - 1;
            let check = this.boxes[Y][X].attackers.join("");

            if (/[a-z]/.test(check)) return true;
            return false;
        }
    }

    isLegal(id, piece) {
        this.boxes.forEach(rw => {
            rw.forEach(bx => {
                bx.attackers = [];
            });
        })
        

        this.pieces.forEach(piece => {
            let values = piece.id.split("");
            let y = Number(values[0]) - 1;
            let x = Number(values[1]) - 1;

            if (this.boxes[y][x].piece === piece.type && piece.dead === false) {
                piece.updateMoves(this.boxes);
                piece.attack(this.boxes);
            }
        });
        
        let king;
        let currentPiece = piece ? piece : this.pieces[this.held_piece_index];


        if (currentPiece.isblack) {
            king = this.pieces[1];
        } else king = this.pieces[0];

        let kvalues = king.id.split("");

        if (this.held_piece_index === 0 | this.held_piece_index === 1) kvalues = id.split("");
        if (currentPiece.type === "k" | currentPiece.type === "K") kvalues = id.split("");

        let Y = Number(kvalues[0]) - 1;
        let X = Number(kvalues[1]) - 1;
        //console.log(this.boxes[Y][X]);
        
        
        //console.log(king)
        let checker = this.boxes[Y][X].attackers.join("");
        //console.log(this.pieces)

        if (king.isblack) {
            if (!/[A-Z]/.test(checker)) {
                return true;
            } else return false;
        } else {
            if (/[a-z]/.test(checker) === false) {
                
                return true;
            } else {
                console.log("why")
                return false}
        }
    }

    
    makeMove(piece) {
        let legal = false;
        piece.moves.forEach(move => {
            if (typeof move !== "string") return;
            let values = move.split("");
            let y = Number(values[0]) - 1;
            let x = Number(values[1]) - 1;

            let box = this.boxes[y][x];

            box.cap = box.piece;

            this.boxes[Number(piece.id[0]) - 1][Number(piece.id[1]) - 1].piece = null;
            box.piece = piece.type;

            //let enpass = this.pieces[this.held_piece_index].isEnpass(box.id);

            
            if (piece.type === "P") {
                if (box.enpass !== null) {
                    let Values = box.id.split("");
                    let Y = Number(Values[0]) - 1;
                    let X = Number(Values[1]) - 1;

                    this.boxes[Y+1][X].cap = this.boxes[Y+1][X].piece;
                    this.boxes[Y+1][X].piece = null;
                }
            } else if (piece.type === "p") {
                if (box.enpass !== null) {
                    let Values = box.id.split("");
                    let Y = Number(Values[0]) - 1;
                    let X = Number(Values[1]) - 1;

                    this.boxes[Y-1][X].cap = this.boxes[Y-1][X].piece;
                    this.boxes[Y-1][X].piece = null;
                }
            }
            

            let Legal = this.isLegal(move, piece);
            //box.piece = box.cap;
            this.boxes[Number(piece.id[0]) - 1][Number(piece.id[1]) - 1].piece = piece.type;
            
            
            if (piece.type === "P") {
                if (box.enpass !== null) {
                    let Values = box.id.split("");
                    let Y = Number(Values[0]) - 1;
                    let X = Number(Values[1]) - 1;

                    this.boxes[Y+1][X].piece = this.boxes[Y+1][X].cap;
                }
            } else if (piece.type === "p") {
                if (box.enpass !== null) {
                    let Values = box.id.split("");
                    let Y = Number(Values[0]) - 1;
                    let X = Number(Values[1]) - 1;

                    this.boxes[Y-1][X].piece = this.boxes[Y-1][X].cap;
                }
            }
            

            box.piece = box.cap;
            if (Legal) return legal = true;
        });

        return legal;
    }

    isCheckmate(isblack) {
        if (isblack) {
            if (!this.isInCheck(isblack)) return false;
            let checkmate = true;
            this.pieces.forEach(piece => {
                if (piece.isblack && piece.dead === false) {
                    if (this.makeMove(piece)) return checkmate = false;
                }
            });

            return checkmate;
        } else {
            if (!this.isInCheck(isblack)) return false;
            let checkmate = true;
            this.pieces.forEach(piece => {
                if (piece.isblack === false && piece.dead === false) {
                    if (this.makeMove(piece)) return checkmate = false;
                }
            });

            return checkmate;
        }
    }


    renderPos(i) {
        let positions = this.branched ? this.branch[i].pos.split(",").slice(0, -1) : this.positions[i].pos.split(",").slice(0, -1);
        this.turn = this.branched ? !this.branch[i].turn : !this.positions[i].turn;
        let shit = this.branched ? this.branch[i] : this.positions[i];

        let newPieces = [];

        this.boxes.forEach(row => {
            row.forEach(box => {
                box.piece = null;
                box.attackers = [];
            });
        });

        positions.forEach(pos => {
            let type = pos[0];
            let isblack = /[a-z]/.test(type);
            let y = Number(pos[1]);
            let x = Number(pos[2]);
            
            newPieces.push(new Piece(type, isblack, {y, x}, this.boxArea, String(y) + String(x), this.boxes, this.perspective));
            this.boxes[y - 1][x - 1].piece = type;
        });

        this.pieces = newPieces;

        this.pieces.forEach(piece => {
            piece.update(piece.id);
            piece.updateMoves(this.boxes);
            piece.attack(this.boxes);
        });

        this.boxes[0][4].canCastleL = shit.black.castleL;
        this.boxes[0][4].canCastleR = shit.black.castleR;

        this.boxes[7][4].canCastleL = shit.white.castleL;
        this.boxes[7][4].canCastleR = shit.white.castleR;

        if (this.branched) {
            this.branchIndex = i;
        } else this.currentPosIndex = i;
    }


    checkPieces(pos) {
        if (this.promoting) return;
        let piecefound = false
        this.pieces.forEach(piece => {
            if (this.islocal) {
                if (piece.isTarget(pos)) {
                    piecefound = true;
                    this.hold = this.pieces.indexOf(piece);
                    return;
                }
            } else if (piece.isTarget(pos) && piece.isblack === this.perspective) {
                piecefound = true;
                piece.held = true;
                this.hold = this.pieces.indexOf(piece);
                return;
            }
        });

        return piecefound;
    }

    checkBoxes(pos, cb, cb2) {
        let dropped = false;
        this.boxes.forEach(row => {
            row.forEach(bxx => {
                if (this.end) return;
                if (this.held_piece_index === null) return;
                if (this.pieces[this.held_piece_index].dead) return;
                if (this.held_piece_index === null) return console.log("something weird");
                if (this.pieces[this.held_piece_index].isblack !== this.turn) return;

                if (bxx.isTarget(pos)) {
                    let by = 8 - Number(bxx.id[0]);
                    let bx = 8 - Number(bxx.id[1]);

                    let box = this.perspective === true ? this.boxes[by][bx] : bxx;
                    if (this.held_piece_index === 0 | this.held_piece_index === 1) {
                        
                        if (this.castle(box.id, this.pieces[this.held_piece_index].isblack)) {
                            dropped = true;
                            this.addPos();
                            if (cb) cb(box.id, this.held_piece_index);
                            this.held_piece_index = null;
                            this.turn = !this.turn;
                            return;
                        }
                    }


                    if (this.pieces[this.held_piece_index].isLegal(box.id) === false) return;
                    
                    let values = this.pieces[this.held_piece_index].id.split("");
                    let y = Number(values[0]) - 1;
                    let x = Number(values[1]) - 1;

                    let deadpiece = null;

                    if (box.piece !== null) {
                        box.cap = box.piece;
                        this.pieces.forEach(piece => {
                            if (piece.id === box.id) deadpiece = this.pieces.indexOf(piece);
                            return;
                        });
                    }

                    this.boxes[y][x].piece = null;
                    box.piece = this.pieces[this.held_piece_index].type;

                    let enpass = this.pieces[this.held_piece_index].isEnpass(box.id);

                    
                    if (this.pieces[this.held_piece_index].type === "P") {
                        if (box.enpass !== null) {
                            let Values = box.id.split("");
                            let Y = Number(Values[0]) - 1;
                            let X = Number(Values[1]) - 1;

                            this.boxes[Y+1][X].cap = this.boxes[Y+1][X].piece;
                            this.boxes[Y+1][X].piece = null;

                            this.pieces.forEach(piece => {
                                if (piece.id === this.boxes[Y+1][X].id) deadpiece = this.pieces.indexOf(piece);
                                return;
                            });
                        }
                    } else if (this.pieces[this.held_piece_index].type === "p") {
                        if (box.enpass !== null) {
                            let Values = box.id.split("");
                            let Y = Number(Values[0]) - 1;
                            let X = Number(Values[1]) - 1;

                            this.boxes[Y-1][X].cap = this.boxes[Y-1][X].piece;
                            this.boxes[Y-1][X].piece = null;

                            this.pieces.forEach(piece => {
                                if (piece.id === this.boxes[Y-1][X].id) deadpiece = this.pieces.indexOf(piece);
                                return;
                            });
                        }
                    }
                    
                    
                    if (this.isLegal(box.id)) {
                        this.pieces[this.held_piece_index].update(box.id);
                        this.pieces[this.held_piece_index].updateMoves(this.boxes);
                        this.pieces[this.held_piece_index].attack(this.boxes);
                        
                        if (enpass) {
                            if (this.pieces[this.held_piece_index].isblack) {
                                this.boxes[y+1][x].enpass = "p";
                            } else {
                                this.boxes[y-1][x].enpass = "P";
                            }
                        } else {
                            this.boxes.forEach(rw => {
                                rw.forEach(bx => {
                                    bx.enpass = null;
                                });
                            });
                        }
                        box.cap = null;
                        if (deadpiece !== null) this.pieces[deadpiece].dead = true;

                        if (this.isCheckmate(!this.pieces[this.held_piece_index].isblack)) {
                            console.log("checkmate");
                            if (cb2) cb2(this.turn);
                        }


                        if (this.pieces[this.held_piece_index].willPromote()) {
                            this.promoting = true;
                            this.promote.oldPieceIndex = this.held_piece_index;
                            this.promote.show = new Promote(this.pieces[this.held_piece_index].isblack)
                        }

                        this.checkCastle();

                        this.pieces.forEach(emf => {
                            let y = Number(emf.id[0]) - 1;
                            let x = Number(emf.id[1]) - 1;

                            if (emf.type !== this.boxes[y][x].piece) emf.dead = true;
                        });

                        if (this.promoting === false) this.addPos();

                        if (cb && this.promoting === false) cb(box.id, this.held_piece_index)

                        this.held_piece_index = null;
                        dropped = true;

                        this.turn = !this.turn;
                    } else {
                        this.boxes[y][x].piece = this.pieces[this.held_piece_index].type;
                        box.piece = box.cap;
                        if (this.pieces[this.held_piece_index].type === "P") {
                            if (box.enpass !== null) {
                                let Values = box.id.split("");
                                let Y = Number(Values[0]) - 1;
                                let X = Number(Values[1]) - 1;
    
                                this.boxes[Y+1][X].piece = this.boxes[Y+1][X].cap;
                            }
                        } else if (this.pieces[this.held_piece_index].type === "p") {
                            if (box.enpass !== null) {
                                let Values = box.id.split("");
                                let Y = Number(Values[0]) - 1;
                                let X = Number(Values[1]) - 1;
    
                                this.boxes[Y-1][X].piece = this.boxes[Y-1][X].cap;
                            }
                        }
                    }

                    this.pieces.forEach(piece => {
                        let y = Number(piece.id[0]) - 1;
                        let x = Number(piece.id[1]) - 1;

                        if (piece.type !== this.boxes[y][x].piece) piece.dead = true;


                        piece.updateMoves(this.boxes);
                    });

                    this.checkCastle();
                    

                    return;
                }
            });
        });

        if (!dropped) {
            this.pieces[this.held_piece_index].update(this.pieces[this.held_piece_index].id);
            this.held_piece_index = null;
        }
    }

    switch() {
        this.perspective = !this.perspective;
        this.pieces.forEach(piece => piece.switch());
        return;
    }
}

let game;


let animationID;

function animate() {
    animationID = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.draw();
}

/*
canvas.addEventListener('mousedown', e => {
    if (!game) return;
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
    if (!game) return;
    const target = e.target;

    // Get the bounding rectangle of target
    const rect = target.getBoundingClientRect();

    // Mouse position
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    if (game.held_piece_index === null) return;
    game.pieces[game.held_piece_index].move({x, y});

});


canvas.addEventListener('mouseup', e => {
    if (!game) return;
    if (game.held_piece_index === null) return;
    const target = e.target;

    // Get the bounding rectangle of target
    const rect = target.getBoundingClientRect();

    // Mouse position
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    game.checkBoxes({x, y});
});

canvas.addEventListener('click', e => {
    if (!game) return;
    if (game.promoting === false) return;
    const target = e.target;

    // Get the bounding rectangle of target
    const rect = target.getBoundingClientRect();

    // Mouse position
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    game.doPromote({x, y});
});
*/