import React from 'react';
import '../styles/pagesPreview.css';

function previewFromUrl(
    selectedIndex: number, 
    index: number, 
    url: string, 
    scrollTop: number, 
    scrollHeight: number, 
    topPreview: number,
    click: Function
) {
    
    const dist = Math.abs(selectedIndex - index);
    
    const scrollDist = topPreview > scrollTop ? topPreview - scrollTop : scrollTop - topPreview;

    const useRealImage = (scrollHeight && topPreview ? scrollDist < window.innerHeight*2 : dist < 5);

    return (
        <img width="100%" key={index} data-index={index} src={useRealImage ? (url/*+'.thumb'*/) : undefined} className={`pagePreview ${selectedIndex == index ? 'selected' : ''} ${useRealImage ? '' : 'placeholder'}`} onClick={e => click(index)} />
    );
}

function previewsFromUrlArray(
    selectedIndex: number, 
    urls: string[], 
    scrollTop: number, 
    scrollHeight: number, 
    click): 
JSX.Element[] {
        
    const arr: JSX.Element[] = [];
    let i = 0;
    
    const top = (document.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement)?.offsetTop;

    for (let url of urls) {
        arr.push(previewFromUrl(selectedIndex, i++, url, scrollTop, scrollHeight, top, click));
    }
    
    return arr;
}

interface PagePreviewProps {
    urlArray: string[];
    selectedIndex: number;
    click: Function;
}

export default class PagesPreview extends React.Component<PagePreviewProps> {

    private currentScroll: number = 0;
    private handlerAttached: boolean = false;

    state = {
        currentIndex: 0
    }

    handleScroll(e) {
        const realElement = document.querySelector('.pagesPreview');
        if (!realElement) {
            return;
        }

        const scrollTop = realElement.scrollTop;

        const difference = Math.abs(this.currentScroll - scrollTop);

        if (difference > window.innerHeight) {
            this.currentScroll = scrollTop;
            this.forceUpdate();
        }
    }

    scrollToSelected() {
        const selectedElement = document.querySelector(`[data-index="${this.props.selectedIndex}"]`) as HTMLElement;

        if (this.props.selectedIndex != this.state.currentIndex) {
            selectedElement && selectedElement.scrollIntoView({
                behavior: 'smooth'
            });
            this.setState({
                currentIndex: this.props.selectedIndex
            });
        }
    }

    componentDidMount() {
        const realElement = document.querySelector('.pagesPreview');
        if (!realElement || this.handlerAttached) {
            return;
        }
        realElement.addEventListener('scroll', e => this.handleScroll(e));
        this.handlerAttached = true;
    }

    render() {

        const props = this.props;

        if (window.innerWidth < 600) {
            return (<div className="pagesPreview" />);
        }
        
        const realElement = document.querySelector('.pagesPreview');
    
        const content = (<div className="pagesPreview">
            { props.urlArray ? previewsFromUrlArray(props.selectedIndex, props.urlArray, realElement?.scrollTop, realElement?.scrollHeight, props.click || (() => { })) : ''}
        </div>);

        if (this.state.currentIndex === 0) {
            setTimeout(() => {
                this.scrollToSelected();
            }, 1500);
        }
        else {
            this.scrollToSelected();
        }
    
        return content;
    }

}