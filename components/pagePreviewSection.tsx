import React from 'react';
import '../styles/pagePreviewSection.css';
import pagePreview from './pagePreview';

function buildPreviewList(
    selectedIndex: number, 
    urls: string[], 
    scrollTop: number, 
    click): 
JSX.Element[] {
        
    const previewList: JSX.Element[] = [];
    let i = 0;
    
    for (let url of urls) {
        previewList.push(
            pagePreview(
                selectedIndex, 
                i++, 
                url, 
                scrollTop, 
                click
            )
        );
    }
    
    return previewList;
}

interface PreviewSectionProps {
    urlArray: string[];
    selectedIndex: number;
    onSetPage: Function;
}


/*

        if (window.innerWidth < 600) {
            return (<div className="pagePreviewSection" />);
        }
        
        const scrollTop = this.domElement?.scrollTop;
        const scrollHeight = this.domElement?.scrollHeight;

        // console.log({ scrollTop, scrollHeight });
        
        const content = (<div className="pagePreviewSection">
            { props.urlArray ? buildPreviewList(props.selectedIndex, props.urlArray, scrollTop, scrollHeight, props.onSetPage || (() => { })) : ''}
        </div>);
*/

export default class PagePreviewSection extends React.Component<PreviewSectionProps> {

    private realElement: HTMLDivElement;
    private selectedIndex = this.props.selectedIndex;

    state = {
        currentScrollTop: 0
    }

    private getScrollTop() {
        return this.realElement?.scrollTop || 0;
    }

    private scrollHandler(event) {
        const scrollTop = this.getScrollTop();
        const diff = Math.abs(scrollTop - this.state.currentScrollTop);
        if (diff > window.innerHeight) {
            this.setState({
                currentScrollTop: scrollTop
            })
        }
    }

    private scrollToSelected() {
        if (this.realElement) {

            const selectedElement = this.realElement.querySelector(`[data-index="${this.props.selectedIndex}"]`)

            selectedElement?.scrollIntoView({
                behavior: 'smooth'
            })
        }
    }

    private intervalListener() {
        if (this.selectedIndex != this.props.selectedIndex) {
            this.scrollToSelected();            
            this.selectedIndex = this.props.selectedIndex;
        }
    }

    componentDidMount() {
        this.realElement = document.querySelector<HTMLDivElement>('.pagePreviewSection');
        this.realElement.addEventListener('scroll', this.scrollHandler.bind(this));
        window.setInterval(this.intervalListener.bind(this), 75);
        const scrollTop = this.getScrollTop();
        if (scrollTop != this.state.currentScrollTop) {
            this.setState({
                currentScrollTop: scrollTop
            })
        }
    }

    previewClicked(previewIndex: number) {
        if (this.props.onSetPage) {
            this.props.onSetPage(previewIndex);
        }
    }

    render() {

        const { props } = this;

        if (window.innerWidth < 600 || !props.urlArray) {
            return (<div className="pagePreviewSection" />);
        }
        
        return (<div className="pagePreviewSection">
            { buildPreviewList(props.selectedIndex, props.urlArray, this.state.currentScrollTop, this.previewClicked.bind(this)) }
        </div>);
    }

}