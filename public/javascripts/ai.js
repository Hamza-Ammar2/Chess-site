function Knight(id) {
    let moves = [];
    let y = Number(id[0]);
    let x = Number(id[1]);
    if (y + 2 <= 8 && x + 1 <= 8) {
        moves.push(String(y+2) + String(x+1));
    }
    if (y+ 2 <= 8 && x - 1 >= 1) {
        moves.push(String(y+2) + String(x-1));
    }
    if (y - 2 >= 1 && x + 1 <= 8) {
        moves.push(String(y-2) + String(x+1));
    }
    if (y - 2 >= 1 && x - 1 >= 1) {
        moves.push(String(y-2) + String(x-1));
    }
    if (y + 1 <= 8 && x + 2 <= 8) {
        moves.push(String(y+1) + String(x+2));
    }
    if (y-1 >= 1 && x + 2 <= 8) {
        moves.push(String(y-1) + String(x+2));
    }
    if (y + 1 <= 8 && x - 2 >= 1) {
        moves.push(String(y+1) + String(x-2));
    }
    if (y - 1 >= 1 && x - 2 >= 1) {
        moves.push(String(y-1) + String(x-2));
    }

    return moves;
}

function isVertical(id, kingID) {
    let Y = Number(kingID[0]);
    let y = Number(id[0]);

    if (Y - y > 0) return [null, true, true, true, true, true, true, true];
    return [true, null, true, true, true, true, true, true];
}
//[up, down, right, left, upRight, upLeft, downLeft, downRight];

function motion(num, d, id) {
    let y = Number(id[0]) - 1;
    let x = Number(id[1]) - 1;
    if (d === 'u' && y - num >= 0) return [y - num, x, ['q', 'r']];
    if (d === 'd' && y + num <= 7) return [y + num, x, ['q', 'r']];
    if (d === 'r' && x + num <= 7) return [y, x + num, ['q', 'r']];
    if (d === 'l' && x - num >= 0) return [y, x - num, ['q', 'r']];
    if (d === 'ur' && y - num >= 0 && x + num <= 7) return [y - num, x + num, ['q', 'b']];
    if (d === 'ul' && y - num >= 0 && x - num >= 0) return [y - num, x - num, ['q', 'b']];
    if (d === 'dr' && y + num <= 7 && x + num <= 7) return [y + num, x + num, ['q', 'b']];
    if (d === 'dl' && y + num <= 7 && x - num >= 0) return [y + num, x - num, ['q', 'b']];
    return null;
}

function checkPD(id, kingID, d) {
    let y = Number(id[0]);
    let x = Number(id[1]);
    let Y = Number(kingID[0]);
    let X = Number(kingID[1]);

    switch(d) {
        case 'u':
            if (Y - y > 0 && X === x) return true;
            return false;
        case 'd':
            if (Y - y < 0 && X === x) return true;
            return false;
        case 'r':
            if (Y === y && X - x < 0) return true;
            return false;
        case 'l':
            if (Y=== y && X - x > 0) return true;
            return false;
        case 'ur':
            if (Y - y > 0 && X - x < 0 && (Y-y)*(Y-y) === (X-x)*(X-x)) return true;
            return false;
        case 'ul':
            if (Y - y > 0 && X - x > 0 && (Y-y)*(Y-y) === (X-x)*(X-x)) return true;
            return false;
        case 'dr':
            if (Y - y < 0 && X - x < 0 && (Y-y)*(Y-y) === (X-x)*(X-x)) return true;
            return false;
        case 'dl':
            if (Y - y < 0 && X - x > 0 && (Y-y)*(Y-y) === (X-x)*(X-x)) return true;
            return false;
    }
}

