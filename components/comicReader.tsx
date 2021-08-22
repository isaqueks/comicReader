import React from 'react';
import ComicDisplay from './comicDisplay';
import '../styles/comicReader.css';
import MenuBar from './menuBar';
import PagePreviewSection from './pagePreviewSection';

interface ComicReaderProps {
    pages: string[],
    previewPages?: string[],
    startIndex?: number;
    onClose?: Function;
    onReadPage?: Function;
}

export default class ComicReader extends React.Component<ComicReaderProps> {

    state: Readonly<{
        pages: string[],
        previewPages?: string[]
        currentPageIndex: number,
        onClose: Function,
        onReadPage: Function
    }> = {
        pages: this.props.pages,
        previewPages: this.props.previewPages,
        currentPageIndex: this.props.startIndex || 0,
        onClose: this.props.onClose,
        onReadPage: this.props.onReadPage
    }

    public setPageIndex(index: number) {

        this.state.onReadPage && this.state.onReadPage(index);
        
        this.setState({
            currentPageIndex: index
        })
    }

    public nextPage() {
        if (this.state.currentPageIndex < this.state.pages.length - 1) {
            this.setPageIndex(this.state.currentPageIndex+1);
        }
    }

    public prevPage() {
        if (this.state.currentPageIndex > 0) {
            this.setPageIndex(this.state.currentPageIndex - 1);
        }
    }

    private keyHandlers = {
        'ArrowLeft': this.prevPage,
        'ArrowUp': this.prevPage,
        'ArrowRight': this.nextPage,
        'ArrowDown': this.nextPage
    }

    private handleKeyDown(e) {
        const handler = this.keyHandlers[e.code];
        handler && handler.bind(this)();
    }

    render() {

        const { pages, currentPageIndex } = this.state;
        const previewPages = this.state.previewPages || pages;
        
        if (previewPages.length != pages.length) {
            throw new Error('pages and previewPages must have the same length!');
        }

        const url = pages[currentPageIndex];

        const prev = pages[currentPageIndex-1];
        const next = pages[currentPageIndex+1];

        return (<div tabIndex={0} className="comicReader" onKeyDown={e => this.handleKeyDown(e)}>
            <MenuBar onReturnClicked={this.state.onClose} currentPage={currentPageIndex} maxPages={pages.length} />
            <div className="mainContent">
                <PagePreviewSection selectedIndex={currentPageIndex} urlArray={previewPages} onSetPage={index => this.setPageIndex(index)}/>
                <div className="contentCenter">
                    <ComicDisplay url={url} nextPage={next} prevPage={prev} clickLeft={e => this.prevPage()} clickRight={e => this.nextPage()} />
                </div>
            </div>
        </div>);
    }

}