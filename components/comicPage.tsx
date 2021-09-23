import '../styles/comicPage.css';

export default function ComicPage(props) {

    const style = {
        backgroundImage: `url("${props.src}")`
    }

    return <div className="comicPage" style={style}></div>
}