function checkPins(position, id, kingID, isblack) {
    let safes = isPinned(id, kingID);
    if (safes === false) return false;
    let index = safes.indexOf(null);
    let king = isblack ? 'k' : 'K';
    let pieceDirection = null;
    let kingDirection = null;
    let pD = index === 0 ? 'u' : index === 1 ? 'd' : index === 2 ? 'r' : index === 3 ? 'l' : index === 4 ? 'ur' : index === 5 ? 'ul' : index === 6 ? 'dl' : index === 7 ? 'dr' : null;
    let kD = index === 0 ? 'd' : index === 1 ? 'u' : index === 2 ? 'l' : index === 3 ? 'r' : index === 4 ? 'dl' : index === 5 ? 'dr' : index === 6 ? 'ur' : index === 7 ? 'ul' : null;

    for (let i = 1; i < 8; i++) {
        if (pieceDirection !== null && kingDirection !== null) break;
        let pd = motion(i, pD, id);
        let kd = motion(i, kD, id);
        let PD = pd !== null ? position[pd[0]][pd[1]] : null;
        let KD = kd !== null ? position[kd[0]][kd[1]] : null;

        if (pieceDirection === null && PD && PD !== 0) {
            let piece = PD;
            if (/[a-z]/.test(piece) === isblack){
                pieceDirection = true;
                break;
            } else {
                if (pd[2].indexOf(piece.toLowerCase()) !== -1) {
                    pieceDirection = false;
                } else {pieceDirection = true; break;}
            }
        }

        if (kingDirection === null && KD && KD !== 0) {
            let piece = KD;
            if (piece === king) {
                kingDirection = false;
            } else {kingDirection = true; break;}
        }
    }

    if (kingDirection === false && pieceDirection === false) return pD;
    return false;
}

function isHorizontal(id, kingID) {
    let X = Number(kingID[1]);
    let x = Number(id[1]);

    if (X === x) return true;

    if (X - x > 0) return [true, true, true, null, true, true, true, true];
    return [true, true, null, true, true, true, true, true];
}

function isDiagonal(id, kingID) {
    let y = Number(id[0]);
    let x = Number(id[1]);
    let Y = Number(kingID[0]);
    let X = Number(kingID[1]);
    
    let up = Y- y;
    let right = X - x;

    if (up > 0 && right > 0) return [true, true, true, true, true, null, true, true];
    if (up < 0 && right < 0) return [true, true, true, true, true, true, true, null];
    if (up < 0 && right > 0) return [true, true, true, true, true, true, null, true];
    if (up > 0 && right < 0) return [true, true, true, true, null, true, true, true];
}

function isInCheck(Position, king, kingID) {
    return !isLegal(Position, king, kingID, kingID, kingID, true);
}

function isPinned(id, kingID) {
    let y = Number(id[0]);
    let x = Number(id[1]);
    let Y = Number(kingID[0]);
    let X = Number(kingID[1]);

    let vertical = Y === y;
    let horizontal = X === x;
    let diagonal = (Y-y)*(Y-y) === (X-x)*(X-x);

    if (vertical) return isHorizontal(id, kingID);
    if (horizontal) return isVertical(id, kingID);
    if (diagonal) return isDiagonal(id, kingID);
    return false;
}

