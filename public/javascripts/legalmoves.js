function knight(id, boxes, isblack) {
    let moves = [];
    let values = id.split("");
    let y = Number(values[0]);
    let x = Number(values[1]);
    if (y + 2 <= 8 && x + 1 <= 8) {
        if (boxes[y + 1][x].piece !== null) {
            let checker = new RegExp(boxes[y + 1][x].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) moves.push(String(y+2) + String(x+1));
            } else if (/[a-z]/.test(checker)) moves.push(String(y+2) + String(x+1));


        } else moves.push(String(y+2) + String(x+1));
    }
    if (y+ 2 <= 8 && x - 1 >= 1) {
        if (boxes[y + 1][x - 2].piece !== null) {
            let checker = new RegExp(boxes[y + 1][x - 2].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) moves.push(String(y+2) + String(x-1));
            } else if (/[a-z]/.test(checker)) moves.push(String(y+2) + String(x-1));

        } else moves.push(String(y+2) + String(x-1));
    }
    if (y - 2 >= 1 && x + 1 <= 8) {
        if (boxes[y - 3][x].piece !== null) {
            let checker = new RegExp(boxes[y - 3][x].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) moves.push(String(y-2) + String(x+1));
            } else if (/[a-z]/.test(checker)) moves.push(String(y-2) + String(x+1));

        } else moves.push(String(y-2) + String(x+1));
    }
    if (y - 2 >= 1 && x - 1 >= 1) {
        if (boxes[y - 3][x - 2].piece !== null) {
            let checker = new RegExp(boxes[y - 3][x - 2].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) moves.push(String(y-2) + String(x-1));
            } else if (/[a-z]/.test(checker)) moves.push(String(y-2) + String(x-1));

        } else moves.push(String(y-2) + String(x-1));
    }
    if (y + 1 <= 8 && x + 2 <= 8) {
        if (boxes[y][x + 1].piece !== null) {
            let checker = new RegExp(boxes[y][x + 1].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) moves.push(String(y+1) + String(x+2));
            } else if (/[a-z]/.test(checker)) moves.push(String(y+1) + String(x+2)); 

        } else moves.push(String(y+1) + String(x+2));
    }
    if (y-1 >= 1 && x + 2 <= 8) {
        if (boxes[y - 2][x + 1].piece !== null) {
            let checker = new RegExp(boxes[y - 2][x + 1].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) moves.push(String(y-1) + String(x+2));
            } else if (/[a-z]/.test(checker)) moves.push(String(y-1) + String(x+2));

        } else moves.push(String(y-1) + String(x+2));
    }
    if (y + 1 <= 8 && x - 2 >= 1) {
        if (boxes[y][x - 3].piece !== null) {
            let checker = new RegExp(boxes[y][x - 3].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) moves.push(String(y+1) + String(x-2));
            } else if (/[a-z]/.test(checker)) moves.push(String(y+1) + String(x-2));

        } else moves.push(String(y+1) + String(x-2));
    }
    if (y - 1 >= 1 && x - 2 >= 1) {
        if (boxes[y - 2][x - 3].piece !== null) {
            let checker = new RegExp(boxes[y - 2][x - 3].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) moves.push(String(y-1) + String(x-2));
            } else if (/[a-z]/.test(checker)) moves.push(String(y-1) + String(x-2));

        } else moves.push(String(y-1) + String(x-2));
    }

    return moves;
}

