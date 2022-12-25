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

game = new Board(false, true);
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