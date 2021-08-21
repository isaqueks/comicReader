import AssetManager from "./AssetManager";

interface Size {
    w: number;
    h: number;
}

interface Point {
    x: number;
    y: number;
}

interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}

function createRect(pos: Point, siz: Size): Rect {
    return {
        x: pos.x,
        y: pos.y,
        w: siz.w,
        h: siz.h
    }
}

export default class ComicRenderer {

    private canvasSelector: string;
    private canvas: HTMLCanvasElement;

    private renderHandler;
    private pagesManager: AssetManager<HTMLImageElement>;

    private url: string;
    private prevPageUrl: string;
    private nextPageUrl: string;

    private currentUrl: string;
    private currentPrevPageUrl: string;
    private currentNextPageUrl: string;

    private animationStatus: number = 0;
    private animationSpeed: number;

    constructor(selector: string, framesPerSecond: number = 60) {

        this.canvasSelector = selector;
        const delay = 1000 / framesPerSecond;
        this.renderHandler = window.setInterval(this.renderFn.bind(this), delay);
        this.animationSpeed = 0.075 * (60 / framesPerSecond);
        this.pagesManager = new AssetManager<HTMLImageElement>(blob => {
            const img = new Image();
            img.src = URL.createObjectURL(blob);
            return img;
        }, 100);
    }

    public render(pageUrl: string, prevUrl?: string, nextUrl?: string) {

        // It can be a jump to a far offset, so, preload previus page anyway
        this.pagesManager.getItem(prevUrl);
        // pre-load
        this.pagesManager.getItem(nextUrl)

        this.prevPageUrl = prevUrl;
        this.nextPageUrl = nextUrl;
        this.url = pageUrl;
    }

    private fixCanvasSize() {

        const res = 1000;
        
        const parentW = (this.canvas.parentElement?.clientWidth || 350) - 30;
        const parentH = (this.canvas.parentElement?.clientHeight || 350) - 30;

        const ratio = parentW / parentH;

            
        const canvasW = res * ratio;
        const canvasH = res;

        this.canvas.style.width = (parentW)+'px';
        this.canvas.style.height = (parentH)+'px';

        this.canvas.width = canvasW;
        this.canvas.height = canvasH;

        return {
            width: canvasW,
            height: canvasH
        }
    }

    private drawImage(context: CanvasRenderingContext2D, img: HTMLImageElement, rect: Rect, offset?: Rect) {
        context.drawImage(img, 
            offset?.x || 0, 
            offset?.y || 0, 
            offset?.w || img.naturalWidth, 
            offset?.h || img.naturalHeight,
            rect.x, 
            rect.y, 
            rect.w, 
            rect.h);
    }

    private resizeImage(img: HTMLImageElement, maxW: number, maxH : number): Size {
        const imgW = img.naturalWidth;
        const imgH = img.naturalHeight;

        let w = imgW;
        let h = imgH;

        const ratio = w / h;
        const revRatio = h / w;

        const canvasRatio = maxW / maxH;

        if (canvasRatio < ratio) {
            w = maxW;
            h = maxW * revRatio;
        }
        else {
            w = maxH * ratio;
            h = maxH;
        }

        return {
            w, h
        }
    }

    private getCenter(size: Size, width: number, height: number): Point {
        return {
            x: width / 2 - size.w / 2,
            y: Math.max(height / 2 - size.h / 2, 0),
        }
    }

    private async renderFn() {
        try {
            await this.doRender();
        }
        catch {}
    }

    private async doRender() {
        if (!this.canvas) {
            this.canvas = document.querySelector(this.canvasSelector);
            return;
        }
        if (!this.url) {
            return;
        }


        const context = this.canvas.getContext('2d');
        const { width, height } = this.fixCanvasSize();

        const img = await this.pagesManager.getItem(this.currentUrl);
        const imgSiz = this.resizeImage(img, width, height);

        const prevImg = await this.pagesManager.getItem(this.currentPrevPageUrl);
        const prevSiz = this.resizeImage(prevImg, width, height);

        const nextImg = await this.pagesManager.getItem(this.currentNextPageUrl);
        const nextSiz = this.resizeImage(nextImg, width, height);

        const goneLeft = this.url == this.currentPrevPageUrl;
        const goneRight = this.url == this.currentNextPageUrl;

        const center = this.getCenter(imgSiz, width, height);

        if (this.currentUrl != this.url) {
            
            if (goneRight) {

                const currFadingPos: Point = {
                    x: center.x,
                    y: center.y
                }

                const currFadingOffset: Rect = {
                    x: (this.animationStatus * img.naturalWidth),
                    y: 0,
                    w: 0,
                    h: 0
                }

                const nextFadingPos = {
                    x: center.x + ((1 - this.animationStatus) * nextSiz.w),
                    y: center.y
                }

                const nextFadingOffset: Rect = {
                    x: 0,
                    y: 0,
                    w: (this.animationStatus * nextImg.naturalWidth),
                    h: 0
                }

                nextSiz.w *= this.animationStatus;
                
                this.drawImage(context, img, createRect(currFadingPos, imgSiz), currFadingOffset);
                this.drawImage(context, nextImg, createRect(nextFadingPos, nextSiz), nextFadingOffset);
                
                this.animationStatus += this.animationSpeed;

            }
            else if (goneLeft) {
                const currFadingPos: Point = {
                    x: center.x + (this.animationStatus * imgSiz.w),
                    y: center.y
                }

                const currFadingOffset: Rect = {
                    x: 0,
                    y: 0,
                    w: ((1 - this.animationStatus) * img.naturalWidth),
                    h: 0
                }


                const prevFadingPos = {
                    x: center.x,
                    y: center.y
                }

                const prevFadingOffset: Rect = {
                    x: ((1 - this.animationStatus) * prevImg.naturalWidth),
                    y: 0,
                    w: 0,
                    h: 0
                }

                const oldW = imgSiz.w;
                imgSiz.w *= (1 - this.animationStatus);
                
                this.drawImage(context, img, createRect(currFadingPos, imgSiz), currFadingOffset);
                this.drawImage(context, prevImg, createRect(prevFadingPos, prevSiz), prevFadingOffset);
                
                this.animationStatus += this.animationSpeed;
            }
            else {
                this.animationStatus = 1;
            }

            if (this.animationStatus >= 1) {
                this.currentUrl = this.url;
                this.currentNextPageUrl = this.nextPageUrl;
                this.currentPrevPageUrl = this.prevPageUrl;
                this.animationStatus = 0;
            }
        }
        else {
            this.drawImage(context, img, createRect(center, imgSiz));
        }


    }

}