function bishop(id, boxes, isblack) {
    let moves = [];
    let values = id.split("");
    let y = Number(values[0]);
    let x = Number(values[1]);
    let distY = 8 - y;
    let distX = 8 - x;
    for (let i = 1; i < Math.min(distX,distY) + 1; i++) {
        if (y - 1 + i > 7 | x - 1 + i > 7) break;

        if (boxes[y - 1 + i][x - 1 + i].piece !== null) {
            let checker = new RegExp(boxes[y - 1 + i][x - 1 + i].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) {
                    moves.push(String(y+i) + String(x+i));
                }
            } else if (/[a-z]/.test(checker)) {
                moves.push(String(y+i) + String(x+i));
            }
            
            break;
        }
        moves.push(String(y+i) + String(x+i));
    }
    for (let i = 1; i < Math.min(x,y) + 1; i++) {
        if (y - i - 1 < 0 | x - i - 1 < 0) break;

        if (boxes[y - i - 1][x - i - 1].piece !== null) {
            let checker = new RegExp(boxes[y - i - 1][x - i - 1].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) {
                    moves.push(String(y-i) + String(x-i));
                }
            } else if (/[a-z]/.test(checker)) {
                moves.push(String(y-i) + String(x-i));
            }
            
            break;
        }
        moves.push(String(y-i) + String(x-i));
    }
    for (let i = 1; i < Math.min(distY, x) + 1; i++) {
        if (y - 1 + i > 7 | x - 1 - i < 0) break;

        if (boxes[y - 1 + i][x - i - 1].piece !== null) {
            let checker = new RegExp(boxes[y - 1 + i][x - i - 1].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) {
                    moves.push(String(y+i) + String(x-i));
                }
            } else if (/[a-z]/.test(checker)) {
                moves.push(String(y+i) + String(x-i));
            }

            break;
        }
        moves.push(String(y+i) + String(x-i));
    }
    for (let i = 1; i < Math.min(distX, y) + 1; i++) {
        if (y - 1 - i < 0 | x + i - 1 > 7) break;

        if (boxes[y - 1 - i][ x + i - 1].piece !== null) {
            let checker = new RegExp(boxes[y - 1 - i][ x + i - 1].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) {
                    moves.push(String(y-i) + String(x+i));
                }
            } else if (/[a-z]/.test(checker)) {
                moves.push(String(y-i) + String(x+i));
            }

            break;
        }
        moves.push(String(y-i) + String(x+i));
    }

    return moves;
}

function rook(id, boxes, isblack) {
    let moves = [];
    let values = id.split("");
    let y = Number(values[0]);
    let x = Number(values[1]);
    for (let i = 1; i < 9 - x; i++) {
        if (boxes[y-1][x - 1 + i].piece !== null) {
            let checker = new RegExp(boxes[y-1][x - 1 + i].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) {
                    moves.push(String(y) + String(x+i));
                }
            } else if (/[a-z]/.test(checker)) {
                moves.push(String(y) + String(x+i));
            }

            break;
        }
        moves.push(String(y) + String(x+i));
    }
    for (let i = x - 1; i > 0; i--) {
        if (boxes[y - 1][i - 1].piece !== null) {
            let checker = new RegExp(boxes[y - 1][i - 1].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) {
                    moves.push(String(y) + String(i));
                }
            } else if (/[a-z]/.test(checker)) {
                moves.push(String(y) + String(i));
            }

            break;
        }

        moves.push(String(y) + String(i));
    }
    for (let i = 1; i < 9 - y; i++) {
        if (boxes[y - 1 + i][x - 1].piece !== null) {
            let checker = new RegExp(boxes[y - 1 + i][x - 1].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) {
                    moves.push(String(y + i) + String(x));
                }
            } else if (/[a-z]/.test(checker)) {
                moves.push(String(y + i) + String(x));
            }

            break;
        }
        moves.push(String(y + i) + String(x));
    }
    for (let i = y - 1; i > 0; i--) {
        if (boxes[i - 1][x - 1].piece !== null) {
            let checker = new RegExp(boxes[i - 1][x - 1].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) {
                    moves.push(String(i) + String(x));
                }
            } else if (/[a-z]/.test(checker)) {
                moves.push(String(i) + String(x));
            }

            break;
        } 
        moves.push(String(i) + String(x));
    }

    return moves;
}