function isLegal(position, type, kingid, id, newPos, isInCheck, isPinned) {
    if (!isInCheck && type.toLowerCase() !== 'k') {
        if (isPinned === false) return true;
        if (checkPD(newPos, kingid, isPinned)) return true;
        return false;
    }
    
    let isblack = type === type.toLowerCase();
    let checker = isblack ? /[a-z]/ : /[A-Z]/;
    let y = Number(id[0]) - 1;
    let x = Number(id[1]) - 1;
    let Y = Number(newPos[0]) - 1;
    let X = Number(newPos[1]) - 1;
    let deadpiece = position[Y][X];
    
    let kingID = type !== 'k' && type !== 'K' ? kingid : newPos;
    let kingY = Number(kingID[0]) - 1;
    let kingX = Number(kingID[1]) - 1;

    position[y][x] = 0;
    position[Y][X] = type;

    let safes = [null, null, null, null, null, null, null, null];
    for (let i = 1; i < 8; i++) {
        let down = kingY + i <= 7 ? [kingY + i, kingX, ['q', 'r']] : null;
        let up = kingY - i >= 0 ? [kingY - i, kingX, ['q', 'r']] : null;
        let right = kingX + i <= 7 ? [kingY, kingX + i, ['q', 'r']] : null;
        let left = kingX - i >= 0 ? [kingY, kingX - i, ['q', 'r']] : null;
        let upRight = up !== null && right !== null ? [up[0], right[1], ['q', 'b']] : null;
        let upLeft = up !== null && left !== null ? [up[0], left[1], ['q', 'b']] : null;
        let downRight = down !== null && right !== null ? [down[0], right[1], ['q', 'b']] : null;
        let downLeft = down !== null && left !== null ? [down[0], left[1], ['q', 'b']] : null;

        let pos = [up, down, right, left, upRight, upLeft, downLeft, downRight];

        if (i === 1) {
            pos.forEach(side => {
                if (side !== null) {
                    side[2].push('k')
                }
            });

            if (isblack) {
                pos[7] !== null ? pos[7][2].push('p') : null;
                pos[6] !== null ? pos[6][2].push('p') : null;
            } else {
                pos[5] !== null ? pos[5][2].push('p') : null;
                pos[4] !== null ? pos[4][2].push('p') : null;
            }
        }

        for (let j = 0; j < pos.length; j++) {
            if (pos[j] === null) continue;
            let box = position[pos[j][0]][pos[j][1]];
            if (box === 0 | safes[j] !== null) continue;

            let piece = box;
            if (checker.test(piece)) {
                safes[j] = true;
                continue;
            }

            let pieceType = piece.toLowerCase();
            if (pos[j][2].indexOf(pieceType) !== -1) {
                position[y][x] = type;
                position[Y][X] = deadpiece;
                return false;
            } else {
                safes[j] = true;
            }
        }
    }

    let kinghtMoves = Knight(kingID);
    for (let i = 0; i < kinghtMoves.length; i++) {
        let move = [Number(kinghtMoves[i][0]) - 1, Number(kinghtMoves[i][1]) - 1];
        let box = position[move[0]][move[1]];
        if (box === 0) continue;

        let piece = box;

        if (checker.test(piece)) continue;
        let pieceType = piece.toLowerCase();

        if (pieceType === 'n') {
            position[y][x] = type;
            position[Y][X] = deadpiece;
            return false;
        }
    }

    position[y][x] = type;
    position[Y][X] = deadpiece;

    return true;
}

function canEnpassCapture(position, isblack, kingID, id, enpass) {
    let y = Number(id[0]) - 1;
    let x = Number(id[1]) - 1;
    let X = Number(enpass[1]) - 1;
    let Y = Number(enpass[0]) - 1;

    let type = position[y][X];
    position[y][X] = 0;

    let legal = isLegal(position, isblack ? 'p' : 'P', kingID, id, enpass, true, false);

    position[y][X] = type;

    if (legal) return true;
    return false;
}


function kight(id, position, isblack, kingID, isInCheck) {
    let moves = [];
    let captures = {};
    let type = isblack ? 'n' : 'N';
    let y = Number(id[0]) - 1;
    let x = Number(id[1]) - 1;
    let checker = isblack ? /[a-z]/ : /[A-Z]/;
    let isPinned = checkPins(position, id, kingID, isblack);
    
    if (isInCheck && isPinned !== false) return {captures, moves};

    let upRight = y - 2 >= 0 && x + 1 <= 7 ? [y - 2, x + 1] : null;
    let upLeft = y - 2 >= 0 && x - 1 >= 0 ? [y - 2, x - 1] : null;
    let rightUp = y - 1 >= 0 && x + 2 <= 7 ? [y - 1, x + 2] : null;
    let leftUp = y - 1 >= 0 && x - 2 >=0 ? [y - 1, x - 2] : null;
    let downRight = y + 2 <= 7 && x + 1 <= 7 ? [y + 2, x + 1] : null;
    let downLeft = y + 2 <= 7 && x - 1 >= 0 ? [y + 2, x - 1] : null;
    let rightDown = y + 1 <= 7 && x + 2 <= 7 ? [y + 1, x + 2] : null;
    let leftDown = y + 1 <= 7 && x - 2 >= 0 ? [y + 1, x - 2] : null;

    let pos = [upRight, upLeft, rightUp, leftUp, downRight, downLeft, rightDown, leftDown];
    

    for (let i = 0; i < pos.length; i++) {
        if (!pos[i]) continue;
        let box = position[pos[i][0]][pos[i][1]];
        let Box = `${pos[i][0] + 1}${pos[i][1] + 1}`;

        if (box === 0) {
            if (!isLegal(position, type, kingID, id, Box, isInCheck, isPinned)) continue;
            moves.push(Box);
            continue;
        }

        let piece = box;

        if (!checker.test(piece)) {
            if (!isLegal(position, type, kingID, id, Box, isInCheck, isPinned)) continue;
            moves.push(Box);
            captures[Box] = piece;
        }
    }

    return {moves, captures};
}

