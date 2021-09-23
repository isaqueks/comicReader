import React from 'react';
import '../styles/comicDisplay.css';
import ComicPage from './comicPage';

interface ClickHandler {
    (e: Event);
}

interface ComicProps {

    currentIndex: number;
    pages: string[];
    onSetPage: (i: number) => any;

}

export default class ComicDisplay extends React.Component<ComicProps> {

 
    state = {
        pages: this.props.pages,
        showingIndex: this.props.currentIndex
    }
    
    artificialScroll: boolean = false;
    domElement: HTMLElement;

    isTouching: boolean = false;
    scrollWhenTouchStart: number;

    private nextPage() {
        if (this.props.currentIndex < this.state.pages.length - 1) {
            this.props.onSetPage(this.props.currentIndex+1);
        }
    }

    private prevPage() {
        if (this.props.currentIndex > 0) {
            this.props.onSetPage(this.props.currentIndex-1);
        }
    }

    private stopScroll() {
        if (!this.domElement) return;
        this.domElement.style.overflowX = 'hidden';
        setTimeout(() => {
            this.domElement.style.overflowX = 'scroll';
        }, 50);
    }

    private touchStartHandler(e) {
        this.isTouching = true;
        this.scrollWhenTouchStart = this.domElement.scrollLeft;
    }

    private touchEndHandler(e) {
        this.isTouching = false;
        const diff = this.domElement.scrollLeft - this.scrollWhenTouchStart;
        if (diff !== 0) {
            if (Math.abs(diff) > 20) {
                if (diff > 0) {
                    this.nextPage();
                }
                else {
                    this.prevPage();
                }
            }
            else {
                this.scrollToCorrectIndex(true);
            }
            this.stopScroll();
        }
    }

    private scrollHandler(e) {
        if (this.artificialScroll || !this.domElement) {
            return;
        }

        const scrollLeft = this.domElement.scrollLeft;
        const scrollW = this.domElement.scrollWidth;
        const pageW = this.domElement.firstElementChild.clientWidth;

        // 50 tolerance
        if (this.isTouching) {
            if ((scrollLeft >= scrollW - pageW - 50) || scrollLeft <= 50) {
                this.touchEndHandler(e);
            }
            if ((this.state.showingIndex === 0 && scrollLeft < (pageW - 100)) ||
                (this.state.showingIndex === this.state.pages.length - 1 && scrollLeft > pageW + 100)) {
                this.touchEndHandler(e);
                this.scrollToCorrectIndex(true);
            }
        }
        
    }

    private clickHandler(e: any) {
        const { clientX, clientY, target } = e;

        const bounds = target.getBoundingClientRect();

        const elementX = bounds.left;
        const elementY = bounds.top;

        const x = clientX - elementX;
        const y = clientY - elementY;

        if (x >= bounds.width * 0.5) {
            this.nextPage();
        }
        else {
            this.prevPage();
        }

    }  

    private scrollToCorrectIndex(forceSmooth = false) {
        const { currentIndex } = this.props;
        const { showingIndex } = this.state;
        if (showingIndex == currentIndex && currentIndex === 0) {
            return this.setScrollLeft(1, !forceSmooth);
        }

        const diff = currentIndex - showingIndex;
        if (Math.abs(diff) === 1) {
            this.setScrollLeft(1 + diff, false, () => {
                this.setState({
                    showingIndex: currentIndex
                }, () => {
                    this.setScrollLeft(1, !forceSmooth);
                })
            });
        }
        else if (Math.abs(diff) >= 2) {
            this.setState({
                showingIndex: currentIndex
            }, () => {
                this.setScrollLeft(1, !forceSmooth);
            })
        }
        else if (diff === 0) {
            this.setScrollLeft(1, !forceSmooth);
        }
    
    }

    componentDidMount() {
        if (!this.domElement) {
            this.domElement = document.querySelector('.comicDisplay');
        }
        this.scrollToCorrectIndex();

        let lastWidth = this.domElement?.clientWidth;
        setInterval(() => {
            if (this.domElement && lastWidth && Math.abs(lastWidth - this.domElement.clientWidth) > 0) {
                this.scrollToCorrectIndex();  
            }
            lastWidth = this.domElement.clientWidth;
        }, 100);
    }

    componentDidUpdate() {
        this.scrollToCorrectIndex();
    }


    private getThreePages(index: number, pages: string[]): JSX.Element[] {
        return [
            <ComicPage src={pages[index-1]} key={index-1} />,
            <ComicPage src={pages[index]} key={index} />,
            <ComicPage src={pages[index+1]} key={index+1} />
        ]
    }

    private setScrollLeft(step: number, instant: boolean = false, callback?: (i?: number) => any) {
        if (!this.domElement) return;

        const desired = step * this.domElement.firstElementChild.clientWidth;

        this.domElement.onscroll = (e) => {
            
            // 10px tolerance to bypass firefox bug
            if (Math.abs(this.domElement.scrollLeft - desired) <= 10) {
                this.artificialScroll = false;
                callback && callback(desired);
            }
        }
        
        this.artificialScroll = true;
        this.domElement.scroll({
            left: step * this.domElement.firstElementChild.clientWidth,
            behavior: instant ? undefined : 'smooth'
        });
    }

    render() {

        const { pages, currentIndex } = this.props;

        return <div 
            className="comicDisplay" 
            onClick={e => this.clickHandler(e)} 
            onScroll={e => this.scrollHandler(e)}
            onTouchStart={e => this.touchStartHandler(e)}
            onTouchEnd={e => this.touchEndHandler(e)}
            >
            {this.getThreePages(this.state.showingIndex, pages)}
        </div>;

    }

}