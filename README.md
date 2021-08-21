# ComicReader
## ReactJS (with TypeScript) Comic book reader.   
<hr>

### Usage
1. Clone this repo or add a submodule to your project. *(I don't have a NPM package right now, but I'll create one as soon as possible)*  
2. Import the component:
`import ComicReader from './comicReader/components/comicReader';`  
3. Use the component:
```
<ComicReader 
    pages={pages}
    pagesPreview={previews} 
    startIndex={0} 
    onClose={e => ...}
    onReadPage={e => ...}
/>
```
<hr>

### Required and optional props:
`pages: Array<string>` - **Required** - The URLs of the comic pages  
`previewPages?: Array<string>` - Optional - The URLs of the preview pages. You may pass the URL to lower resolution pages for making it lightweight. If no `previewPages` is provided, it will use `pages` for the preview panel.  
`startIndex?: number` - Optional - The index of the page to start from.  
`onClose?: Function` - Optional - The function that will be called when the menu back arrow is clicked. If no function is provided, the back arrow won't be shown.  
`onReadPage?: Function` - Optional - The function to be called when the reader goes to a new page. The index of the page will be passed as parameter.  
<hr>

#### Notes  
* If you pass URLs to ultra hight resolution and non optimized pages, it will runs slow. Use a mid-resolution and highly optimized images for better performance.   
* I am new to React world. Feel free to contribute.  
* If you find any issue, please, open an New issue on GitHub.