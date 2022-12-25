//const canvas = document.querySelector("canvas");
//const ctx = canvas.getContext('2d');

class Piece {
    constructor(type, isblack, pos, height, id, boxes, perspective, hit) {
        this.perspective = perspective;
        this.type = type;
        this.boxHeight = height;
        this.isblack = isblack;
        this.held = false;
        this.height = hit ? hit : 40;
        this.x = (pos.x - 1)*this.boxHeight + this.boxHeight/2 - this.height/2;
        this.y = (pos.y - 1)*this.boxHeight + this.boxHeight/2 - this.height/2;
        if (this.perspective) {
            this.x = (7 - (pos.x - 1))*this.boxHeight + this.boxHeight/2 - this.height/2;
            this.y = (7 - (pos.y - 1))*this.boxHeight + this.boxHeight/2 - this.height/2;
        }
        this.id = id; 
        this.prefex = "";
        if (this.isblack === false) this.prefex = "w";
        this.image = new Image();
        this.image.src = "/assets/" + this.prefex + this.type + ".png";

        this.func = type === "n" | type === "N" ? knight : type === "q" | type === "Q" ? queen : type === "r" | type === "R" ? rook : type === "b" | type === "B" ? bishop : type === "k" | type === "K" ? king : type === "p" | type === "P" ? pawn : null;
        this.moves = this.func(id, boxes, this.isblack);
        this.dead = false;
        
    }  
    

    draw() {
        if (this.dead) return;
        ctx.drawImage(this.image, this.x, this.y, this.height, this.height);
    }

    update(id) {
        if (this.dead) return;
        let values = id.split("");
        let y = Number(values[0]) - 1;
        let x = Number(values[1]) - 1;
        this.id = id;

        if (this.held) return;
        
        if (this.perspective) {
            y = 7 - y;
            x = 7 - x;
        }
        

        this.x = x*this.boxHeight + this.boxHeight/2 - this.height/2;
        this.y = y*this.boxHeight + this.boxHeight/2 - this.height/2;
        
        this.draw();
    }

    isTarget(pos) {
        if (this.dead) return false;
        if (pos.x > this.x && pos.x < this.x + this.height
            && pos.y > this.y && pos.y < this.y + this.height) return true;
        return false;
    }

    move(pos) {
        if (this.dead) return;
        this.x = pos.x - this.height/2;
        this.y = pos.y - this.height/2;
        this.draw();
    }

    isLegal(id) {
        if (this.dead) return;
        if (this.moves.indexOf(id) !== -1) return true;
        return false;
    }

    isEnpass(id) {
        if (this.dead) return;
        if (this.type !== "p" && this.type !== "P") return false;
        if (this.moves[this.moves.length - 2].indexOf(id) !== -1) return true;
        return false;
    }

    updateMoves(boxes) {
        if (this.dead) return;
        this.moves = this.func(this.id, boxes, this.isblack);
        return;
    }

    attack(boxes) {
        if (this.dead) return;
        if (this.type !== "p" && this.type !== "P") {
            this.moves.forEach(pos => {
                let values = pos.split("");
                let y = Number(values[0]) - 1;
                let x = Number(values[1]) - 1;

                boxes[y][x].attackers.push(this.type);
            });
        } else {
            this.moves[this.moves.length - 1].forEach(pos => {
                let values = pos.split("");
                let y = Number(values[0]) - 1;
                let x = Number(values[1]) - 1;

                boxes[y][x].attackers.push(this.type);
            });
        }
        return;
    }

    willPromote() {
        if (this.type !== "p" && this.type !== "P") return false;
        if (this.isblack && this.id[0] === "8") return true;
        if (!this.isblack && this.id[0] === "1") return true;
        return false;
    }

    switch() {
        if (this.dead) return;
        this.perspective = !this.perspective;
        this.update(this.id);
        return;
    }
}