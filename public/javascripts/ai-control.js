const flip = document.getElementById("flip");
const end = document.getElementById("end");
const t1 = document.getElementById("t1");
const t2 = document.getElementById("t2");
const right = document.getElementById("right");
const left = document.getElementById("left");
const Close = document.getElementById("close");
end.style.zIndex = "10";
end.style.width = 0;
end.style.height = 0;
end.style.backgroundColor = "transparent";
end.style.border = "none";

let playerturn = false;

game = new Board(false, true);
const opponent = new Brain(true);
animate();


Close.addEventListener('click', () => {
    game.end = false;
    end.style.zIndex = "-1";
    end.style.display = "none";
});


end.lastChild.addEventListener('click', () => {
    location.reload();
});


flip.addEventListener('click', () => {
    game.switch();
    let T1 = t1.innerText;
    let T2 = t2.innerText;
    t1.innerText = T2;
    t2.innerText = T1;
});


left.addEventListener('click', () => {
    if (game.branched) {
        if (game.branchIndex > 0) {
            game.renderPos(game.branchIndex - 1);
        } else {
            game.branched = false;
            game.branchIndex = null;
            game.branch = [];
            game.renderPos(game.currentPosIndex);
        }
    } else {
        if (game.currentPosIndex > 0) game.renderPos(game.currentPosIndex - 1);
    }
});


right.addEventListener('click', () => {
    if (game.branched) {
        if (game.branchIndex < game.branch.length - 1) game.renderPos(game.branchIndex + 1);
    } else {
        if (game.currentPosIndex < game.positions.length - 1) game.renderPos(game.currentPosIndex + 1);
    }
});




// MOUSE EVENTS

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

    if (game.hold === null) return;
    game.pieces[game.hold].move({x, y});

});


canvas.addEventListener('mouseup', e => {
    if (game.pieces[game.hold].isblack !== playerturn) {
        game.pieces[game.hold].update(game.pieces[game.hold].id);
        game.hold = null;
        return;
    }
    if (!game) return;
    if (game.hold === null) return;
    const target = e.target;

    // Get the bounding rectangle of target
    const rect = target.getBoundingClientRect();

    // Mouse position
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;


    game.held_piece_index = game.hold;
    game.pieces[game.hold].held = false;
    game.hold = null;

    game.checkBoxes({x, y}, null, (turn) => {
        game.end = true;
        end.firstChild.style.display = "block";
        end.style.width = null;
        end.style.height = null;
        end.style.border = null;
        end.style.backgroundColor = null;
        end.getElementsByTagName('h4')[0].style.display = "block";
        end.getElementsByTagName('h4')[0].innerText = `${turn ? "Black" : "White"} wins`;
        end.lastChild.style.display = "block";
        end.style.display = "block";
        Close.style.display = "block";
        end.style.zIndex = "10";
    });

    //if (dropped && counter !== 0) {
        let castle = game.getCastleStatus();
        let move = opponent.makeMove(opponent.board2Pos(posFromPieces(game.pieces)), !opponent.isblack, game.enpass, castle)

        if (!move) return console.log("fuck")
        let ids = move.move.split(",");
        let newID = ids[1].length > 2 ? ids[1].slice(1) : ids[1];
        let box = game.boxes[Number(newID[0]) - 1][Number(newID[1]) - 1];
        game.held_piece_index = game.getIFI(ids[0].slice(1));

        game.checkBoxes({x: box.x + 5, y: box.y + 5}, null, (turn) => {
            game.end = true;
            end.firstChild.style.display = "block";
            end.style.width = null;
            end.style.height = null;
            end.style.border = null;
            end.style.backgroundColor = null;
            end.getElementsByTagName('h4')[0].style.display = "block";
            end.getElementsByTagName('h4')[0].innerText = `${turn ? "Black" : "White"} wins`;
            end.lastChild.style.display = "block";
            end.style.display = "block";
            Close.style.display = "block";
            end.style.zIndex = "10";
        }, box.id);
    //}
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




function posFromPieces(pieces) {
    let pos = [];
    for (let i = 0; i < 8; i++){
        let row = []
        for (let j = 0; j < 8; j++) {
            row.push(0);
        }
        pos.push(row);
    }

    for (let g = 0; g < pieces.length; g++) {
        let piece = pieces[g];
        if (piece.dead) continue;
        let i = Number(piece.id[0]) - 1;
        let j = Number(piece.id[1]) - 1;

        pos[i][j] = piece.type;
    }
    return pos;
}