function queen(id, boxes, isblack) {
    let moves = [];
    let values = id.split("");
    let y = Number(values[0]);
    let x = Number(values[1]);
    let distY = 8 - y;
    let distX = 8 - x;

    // ROOOK PART
    for (let i = 1; i < 9 - x; i++) {
        if (boxes[y-1][x - 1 + i].piece !== null) {
            let checker = new RegExp(boxes[y-1][x - 1 + i].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) {
                    moves.push(String(y) + String(x+i));
                }
            } else if (/[a-z]/.test(checker)) {
                moves.push(String(y) + String(x+i));
            }

            break;
        }
        moves.push(String(y) + String(x+i));
    }
    for (let i = x - 1; i > 0; i--) {
        if (boxes[y - 1][i - 1].piece !== null) {
            let checker = new RegExp(boxes[y - 1][i - 1].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) {
                    moves.push(String(y) + String(i));
                }
            } else if (/[a-z]/.test(checker)) {
                moves.push(String(y) + String(i));
            }

            break;
        }

        moves.push(String(y) + String(i));
    }
    for (let i = 1; i < 9 - y; i++) {
        if (boxes[y - 1 + i][x - 1].piece !== null) {
            let checker = new RegExp(boxes[y - 1 + i][x - 1].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) {
                    moves.push(String(y + i) + String(x));
                }
            } else if (/[a-z]/.test(checker)) {
                moves.push(String(y + i) + String(x));
            }

            break;
        }
        moves.push(String(y + i) + String(x));
    }
    for (let i = y - 1; i > 0; i--) {
        if (boxes[i - 1][x - 1].piece !== null) {
            let checker = new RegExp(boxes[i - 1][x - 1].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) {
                    moves.push(String(i) + String(x));
                }
            } else if (/[a-z]/.test(checker)) {
                moves.push(String(i) + String(x));
            }

            break;
        } 
        moves.push(String(i) + String(x));
    }

    // BISHOP PART


    for (let i = 1; i < Math.min(distX,distY) + 1; i++) {
        if (y - 1 + i > 7 | x - 1 + i > 7) break;

        if (boxes[y - 1 + i][x - 1 + i].piece !== null) {
            let checker = new RegExp(boxes[y - 1 + i][x - 1 + i].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) {
                    moves.push(String(y+i) + String(x+i));
                }
            } else if (/[a-z]/.test(checker)) {
                moves.push(String(y+i) + String(x+i));
            }
            
            break;
        }
        moves.push(String(y+i) + String(x+i));
    }
    for (let i = 1; i < Math.min(x,y) + 1; i++) {
        if (y - i - 1 < 0 | x - i - 1 < 0) break;

        if (boxes[y - i - 1][x - i - 1].piece !== null) {
            let checker = new RegExp(boxes[y - i - 1][x - i - 1].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) {
                    moves.push(String(y-i) + String(x-i));
                }
            } else if (/[a-z]/.test(checker)) {
                moves.push(String(y-i) + String(x-i));
            }
            
            break;
        }
        moves.push(String(y-i) + String(x-i));
    }
    for (let i = 1; i < Math.min(distY, x) + 1; i++) {
        if (y - 1 + i > 7 | x - 1 - i < 0) break;

        if (boxes[y - 1 + i][x - i - 1].piece !== null) {
            let checker = new RegExp(boxes[y - 1 + i][x - i - 1].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) {
                    moves.push(String(y+i) + String(x-i));
                }
            } else if (/[a-z]/.test(checker)) {
                moves.push(String(y+i) + String(x-i));
            }

            break;
        }
        moves.push(String(y+i) + String(x-i));
    }
    for (let i = 1; i < Math.min(distX, y) + 1; i++) {
        if (y - 1 - i < 0 | x + i - 1 > 7) break;

        if (boxes[y - 1 - i][ x + i - 1].piece !== null) {
            let checker = new RegExp(boxes[y - 1 - i][ x + i - 1].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) {
                    moves.push(String(y-i) + String(x+i));
                }
            } else if (/[a-z]/.test(checker)) {
                moves.push(String(y-i) + String(x+i));
            }

            break;
        }
        moves.push(String(y-i) + String(x+i));
    }

    return moves;
}

function pawn(id, boxes, isblack) {
    let moves = [];
    let attack = []
    let enpass = [];
    let values = id.split("");
    let y = Number(values[0]);
    let x = Number(values[1]);

    if (isblack && y + 1 <= 8) {
        if (boxes[y][x - 1].piece === null) {
            moves.push(String(y+1) + String(x));
            if (y === 2 && boxes[y+1][x-1].piece === null && y === 2) {
                moves.push(String(y+2) + String(x));
                enpass.push(String(y+2) + String(x));
            }
        }

        if (x - 1 >= 1 && y + 1 <= 8 && boxes[y][x - 2].piece !== null) {
            let checker = new RegExp(boxes[y][x - 2].piece);
            if (/[A-Z]/.test(checker)) {
                moves.push(String(y+1) + String(x-1));
                attack.push(String(y+1) + String(x-1))
            }
        } else if (x - 1 >= 1 && y + 1 <= 8 && boxes[y][x - 2].enpass !== null) {
            moves.push(String(y+1) + String(x-1));
        }

        if (x + 1 <= 8 && y + 1 <= 8 && boxes[y][x].piece !== null) {
            let checker = new RegExp(boxes[y][x].piece);
            if (/[A-Z]/.test(checker)) {
                moves.push(String(y+1) + String(x+1));
                attack.push(String(y+1) + String(x+1));
            }
        } else if (x + 1 <= 8 && y + 1 <= 8 && boxes[y][x].enpass !== null) {
            moves.push(String(y+1) + String(x+1));
        }
    } else if (y - 1 >= 1 && isblack === false) {
        if (boxes[y - 2][x - 1].piece === null) {
            moves.push(String(y-1) + String(x));
            if (y === 7 && boxes[y - 3][x-1].piece === null && y === 7) {
                moves.push(String(y-2) + String(x));
                enpass.push(String(y-2) + String(x));
            }
        }

        if (x - 1 >= 1 && y - 1 >= 1 && boxes[y - 2][x - 2].piece !== null) {
            let checker = new RegExp(boxes[y - 2][x - 2].piece);
            if (/[a-z]/.test(checker)) {
                moves.push(String(y-1) + String(x-1));
                attack.push(String(y-1) + String(x-1));
            }
        } else if (x - 1 >= 1 && y - 1 >= 1 && boxes[y - 2][x - 2].enpass !== null) {
            moves.push(String(y-1) + String(x-1));
        }

        if (x + 1 <= 8 && y - 1 >= 1 && boxes[y - 2][x].piece !== null) {
            let checker = new RegExp(boxes[y - 2][x].piece);
            if (/[a-z]/.test(checker)) {
                moves.push(String(y-1) + String(x+1));
                attack.push(String(y-1) + String(x+1));
            }
        } else if (x + 1 <= 8 && y - 1 >= 1 && boxes[y - 2][x].enpass !== null) {
            moves.push(String(y-1) + String(x+1));
        }
    }
    moves.push(enpass);
    moves.push(attack);

    return moves;
}

