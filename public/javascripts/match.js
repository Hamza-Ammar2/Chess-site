let list = location.href.split("/");

let mode = list[list.length - 2];
console.log(mode);
const waiting = document.getElementById("waiting");
const resign = document.getElementById("resign");
const draw = document.getElementById("draw");
const body = document.getElementById("cont");
const declinedDraw = document.getElementById("declined-draw");
const end = document.getElementById("end");
const acceptDraw = document.getElementById("accept-draw");
const right = document.getElementById("right");
const left = document.getElementById("left");
const t1 = document.getElementById("t1");
const t2 = document.getElementById("t2");
const opts = document.getElementById("opts");
const Close = document.getElementById("close");
let player1;
let player2;
end.style.zIndex = "10";
end.style.width = 0;
end.style.height = 0;
end.style.backgroundColor = "transparent";
end.style.border = "none";
const socket = io(location.origin);
let isblack;
socket.on('connect', () => {
    if (canvas.dataset.user !== "null") socket.emit('set-user', JSON.parse(canvas.dataset.user));
    socket.emit('make-match', mode);
    console.log("huh")
});


function display(message) {
    end.firstChild.style.display = "block";
    Close.style.display = "block";
    end.style.width = null;
    end.style.height = null;
    end.style.border = null;
    end.style.backgroundColor = null;
    end.getElementsByTagName('h4')[0].style.display = "block";
    end.getElementsByTagName('h4')[0].innerText = message;
    end.lastChild.style.display = "block";
    end.lastChild.firstChild.style.display = "block";
    end.style.display = "block";
}


socket.on('isblack', is => isblack = is);

socket.on('match-found', players => {
    console.log(players);
    resign.style.display = "block";
    draw.style.display = "block";
    player1 = players.player1;
    player2 = players.player2;
    canvas.style.display = "block";
    t1.style.display = "block";
    t2.style.display = "block";
    waiting.remove();
    console.log(isblack);
    game = new Board(isblack);
    animate();
});

socket.on('move', move => {
    console.log(move);

    if (move.piece) {
        let oldID = game.pieces[move.index].id;
        
        console.log(move.piece);
        game.turn = !game.turn;
        let id = move.piece.id;
        if (game.boxes[Number(id[0]) - 1][Number(id[1]) - 1].piece !== null) {
            game.pieces.forEach(piece => {
                if (piece.id === game.boxes[Number(id[0]) - 1][Number(id[1]) - 1].id) piece.dead = true;
            });
        }
        game.boxes[Number(oldID[0]) - 1][Number(oldID[1]) - 1].piece = null; 
        game.promo(move.index, move.piece);
        game.boxes[Number(id[0]) - 1][Number(id[1]) - 1].piece = move.piece.type; 
        game.addPos();
        return;
    }

    game.held_piece_index = move.index;
    let box = game.boxes[Number(move.id[0]) - 1][Number(move.id[1]) - 1];

    game.checkBoxes({
        x: box.x + 5,
        y: box.y + 5
    })
});


socket.on('time', time => {
    let times = [time.whiteTime, time.blackTime];
    let newTimes = [];
    //console.log(player1, player2)
    times.forEach(time => {
        let mins = time/60;
        let secs = 0;
        if (/[.]/.test(String(mins))) {
            mins = Number(String(mins).split(".")[0]);
            secs = time - mins*60;
        }
        mins = String(mins).length > 1 ? String(mins) : "0" + String(mins);
        secs = String(secs).length > 1 ? String(secs) : "0" + String(secs);

        time = mins + ":" + secs;

        newTimes.push(time);
    });

    newTimes[0] = player1 + " " + newTimes[0];
    newTimes[1] = player2 + " " + newTimes[1]
    
    t1.innerText = isblack ? newTimes[0] : newTimes[1];
    t2.innerText = isblack ? newTimes[1]: newTimes[0];
});


socket.on('white-abandoned', () => {
    socket.emit('white-abandoned', JSON.stringify(game.positions));
    game.end = true;
    display(`${player1 + " (white)"} abandoned game ${player2 + " (black)"} wins`);
});