function rok(id, position, isblack, kingID, isInCheck) {
    let moves = [];
    let captures = {};
    let type = isblack ? 'r' : 'R';
    let y = Number(id[0]) - 1;
    let x = Number(id[1]) - 1;
    let checker = isblack ? /[a-z]/ : /[A-Z]/;

    let blockers = [null, null, null, null];
    let isPinned = checkPins(position, id, kingID, isblack);
    if (isInCheck && isPinned !== false) return {captures, moves};
    for (let i = 1; i < 8; i++) {
        let up = y - i >= 0 ? [y - i, x] : null;
        let down = y + i <= 7 ? [y + i, x] : null;
        let right = x + i <= 7 ? [y, x + i] : null;
        let left = x - i >= 0 ? [y, x - i] : null;

        let pos = [up, down, right, left];

        for (let j = 0; j < pos.length; j++) {
            if (!pos[j] | blockers[j] !== null) continue;
            let box = position[pos[j][0]][pos[j][1]];
            let Box = `${pos[j][0] + 1}${pos[j][1] + 1}`;

            
            if (box === 0) {
                if (!isLegal(position, type, kingID, id, Box, isInCheck, isPinned)) continue;
                moves.push(Box);
                continue;
            }

            let piece = box;

            if (checker.test(piece)) {
                blockers[j] = true;
                continue;
            }

            if (!isLegal(position, type, kingID, id, Box, isInCheck, isPinned)) {
                blockers[j] = true;
                continue;
            }
            captures[Box] = piece;
            moves.push(Box);
            blockers[j] = true;
        }
    }

    return {moves, captures};
}

function bshop(id, position, isblack, kingID, isInCheck) {
    let moves = [];
    let captures = {};
    let type = isblack ? 'b' : 'B';
    let y = Number(id[0]) - 1;
    let x = Number(id[1]) - 1;
    let checker = isblack ? /[a-z]/ : /[A-Z]/;

    let blockers = [null, null, null, null];
    let isPinned = checkPins(position, id, kingID, isblack);
    if (isInCheck && isPinned !== false) return {captures, moves};
    for (let i = 1; i < 8; i++) {
        let up = y - i >= 0 ? [y - i, x] : null;
        let down = y + i <= 7 ? [y + i, x] : null;
        let right = x + i <= 7 ? [y, x + i] : null;
        let left = x - i >= 0 ? [y, x - i] : null;
        let upRight = up && right ? [up[0], right[1]] : null;
        let upLeft = up && left ? [up[0], left[1]] : null;
        let downRight = down && right ? [down[0], right[1]] : null;
        let downLeft = down && left ? [down[0], left[1]] : null;

        let pos = [upRight, upLeft, downRight, downLeft];

        for (let j = 0; j < pos.length; j++) {
            if (!pos[j] | blockers[j] !== null) continue;
            let box = position[pos[j][0]][pos[j][1]];
            let Box = `${pos[j][0] + 1}${pos[j][1] + 1}`;

            
            if (box === 0) {
                if (!isLegal(position, type, kingID, id, Box, isInCheck, isPinned)) continue;
                moves.push(Box);
                continue;
            }

            let piece = box;

            if (checker.test(piece)) {
                blockers[j] = true;
                continue;
            }

            if (!isLegal(position, type, kingID, id, Box, isInCheck, isPinned)) {
                blockers[j] = true;
                continue;
            }
            captures[Box] = piece;
            moves.push(Box);
            blockers[j] = true;
        }
    }

    return {moves, captures};
}

