class Box {
    constructor(height, pos, id, isblack) {
        this.x = pos.x*height;
        this.y = pos.y*height;
        this.id = id;
        this.isblack = isblack;
        this.height = height;
        this.attackers = [];
        this.piece = null;
        this.cap = null;
        this.enpass = null;
        this.canCastleR = null;
        this.canCastleL = null;
    }

    draw() {
        if (this.isblack === false) {
            ctx.fillStyle = "white";
        } else ctx.fillStyle = "brown";
        ctx.fillRect(this.x, this.y, this.height, this.height);
        ctx.fillStyle = "black";
    }

    isTarget(pos) {
        if (pos.x > this.x && pos.x < this.x + this.height
            && pos.y > this.y && pos.y < this.y + this.height) return true;
        return false;
    }
}