const canvases = [...document.querySelectorAll(".ca")];
let width = 300;
let height = 300;
let boxArea = width/8;


let board = [
    ["11", "12", "13", "14", "15", "16", "17", "18"],
    ["21", "22", "23", "24", "25", "26", "27", "28"],
    ["31", "32", "33", "34", "35", "36", "37", "38"],
    ["41", "42", "43", "44", "45", "46", "47", "48"],
    ["51", "52", "53", "54", "55", "56", "57", "58"],
    ["61", "62", "63", "64", "65", "66", "67", "68"],
    ["71", "72", "73", "74", "75", "76", "77", "78"],
    ["81", "82", "83", "84", "85", "86", "87", "88"]
];

let boxes = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
];

let pieces = [];



for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
        let isblack = true;
        if ( (i+j) % 2 > 0) {isblack = false;}
        boxes[i][j] = new Box(boxArea, {x: j, y: i}, board[i][j], isblack);
    }
}

canvases.forEach(canvas => {
    const ctx = canvas.getContext('2d');
    canvas.height = height;
    canvas.width = width;
    boxes.forEach(row => {
        row.forEach(box => {
            if (box.isblack === false) {
                ctx.fillStyle = "white";
            } else ctx.fillStyle = "brown";
            ctx.fillRect(box.x, box.y, box.height, box.height);
            ctx.fillStyle = "black";
        });
    });

    let thumbnail = JSON.parse(canvas.dataset.positions);
    let final = thumbnail[thumbnail.length - 1].pos;
    let finalPos = final.split(",").slice(0, -1);

    finalPos.forEach(pos => {
        let type = pos[0];
        let isblack = /[a-z]/.test(type);
        let y = Number(pos[1]);
        let x = Number(pos[2]);
        
        pieces.push(new Piece(type, isblack, {y, x}, boxArea, String(y) + String(x), boxes, false, 0.8*boxArea));
    });


    pieces.forEach(piece => {
        piece.image.onload = function () {ctx.drawImage(piece.image, piece.x, piece.y, piece.height, piece.height);}
    });
    pieces = [];
});