socket.on('black-abandoned', () => {
    socket.emit('black-abandoned', JSON.stringify(game.positions));
    game.end = true;
    display(`${player2 + " (black)"} abandoned game ${player1 + " (white)"} wins`);
});




socket.on('white-wins', () => {
    game.end = true;
    display(`${player1 + " (white)"} wins by checkmate`);
});

socket.on('black-wins', () => {
    game.end = true;
    display(`${player2 + " (black)"} wins by checkmate`);
});


socket.on('offer-draw', () => {
    acceptDraw.style.display = "block";
});

socket.on('decline-draw', () => {
    declinedDraw.style.display = "block";
});


socket.on('accept-draw', () => {
    game.end = true;
    display(`Draw`);
});


socket.on('white-timeout', () => {
    socket.emit('white-timeout', JSON.stringify(game.positions));
    game.end = true;
    display(`${player2 + " (black)"} wins by timeout`);
});


socket.on('black-timeout', () => {
    socket.emit('black-timeout', JSON.stringify(game.positions));
    game.end = true;
    display(`${player1 + " (white)"} wins by timeout`);
});


socket.on('resign-white', () => {
    game.end = true;
    display(`${player1 + " (white)"} resigns ${player2 + " (black)"} wins`);
});



socket.on('resign-black', () => {
    game.end = true;
    display(`${player2 + " (black)"} resigns ${player1 + " (white)"} wins`);
});



// BUTTON EVENTS


Close.addEventListener('click', () => {
    console.log("huh");
    end.style.display = "none";
    end.style.zIndex = "-1";
    Close.style.display = "none";
    game.end = false;
    game.islocal = true;
    opts.style.display = "block";
    left.style.display = "block";
    right.style.display = "block";
    resign.style.display = "none";
    draw.style.display = "none";
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






resign.addEventListener('click', () => {
    if (game.end) return;
    game.end = true;
    display(`${isblack ? player1 + " (white)" : player2 + " (black)"} wins by resignation`);
    if (isblack) socket.emit('resign-black', JSON.stringify(game.positions));
    if (isblack === false) socket.emit('resign-white', JSON.stringify(game.positions));
});

draw.addEventListener('click', () => {
    if (game.end) return;
    socket.emit('offer-draw');
});

acceptDraw.addEventListener('click', () => {
    if (game.end) return;
    display(`Draw`); 
    socket.emit('accept-draw', JSON.stringify(game.positions));
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
    if (!game) return;
    if (game.hold === null) return;
    const target = e.target;

    // Get the bounding rectangle of target
    const rect = target.getBoundingClientRect();

    // Mouse position
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    if (acceptDraw.style.display === "block") {
        acceptDraw.display = "none";
        socket.emit('decline-draw');
    }

    if (declinedDraw.style.display === "block") {
        declinedDraw.style.display = "none";
    }

    game.held_piece_index = game.hold;
    game.pieces[game.hold].held = false;
    game.hold = null;


    game.checkBoxes({x, y}, (id, index) => {
        let switchedID = String(9 - Number(id[0])) + String(9 - Number(id[1]));
        if (isblack) socket.emit('black-move', {id: id, index: index});
        if (isblack === false) socket.emit('white-move', {id: switchedID, index: index});
    }, (turn) => {
        if (game.end) return;
        game.end = true;
        display(`${turn ? player2 + " (black)" : player1 + " (white)"} wins by checkmate`);

        isblack ? socket.emit('black-wins', JSON.stringify(game.positions)) : socket.emit('white-wins', JSON.stringify(game.positions));
    });
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

    game.doPromote({x, y}, (index, piece) => {
        let switchedID = String(9 - Number(piece.id[0])) + String(9 - Number(piece.id[1]));
        let oldID = piece.id;
        //piece.id = switchedID
        if (isblack) socket.emit('black-move', {piece: piece, index: index});
        //piece.id = switchedID;
        if (isblack === false) socket.emit('white-move', {piece, index: index});
    });
});