function qeen(id, position, isblack, kingID, isInCheck) {
    let moves = [];
    let captures = {};
    let type = isblack ? 'q' : 'Q';
    let y = Number(id[0]) - 1;
    let x = Number(id[1]) - 1;
    let checker = isblack ? /[a-z]/ : /[A-Z]/;

    let blockers = [null, null, null, null, null, null, null, null];
    let isPinned = checkPins(position, id, kingID, isblack);
    if (isInCheck && isPinned !== false) return {captures, moves};
    for (let i = 1; i < 8; i++) {
        let up = y - i >= 0 ? [y - i, x] : null;
        let down = y + i <= 7 ? [y + i, x] : null;
        let right = x + i <= 7 ? [y, x + i] : null;
        let left = x - i >= 0 ? [y, x - i] : null;
        let upRight = up && right ? [up[0], right[1]] : null;
        let upLeft = up && left ? [up[0], left[1]] : null;
        let downRight = down && right ? [down[0], right[1]] : null;
        let downLeft = down && left ? [down[0], left[1]] : null;

        let pos = [up, down, right, left, upRight, upLeft, downRight, downLeft];

        for (let j = 0; j < pos.length; j++) {
            if (!pos[j] | blockers[j] !== null) continue;
            let box = position[pos[j][0]][pos[j][1]];
            let Box = `${pos[j][0] + 1}${pos[j][1] + 1}`;

            
            if (box === 0) {
                if (!isLegal(position, type, kingID, id, Box, isInCheck, isPinned)) continue;
                moves.push(Box);
                continue;
            }

            let piece = box;

            if (checker.test(piece)) {
                blockers[j] = true;
                continue;
            }

            if (!isLegal(position, type, kingID, id, Box, isInCheck, isPinned)) {
                blockers[j] = true;
                continue;
            }
            captures[Box] = piece;
            moves.push(Box);
            blockers[j] = true;
        }
    }

    return {moves, captures};
}

function pwn(id, position, isblack, kingID, isInCheck, Enpass) {
    let moves = [];
    let captures = {};
    let enpass = null;
    let type = isblack ? 'p' : 'P';
    let y = Number(id[0]) - 1;
    let x = Number(id[1]) - 1;
    let checker = isblack ? /[a-z]/ : /[A-Z]/;

    let isPinned = checkPins(position, id, kingID, isblack);
    if (isInCheck && isPinned !== false) return {captures, moves, enpass};

    let box;
    let up = y - 1 >= 0 && isblack === false ? [y - 1, x] : null;
    let down = y + 1 <= 7 && isblack ? [y + 1, x] : null;
    let right = x + 1 <= 7 ? [y, x + 1] : null;
    let left = x - 1 >= 0 ? [y, x - 1] : null;
    let upRight = up && right ? [up[0], right[1]] : null;
    let upLeft = up && left ? [up[0], left[1]] : null;
    let downRight = down && right ? [down[0], right[1]] : null;
    let downLeft = down && left ? [down[0], left[1]] : null;
    
    if (up) {
        box = position[up[0]][up[1]];
        if (box === 0) {
            let Box = `${up[0] + 1}${up[1] + 1}`
            if (isLegal(position, type, kingID, id, Box, isInCheck, isPinned)) {
                moves.push(Box);
                
            }
            if (y === 6 && position[up[0] - 1][up[1]] === 0) {
                    //box = position[up[0] - 1][up[1]];
                    Box = `${up[0]}${up[1] + 1}` 
                    if (isLegal(position, type, kingID, id, Box, isInCheck, isPinned)) {
                        moves.push(Box);
                        enpass = Box;
                    }
                }
        }
    } 

    if (down) {
        box = position[down[0]][down[1]];
        let Box = `${down[0] + 1}${down[1] + 1}`
        if (box === 0) {
            if (isLegal(position, type, kingID, id, Box, isInCheck, isPinned)) {
                moves.push(Box);
                
                
            }
            if (y === 1 && position[down[0] + 1][down[1]] === 0) {
                    //box = position[down[0] + 1][down[1]];
                    Box = `${down[0] + 2}${down[1] + 1}`
                    if (isLegal(position, type, kingID, id, Box, isInCheck, isPinned)) {
                        moves.push(Box);
                        enpass = Box;
                    }
                }
        }
    }

    let pos = [upRight, upLeft, downLeft, downRight];

    for (let i = 0; i < pos.length; i++) {
        if (!pos[i]) continue;
        let box = position[pos[i][0]][pos[i][1]]; 
        let Box = `${pos[i][0] + 1}${pos[i][1] + 1}`

        if (Enpass !== null && Box === Enpass) {
            if (canEnpassCapture(position, isblack, kingID, id, Enpass)) {
                moves.push(Enpass);
                captures[Enpass] = isblack ? 'P' : 'p';
            }
        }

        if (box === 0) continue;

        if (!checker.test(box)) {
            if (!isLegal(position, type, kingID, id, Box, isInCheck, isPinned)) continue;
            moves.push(Box);
            captures[Box] = box;
        }
    }

    return {moves, captures, enpass};
}