function king(id, boxes, isblack) {
    let moves = [];
    let values = id.split("");
    let y = Number(values[0]);
    let x = Number(values[1]);

    if (y + 1 <= 8) {
        if (boxes[y][x - 1].piece !== null) {
            let checker = new RegExp(boxes[y][x - 1].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) moves.push(String(y+1) + String(x));
            } else if (/[a-z]/.test(checker)) moves.push(String(y+1) + String(x));
        } else moves.push(String(y+1) + String(x));
    }

    if (y - 1 >= 1) {
        if (boxes[y - 2][x - 1].piece !== null) {
            let checker = new RegExp(boxes[y - 2][x - 1].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) moves.push(String(y-1) + String(x));
            } else if (/[a-z]/.test(checker)) moves.push(String(y-1) + String(x));
        } else moves.push(String(y-1) + String(x));
    }

    if (x + 1 <= 8) {
        if (boxes[y - 1][x].piece !== null) {
            let checker = new RegExp(boxes[y - 1][x].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) moves.push(String(y) + String(x+1));
            } else if (/[a-z]/.test(checker)) moves.push(String(y) + String(x+1));
        } else moves.push(String(y) + String(x+1));
    }

    if (x - 1 >= 1) {
        if (boxes[y - 1][x - 2].piece !== null) {
            let checker = new RegExp(boxes[y - 1][x - 2].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) moves.push(String(y) + String(x-1));
            } else if (/[a-z]/.test(checker)) moves.push(String(y) + String(x-1));
        } else moves.push(String(y) + String(x-1));
    }

    if (y + 1 <= 8 && x + 1 <= 8) {
        if (boxes[y][x].piece !== null) {
            let checker = boxes[y][x].piece;
            
            if (isblack) {
                if (/[A-Z]/.test(checker)) moves.push(String(y+1) + String(x+1));
            } else if (/[a-z]/.test(checker)) moves.push(String(y+1) + String(x+1));
        } else moves.push(String(y+1) + String(x+1));
    }

    if (y - 1 >= 1 && x - 1 >= 1) {
        if (boxes[y - 2][x - 2].piece !== null) {
            let checker = new RegExp(boxes[y - 2][x - 2].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) moves.push(String(y-1) + String(x-1));
            } else if (/[a-z]/.test(checker)) moves.push(String(y-1) + String(x-1));
        } else moves.push(String(y-1) + String(x-1));
    }

    if (y - 1 >= 1 && x + 1 <= 8) {
        if (boxes[y - 2][x].piece !== null) {
            let checker = new RegExp(boxes[y - 2][x].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) moves.push(String(y-1) + String(x+1));
            } else if (/[a-z]/.test(checker)) moves.push(String(y-1) + String(x+1));
        } else moves.push(String(y-1) + String(x+1));
    }

    if (y + 1 <= 8 && x - 1 >= 1) {
        if (boxes[y][x - 2].piece !== null) {
            let checker = new RegExp(boxes[y][x - 2].piece);

            if (isblack) {
                if (/[A-Z]/.test(checker)) moves.push(String(y+1) + String(x-1));
            } else if (/[a-z]/.test(checker)) moves.push(String(y+1) + String(x-1));
        } else moves.push(String(y+1) + String(x-1));
    }

    return moves;
}