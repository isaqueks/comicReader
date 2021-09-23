import React from 'react';
import '../styles/pagePreviewSection.css';
import PagePreview from './pagePreview';

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
            PagePreview(
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


export default class PagePreviewSection extends React.Component<PreviewSectionProps> {

    private realElement: HTMLDivElement;
    private selectedIndex = -1;

    state = {
        currentScrollTop: 0,
        panelVisible: true,
        height: 0
    }

    private getScrollTop() {
        return this.realElement?.scrollTop || 0;
    }

    private getElementHeight() {
        return this.realElement?.clientHeight || 0;
    }

    private scrollHandler(event) {
        const scrollTop = this.getScrollTop();
        const diff = Math.abs(scrollTop - this.state.currentScrollTop);
        if (diff > window.innerHeight) {
            this.setState({
                currentScrollTop: scrollTop,
                height: this.getElementHeight()
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

        if (this.getElementHeight() != this.state.height) {
            this.setState({
                height: this.getElementHeight()
            });
            this.scrollToSelected();
        }

    }

    componentDidMount() {
        window.setInterval(this.intervalListener.bind(this), 75);
        this.realElement = document.querySelector<HTMLDivElement>('.pagePreviewSection');
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

    togglePanel(event) {
        const visible = this.state.panelVisible;
        this.setState({
            panelVisible: !visible
        })
    }

    render() {

        const { props } = this;

        if (window.innerWidth < 600 || !props.urlArray) {
            return (
                <div className="pagePreviewContainer hidden">
                    <div className="pagePreviewSection" />
                </div>
            );
        }

        const panelClasses = ['pagePreviewContainer'];
        if (!this.state.panelVisible) {
            panelClasses.push('panelHidden');
        }
        
        return (
        <div className={panelClasses.join(' ')}>
            <div className="pagePreviewHideArrow" onClick={e => this.togglePanel(e)}>
                <div className="pagePreviewHideArrowIcon" />
            </div>
            <div className="pagePreviewSection" onScroll={e => this.scrollHandler(e)}>
                { buildPreviewList(props.selectedIndex, props.urlArray, this.state.currentScrollTop, this.previewClicked.bind(this)) }
            </div>
        </div>
        );
    }

}