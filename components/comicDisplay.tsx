import React from 'react';
import '../styles/comic.css';
import ComicRenderer from '../ts/ComicRenderer'

interface ClickHandler {
    (e: Event);
}

interface ComicProps {

    url?: string;
    prevPage?: string;
    nextPage?: string;

    clickLeft?: ClickHandler;
    clickRight?: ClickHandler;
}

export default class ComicDisplay extends React.Component<ComicProps> {

    state = {
        url: this.props.url,
        nextPage: this.props.nextPage,
        prevPage: this.props.prevPage,
    }

    comicRenderer: ComicRenderer;

    constructor(props) {
        super(props);
        this.comicRenderer = new ComicRenderer('#comicCanvas');
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            url: nextProps.url,
            nextPage: nextProps.nextPage,
            prevPage: nextProps.prevPage,
        })
    }

    clickHandler(e: any) {
        const { clientX, clientY, target } = e;

        const bounds = target.getBoundingClientRect();

        const elementX = bounds.left;
        const elementY = bounds.top;

        const x = clientX - elementX;
        const y = clientY - elementY;

        if (x >= bounds.width * 0.5) {
            this.props.clickRight(e);
        }
        else {
            this.props.clickLeft(e);
        }

    }  

    render() {

        const { url, nextPage, prevPage } = this.state;

        this.comicRenderer.render(url, prevPage, nextPage);

        return <canvas id="comicCanvas" className="comicPage" onClick={e => this.clickHandler(e)} />
    }

}