function kng(id, position, isblack, kingID, isInCheck, castle) {
    let moves = [];
    let captures = {};
    let castleR = null;
    let castleL = null;
    let type = isblack ? 'k' : 'K';
    let y = Number(id[0]) - 1;
    let x = Number(id[1]) - 1;
    let checker = isblack ? /[a-z]/ : /[A-Z]/;

    let up = y - 1 >= 0 ? [y - 1, x] : null;
    let down = y + 1 <= 7 ? [y + 1, x] : null;
    let right = x + 1 <= 7 ? [y, x + 1] : null;
    let left = x - 1 >= 0 ? [y, x - 1] : null;
    let upRight = up && right ? [up[0], right[1]] : null;
    let upLeft = up && left ? [up[0], left[1]] : null;
    let downRight = down && right ? [down[0], right[1]] : null;
    let downLeft = down && left ? [down[0], left[1]] : null;

    let pos = [up, down, right, left, upRight, upLeft, downRight, downLeft];

    for (let j = 0; j < pos.length; j++) {
        if (!pos[j]) continue;
        let box = position[pos[j][0]][pos[j][1]];
        let Box = `${pos[j][0] + 1}${pos[j][1] + 1}`;

        
        if (box === 0) {
            if (!isLegal(position, type, kingID, id, Box, isInCheck, true)) continue;
            moves.push(Box);
            continue;
        }

        let piece = box;

        if (checker.test(piece)) {
            continue;
        }
        
        if (!isLegal(position, type, kingID, id, Box, isInCheck, true)) continue;
        captures[Box] = piece;
        moves.push(Box);
    }
    
    if (!castle | isInCheck) {return {moves, captures, castleL, castleR}};

    if (isblack) {
        if (castle.r && moves.indexOf("16") !== -1 && position[0][6] === 0) {
            if (isLegal(position, type, kingID, id, "17", isInCheck, true)) {
                moves.push("17");
                castleR = "17";
            }
        }

        if (castle.l && moves.indexOf("14") !== -1 && position[0][2] === 0 && position[0][1] === 0) {
            if (isLegal(position, type, kingID, id, "13", isInCheck, true)) {
                moves.push("13");
                castleL = "13";
            }
        }
    } else {
        if (castle.r && moves.indexOf("86") !== -1 && position[7][6] === 0) {
            if (isLegal(position, type, kingID, id, "87", isInCheck, true)) {
                moves.push("87");
                castleR = "87";
            }
        }

        if (castle.l && moves.indexOf("84") !== -1 && position[7][2] === 0 && position[7][1] === 0) {
            if (isLegal(position, type, kingID, id, "83", isInCheck, true)) {
                moves.push("83");
                castleL = "83";
            }
        } 
    }

    return {moves, captures, castleL, castleR};
}