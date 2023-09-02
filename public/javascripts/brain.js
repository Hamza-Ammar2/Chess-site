class Brain {
    constructor(isblack) {
        this.isblack = isblack;
        this.randomNumber = 999999999999;
        this.represent = {
            'p': 0,
            'b': 1,
            'n': 2,
            'r': 3,
            'q': 4,
            'k': 5,
            'P': 6,
            'B': 7,
            'N': 8,
            'R': 9,
            'Q': 10,
            'K': 11
        }
        
        this.table = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            [],
        ];

        this.pawnPos = [
            0,  0,  0,  0,  0,  0,  0,  0,
            50, 50, 50, 50, 50, 50, 50, 50,
            10, 10, 20, 30, 30, 20, 10, 10,
            5,  5, 10, 25, 25, 10,  5,  5,
            0,  0,  0, 20, 20,  0,  0,  0,
            5, -5,-10,  0,  0,-10, -5,  5,
            5, 10, 10,-20,-20, 10, 10,  5,
            0,  0,  0,  0,  0,  0,  0,  0
        ];

        this.knightPos = [
            -50,-40,-30,-30,-30,-30,-40,-50,
            -40,-20,  0,  0,  0,  0,-20,-40,
            -30,  0, 10, 15, 15, 10,  0,-30,
            -30,  5, 15, 20, 20, 15,  5,-30,
            -30,  0, 15, 20, 20, 15,  0,-30,
            -30,  5, 10, 15, 15, 10,  5,-30,
            -40,-20,  0,  5,  5,  0,-20,-40,
            -50,-40,-30,-30,-30,-30,-40,-50,
        ];

        this.bishopPos = [
            -20,-10,-10,-10,-10,-10,-10,-20,
            -10,  0,  0,  0,  0,  0,  0,-10,
            -10,  0,  5, 10, 10,  5,  0,-10,
            -10,  5,  5, 10, 10,  5,  5,-10,
            -10,  0, 10, 10, 10, 10,  0,-10,
            -10, 10, 10, 10, 10, 10, 10,-10,
            -10,  5,  0,  0,  0,  0,  5,-10,
            -20,-10,-10,-10,-10,-10,-10,-20,
        ];
        
        this.rookPos = [
            0,  0,  0,  0,  0,  0,  0,  0,
            5, 10, 10, 10, 10, 10, 10,  5,
            -5,  0,  0,  0,  0,  0,  0, -5,
            -5,  0,  0,  0,  0,  0,  0, -5,
            -5,  0,  0,  0,  0,  0,  0, -5,
            -5,  0,  0,  0,  0,  0,  0, -5,
            -5,  0,  0,  0,  0,  0,  0, -5,
            0,  0,  0,  5,  5,  0,  0,  0
        ];


        this.queenPos = [
            -20,-10,-10, -5, -5,-10,-10,-20,
            -10,  0,  0,  0,  0,  0,  0,-10,
            -10,  0,  5,  5,  5,  5,  0,-10,
            -5,  0,  5,  5,  5,  5,  0, -5,
            0,  0,  5,  5,  5,  5,  0, -5,
            -10,  5,  5,  5,  5,  5,  0,-10,
            -10,  0,  5,  0,  0,  0,  0,-10,
            -20,-10,-10, -5, -5,-10,-10,-20
        ];


        this.kingPos = [
            -30,-40,-40,-50,-50,-40,-40,-30,
            -30,-40,-40,-50,-50,-40,-40,-30,
            -30,-40,-40,-50,-50,-40,-40,-30,
            -30,-40,-40,-50,-50,-40,-40,-30,
            -20,-30,-30,-40,-40,-30,-30,-20,
            -10,-20,-20,-20,-20,-20,-20,-10,
            20, 20,  0,  0,  0,  0, 20, 20,
            20, 30, 10,  0,  0, 10, 30, 20
        ];


        //this.table = JSON.parse(localStorage.getItem("table"));


        this.blackToMove = (this.randomNumber * Math.random()); 
        
        this.init_zobrist();

        this.queen = 900;
        this.rook = 500;
        this.knight = 300;
        this.bishop = 300;
        this.transposed = 0;
        this.pawn = 100;
        this.searchedMoves = [];
        this.transpositions = {};
        this.currentMove = "";
        this.castlePreference = 40;
        this.positions = 0;
        this.depth = 5;
        this.maxDepth = 5;
        this.startCounting = true;
        this.hashed = null;
    }

    evaluate(pos, isblack) {
        if (pos.end === true) {
            //console.log(pos)
            let move = {};
            move.move = pos.move;
            //console.log(move);
            if (pos.isInChecK) {
                if (isblack) {
                    move.score = -Infinity;
                } else move.score = Infinity;
            } else move.score = 0;
            //console.log(move);
            return move;
        }
        let evaluation = 0;
        let keys = Object.keys(pos);

        if (pos.move === "K85,87" | pos.move === "K85,83") evaluation += this.castlePreference;
        if (pos.move === "k15,17" | pos.move === "k15,13") evaluation -= this.castlePreference;
        for (let key of keys) {
            //if (key === "move" | key === "enpass" | key === "end" | key === "nomoves" | key === "castle" | "isInChecK") continue;
            //let isblack = /[a-z]/.test(pos[key]);
            if (!Number(key[0])) continue;

            let isblack = pos[key] === pos[key].toLowerCase();
            let type = pos[key].toLowerCase();
            let factor = isblack ? -1 : 1;

            evaluation += this.getWorth(type) * factor;
            evaluation += this.getPosEval(key, type, isblack) * factor;
        }

        return {score: evaluation, move: pos.move};
    }

    getPosEval(key, type, isblack) {
        let table;
        switch(type) {
            case "p":
                    table = this.pawnPos;
                    break;
                
                case "n":
                    table = this.knightPos;
                    break;

                case "b":
                    table = this.bishopPos;
                    break;

                case "r":
                    table = this.rookPos;
                    break;

                case "q":
                    table = this.queenPos;
                    break;

                case "k":
                    table = this.kingPos;
                    break;
        }

        let y = Number(key[0]) - 1;
        let x = Number(key[1]) - 1;

        if (isblack) {
            y = 7 - y;
            x = 7 - x;
        }


        let i = 8*y + x;

        return table[i];
    }

    init_zobrist() {
        for (let i = 0; i < this.table.length; i++) {
            for (let j = 0; j < 64; j++) {
                this.table[i].push(this.randomNumber * Math.random());
            }
        }
    }

    hash(pos, isblack) {
        let h = 0;
        if (isblack) h ^= this.blackToMove;

        for (let key of Object.keys(pos)) {
            //if (key === "move" | key === "enpass" | 
            //    key === "nomoves" | key === "end" | key === "castle" | key === "isInChecK") continue;
            if (!Number(key[0])) continue;

            let piece = this.represent[pos[key]];
            let y = Number(key[0]) - 1;
            let x = Number(key[1]) - 1;
            let i = 8*y + x;

            h ^= this.table[piece][i];
        }

        return h;
    }

    smartHash(move, isblack) {
        let parts = [move.move.slice(0, 3), move.move.slice(4)];
        let piece = parts[0][0];
        let id = parts[0].slice(1);
        let Move = parts[1].length > 2 ? parts[1].slice(1) : parts[1];

        let i = 8*(Number(id[0]) - 1) + (Number(id[1]) - 1);
        let I = 8*(Number(Move[0]) - 1) + (Number(Move[1]) - 1);
        let pieceIndex = this.represent[piece];

        this.hashed ^= this.table[pieceIndex][i];
        this.hashed ^= this.table[pieceIndex][I];

        if (parts[1].length > 2) this.hashed ^= this.table[this.represent[parts[1][0]]][I];
        if (isblack) this.hashed ^= this.blackToMove;
    }

    pos2Board(pos) {
        let board = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ];
        let keys = Object.keys(pos);
        for (let key of keys){
            //if (key === "move" | key === "enpass" | 
            //    key === "nomoves" | key === "end" | key === "castle" | key === "isInChecK") continue;
            if (!Number(key[0])) continue;

            let type = pos[key];
            
            let y = Number(key[0]) - 1;
            let x = Number(key[1]) - 1;
            board[y][x] = type;
        }

        return board;
    }

    movesFromType(type) {
        return type === "n" | type === "N" ? kight : type === "q" | type === "Q" ? qeen : type === "r" | type === "R" ? rok : type === "b" | type === "B" ? bshop : type === "k" | type === "K" ? kng : type === "p" | type === "P" ? pwn : null;
    }

    findKing(isblack, pos) {
        let keys = Object.keys(pos);
        let king = isblack ? "k" : "K";

        for (let key of keys) {
            if (pos[key] === king) return key;
        }
    }

    getPawnMap(pos, isblack) {
        let attacked = new Map();
        let keys = Object.keys(pos);
        let pawn = isblack ? 'P' : 'p';
        let direction = isblack ? -1 : 1;

        for (let key of keys) {
            if (pos[key] !== pawn) continue;

            let y = Number(key[0]);
            let x = Number(key[1]);

            if (y + direction > 8 | y + direction < 1) continue;

            if (x + 1 <= 8) attacked.set(String(y+direction) + String(x+1), true);

            if (x - 1 >= 1) attacked.set(String(y+direction) + String(x-1), true);
        }
        return attacked;
    }

    getWorth(type) {
        switch(type.toLowerCase()) {
            case 'p':
                return this.pawn;
            case 'n':
                return this.knight;
            case 'b':
                return this.bishop;
            case 'r':
                return this.rook;
            case 'q':
                return this.queen;
            case 'k':
                return 10000;
        }
    }

    getMoveScore(move, map) {
        let score = 0;
        //let parts = move.move.split(',');
        let parts = [move.move.slice(0, 3), move.move.slice(4)];
        let piece = parts[0][0];
        let Move = parts[1];
        let type = piece.toLowerCase();
        let isblack = piece === type;

        if (parts[1].length > 2) {
            let diff = (this.getWorth(parts[1][0]) - this.getWorth(piece)) * 100

            if (diff === 0) diff += 100 * this.getWorth(piece);
            if (diff < 0) diff *= -1/3;

            score += diff;
            Move = parts[1].slice(1);
        }

        if (map.has(Move)) {
            score -= (this.getWorth(piece) - 1)*100;
        }

        if (move.castle !== null) score += 20;
        score += this.getPosEval(parts[0].slice(1), type, isblack) * -1;
        return score;
    }

    getAllMoves(pos, isblack, onlyCapture, depth) {
        let board = this.pos2Board(pos);
        let moves = [];
        let keys = Object.keys(pos);
        //let keys = this.orderKeys(pos);
        let kingID = this.findKing(isblack, pos);
        if (!kingID) console.log(pos, board);
        let isInChecK = isInCheck(board, isblack ? 'k' : 'K', kingID);
        
        if (this.searchedMoves.length !== 0 && this.depth !== 1 && depth === this.depth) {
            let factor = this.isblack ? -1 : 1;
            moves = this.searchedMoves;
            
            //console.log("what the fuck")
            this.searchedMoves = [];
            moves.sort((move1, move2) => {
                return factor * (move2.score - move1.score);
            });

            //console.log(moves)
            return [moves, isInChecK];
        }


        let castle = isblack ? pos.castle.black : pos.castle.white;
        let map = this.getPawnMap(pos, isblack);

        for (let key of keys) {
            //if (key === "move" | key === "enpass" | key === "end" 
            //| key === "nomoves" | key === "castle" | key === "isInChecK") continue;
            if (!Number(key[0])) continue;

            let type = pos[key];
            if (/[a-z]/.test(type) !== isblack) continue;

            let result;

            if (type.toLowerCase() === 'p') {
                result = this.movesFromType(type)(key, board, isblack, kingID, isInChecK, pos.enpass); 
            } else if (type.toLowerCase() === 'k') {
                result = this.movesFromType(type)(key, board, isblack, kingID, isInChecK, castle); 
            } else result = this.movesFromType(type)(key, board, isblack, kingID, isInChecK);

            //let Moves = onlyCapture ? Object.keys(result.captures) : result.moves;
            //console.log(result);
            let Moves = result.moves;
            if (Moves.length === 0) continue;
            
            for (let move of Moves) {
                let newMove = {};
                let partOne = type + key;
                let partTwo = move;
                if (pos[move]) partTwo = pos[move] + partTwo;
                newMove.enpass = null;
                newMove.castle = null;

                if (move === result.enpass) {
                    let eY = isblack ? "3" : "6";
                    newMove.enpass = eY + move[1];
                }

                if (move === result.castleR | move === result.castleL) {
                    newMove.castle = move;
                }

                newMove.move = partOne + "," + partTwo;
                newMove.score = this.getMoveScore(newMove, map);
                moves.push(newMove);
            }
        }

        moves.sort((move1, move2) => {
            return (move2.score - move1.score);
        });

        return [moves, isInChecK];
    }

    compareKey(key) {
        if (this.transpositions[key]) return this.transpositions[key];
        return false;
    }

    board2Pos(board) {
        let pos = {};
        board.forEach((row, i) => {
            for (let j = 0; j < row.length; j++) {
                let Pos = board[i][j];
                if (Pos === 0) continue;
                let type = Pos;
                let key = `${i + 1}${j + 1}`;
                pos[key] = type;
            }
        });

        return pos;
    }

    minimaxCaptures(pos, alpha, beta, isblack) {
        if (pos.end === true | pos.nomoves === true) {
            
            let key = this.generateKey(pos);
            let comparison = this.compareKey(key, isblack);
            if (comparison !== false && !pos.end) {
                this.transposed += 1;
                return {score: comparison.score, move: pos.move};
            }
            
            //let evaluation = this.minimaxCaptures(pos, alpha, beta, isblack);
            let evaluation = this.evaluate(pos, isblack);
            
            if (isblack) {
                this.transpositionsB[key] = {score: evaluation.score, depth}; 
            } else this.transpositionsW[key] = {score: evaluation.score, depth}; 
            
            return evaluation;
        }

        if (!isblack) {
            let value = {score: -Infinity};
            //for (let position of this.getCapturePositions(pos, isblack)) {
            for (let position of this.getPoses(pos, isblack, -1, true)) {
                
                let key = this.generateKey(position);
                let comparison = this.compareKey(key, !isblack);
                if (comparison !== false) {
                    if (comparison.depth >= depth - 1) {
                        this.transposed += 1;
                        if (comparison.score > value.score) value = {score: comparison.score, move: position.move};
                        alpha = Math.max(value.score, alpha);
                        //if (depth === this.depth) this.searchedMoves.push({score: comparison.score, move: position.move});
                        if (value.score >= beta) break;
                        continue;
                    }
                }
                
                let newValue = this.minimaxCaptures(position, alpha, beta, !isblack);
                if (newValue.score > value.score) value = newValue;
                this.transpositionsB[key] = {depth: depth - 1, score: newValue.score};
                alpha = Math.max(value.score, alpha);
                if (value.score >= beta) break;
            }
            if (!value.move) {
                value.move = pos.move;
                //console.log(depth, pos);
            }
            return value;
        } else {
            let value = {score: Infinity};
            //for (let position of this.getCapturePositions(pos, isblack)) {
            for (let position of this.getPoses(pos, isblack, -1, true)) {
                
                let key = this.generateKey(position);
                let comparison = this.compareKey(key, !isblack);
                if (comparison !== false) {
                    if (comparison.depth >= depth - 1) {
                        this.transposed += 1;
                        if (comparison.score < value.score) value = {score: comparison.score, move: position.move};
                        beta = Math.min(value.score, beta);
                        //if (depth === this.depth) this.searchedMoves.push({score: comparison.score, move: position.move});
                        if (value.score <= alpha) break;
                        continue;
                    }
                }
                
                let newValue = this.minimaxCaptures(position, alpha, beta, !isblack);
                if (newValue.score < value.score) value = newValue;
                this.transpositionsW[key] = {depth: depth - 1, score: newValue.score};
                beta = Math.min(value.score, beta);
                if (value.score <= alpha) break;
            }
            if (!value.move) {
                value.move = pos.move;
                //console.log(depth, pos);
            }
            return value;
        }
    }

    applyMove(pos, move, depth) {
        //let parts = move.move.split(",");
        let parts = [move.move.slice(0, 3), move.move.slice(4)];
        let piece = parts[0][0];
        let id = parts[0].slice(1);
        let Move = parts[1].length > 2 ? parts[1].slice(1) : parts[1];

        delete pos[id];
        pos[Move] = piece;


        if (piece.toLowerCase() === 'p' && Move === pos.enpass) {
            delete pos[id[0] + pos.enpass[1]];
        }

        pos.enpass = move.enpass;

        if (Move === move.castle) {
            if (move.castle[1] === '7') {
                pos[id[0] + '6'] = pos[id[0] + '8'];
                delete pos[id[0] + '8'];
            } else {
                pos[id[0] + '4'] = pos[id[0] + '1'];
                delete pos[id[0] + '1'];
            }
        }

        // CASTLING START
        if (piece === 'k') {
            pos.castle.black.l = false;
            pos.castle.black.r = false;
        }
        if (pos["18"] !== 'r') pos.castle.black.r = false;
        if (pos["11"] !== 'r') pos.castle.black.l = false;
        if (piece === 'K') {
            pos.castle.white.l = false;
            pos.castle.white.r = false;
        }
        if (pos["88"] !== 'R') pos.castle.white.r = false;
        if (pos["81"] !== 'R') pos.castle.white.l = false;
        
        if (depth === this.depth) pos.move = move.move;
        if (this.startCounting) this.positions ++;
    }

    unmakeMove(pos, move, details) {
        //let parts = move.move.split(",");
        let parts = [move.move.slice(0, 3), move.move.slice(4)];
        let piece = parts[0][0];
        let id = parts[0].slice(1);
        let Move = parts[1];

        if (Move.length > 2) {
            let deadPiece = Move[0];
            Move = Move.slice(1);

            pos[id] = piece;
            pos[Move] = deadPiece;
        } else {
            delete pos[Move];
            pos[id] = piece;
        }

        if (piece.toLowerCase() === 'p' && Move === details.enpass[0]) {
            //console.log(details.enpass);
            pos[id[0] + details.enpass[0][1]] = details.enpass[1];
        }

        if (Move === move.castle) {
            if (move.castle[1] === '7') {
                pos[id[0] + '8'] = pos[id[0] + '6'];
                delete pos[id[0] + '6'];
            } else {
                pos[id[0] + '1'] = pos[id[0] + '4'];
                delete pos[id[0] + '4'];
            }
        }

        pos.castle = details.castle;
        pos.enpass = details.enpass[0];
    }


    minimax(pos, depth, alpha, beta, isblack) {
        if (depth === 0 | pos.end === true) {
            //let evaluation = this.minimaxCaptures(pos, alpha, beta, isblack);
            let evaluation = this.evaluate(pos, isblack);
            
            return evaluation;
        }

        if (!isblack) {
            let value = {score: -Infinity};
            let moves = this.getAllMoves(pos, isblack, false, depth);
            for (let move of moves[0]) {
                let details = {
                    enpass: [pos.enpass, pos.enpass ? pos[move.move[1] + pos.enpass[1]] : null],
                    castle: {
                        black: {
                            r: pos.castle.black.r,
                            l: pos.castle.black.l
                        },
                        white: {
                            r: pos.castle.white.r,
                            l: pos.castle.white.l
                        }
                    },
                    score: pos.score
                }

                this.applyMove(pos, move, depth);
                
                //let key = this.hash(pos, !isblack);
                this.smartHash(move, !isblack);
                let key = this.hashed;

                let comparison = this.compareKey(key);
                if (comparison !== false) {
                    if (Number(comparison[0]) >= depth - 1) {
                        let comScore = Number(comparison.slice(1));
                        this.transposed += 1;
                        if (comScore > value.score) value = {score: comScore, move: pos.move};
                        alpha = Math.max(value.score, alpha);
                        move.score = comScore;
                        if (depth === this.depth) this.searchedMoves.push(move);
                        this.unmakeMove(pos, move, details);
                        this.smartHash(move, !isblack);
                        if (value.score >= beta) break;
                        continue;
                    }
                }
                
                let newValue = this.minimax(pos, depth - 1, alpha, beta, !isblack);
                this.smartHash(move, !isblack);

                this.unmakeMove(pos, move, details);
                if (newValue.score > value.score) value = newValue;
                this.transpositions[key] = String(depth - 1) + String(newValue.score);
                move.score = newValue.score;
                if (depth === this.depth) this.searchedMoves.push(move);
                alpha = Math.max(value.score, alpha);
                if (value.score >= beta) break;
            }
            if (!value.move) {
                value.move = pos.move;
                if (!moves[1]) value.score = 0;
                //console.log(depth, pos);
            }
            return value;
        } else {
            let value = {score: Infinity};
            let moves = this.getAllMoves(pos, isblack, false, depth);
            for (let move of moves[0]) {
                let details = {
                    enpass: [pos.enpass, pos.enpass ? pos[move.move[1] + pos.enpass[1]] : null],
                    castle: {
                        black: {
                            r: pos.castle.black.r,
                            l: pos.castle.black.l
                        },
                        white: {
                            r: pos.castle.white.r,
                            l: pos.castle.white.l
                        }
                    },
                    score: pos.score
                }

                this.applyMove(pos, move, depth);
                
                //let key = this.hash(pos, !isblack);
                this.smartHash(move, !isblack);
                let key = this.hashed;

                let comparison = this.compareKey(key);
                if (comparison !== false) {
                    if (Number(comparison[0]) >= depth - 1) {
                        let comScore = Number(comparison.slice(1));
                        this.transposed += 1;
                        if (comScore < value.score) value = {score: comScore, move: pos.move};
                        beta = Math.min(value.score, beta);
                        move.score = comScore;
                        if (depth === this.depth) this.searchedMoves.push(move);
                        this.unmakeMove(pos, move, details);
                        this.smartHash(move, !isblack);
                        if (value.score <= alpha) break;
                        continue;
                    }
                }
                
                let newValue = this.minimax(pos, depth - 1, alpha, beta, !isblack);
                this.smartHash(move, !isblack);

                this.unmakeMove(pos, move, details);
                if (newValue.score < value.score) value = newValue;
                this.transpositions[key] = String(depth - 1) + String(newValue.score);
                move.score = newValue.score;
                if (depth === this.depth) this.searchedMoves.push(move);
                beta = Math.min(value.score, beta);
                if (value.score <= alpha) break;
            }
            if (!value.move) {
                value.move = pos.move;
                if (!moves[1]) value.score = 0;
                //console.log(depth, pos);
            }
            return value;
        }
    }


    minimaxExtra(depth, alpha, beta, isblack, move) {
        if (depth === this.maxDepth) {
            return move;
        }

        this.currentMove = move;
        //console.log(move, depth);
        this.depth = depth + 1;
        if (depth === this.maxDepth - 1) this.startCounting = true
        return this.minimaxExtra(depth + 1, alpha, beta, isblack, this.minimax(this.position, depth + 1, alpha, beta, isblack));
    }

    makeMove(pos, isblack, enpass, castle) {
        if (isblack !== !this.isblack) return;
        this.transposed = 0;
        this.positions = 0;
        pos.castle = castle;
        pos.enpass = enpass;
        this.position = pos;
        //console.log(this.position);
        this.startCounting = false;
        this.depth = 3;
        this.currentMove = "";
        this.hashed = this.hash(pos, !isblack);


        let value = this.minimaxExtra(this.depth, -Infinity, Infinity, !isblack, this.minimax(pos, this.depth, -Infinity, Infinity, !isblack));
        //let value = this.minimax(pos, this.maxDepth, -Infinity, Infinity, !isblack);
        if (Math.random() < 0.5) this.transpositions = {};
        //console.log(pos);
        console.log(value);
        console.log(this.positions, this.transposed);
        
        //console.log(this.searchedMoves)
        this.searchedMoves = [];
        return value;
    }
}