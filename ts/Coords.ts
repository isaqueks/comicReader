
export interface Size {
    w: number;
    h: number;
}

export interface Point {
    x: number;
    y: number;
}

export interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}

export function createRect(pos: Point, siz: Size): Rect {
    return {
        x: pos.x,
        y: pos.y,
        w: siz.w,
        h: siz.h
    }
}
