
export class Vector2 {
    x: number;
    y: number;

    static from(origin: unknown & { x: number, y: number }) {
        return new Vector2(origin.x, origin.y);
    }

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    setNorm(length: number) {
        const factor = length / this.norm();
        // this.scale(factor);
        return this.scale(factor);
    }

    lerp(target: Vector2, n: number) {
        const self = this.copy();
        return self.add(self.to(target).scale(n));
    }

    dot(v: Vector2): number {
        return this.x * v.x + this.y * v.y;
    }
    scale(k: number): Vector2 {
        // this.x *= k;
        // this.y *= k;
        // return this;
        return new Vector2(this.x * k, this.y * k);
    }
    add(v: Vector2) {
        this.x += v.x;
        this.y += v.y;
        return this
    }

    norm() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    angle(v: Vector2): number {
        // console.log(this.dot(v), this.norm(), v.norm(), this.dot(v) / (this.norm() * v.norm()));

        return Math.acos(this.dot(v) / (this.norm() * v.norm()));
    }

    to(v: Vector2) {
        return new Vector2(v.x - this.x, v.y - this.y);
    }

    sym(A: Vector2, B: Vector2) {
        const aTOm = A.to(this);
        const axis = A.to(B);

        const angle = aTOm.angle(axis);

        const ap = Math.cos(angle) * aTOm.norm();
        const P = new Vector2(A.x + axis.x * (ap / axis.norm()), A.y + axis.y * (ap / axis.norm()));

        return new Vector2(P.x - P.to(this).x, P.y - P.to(this).y);
    }
    copy() {
        return new Vector2(this.x, this.y);
    }
}
