
export interface ImageAsset {
    url: string;
    image: HTMLImageElement;
    loaded: boolean;
}

type AssetConstructor<T extends ImageAsset> = (url: string) => T;

export default class ImageAssetManager<T extends ImageAsset> {

    public maxItems: number;
    private storage: T[];
    private assetCtor: AssetConstructor<T>;

    constructor(maxItems: number = 20, ctor?: AssetConstructor<T>) {
        this.maxItems = maxItems;
        this.storage = new Array<T>();
        this.assetCtor = ctor;
    }

    private addItem(item: T) {
        if (this.storage.length >= this.maxItems) {
            const removedAsset = this.storage.shift();
            URL.revokeObjectURL(removedAsset.url);
        }
        this.storage.push(item);
    }

    private getCached(url: string): T {
        for (let asset of this.storage) {
            if (asset.url === url) {
                return asset;
            }
        }
        return null;
    }

    public getItem(url: string): T {

        const cached = this.getCached(url);
        if (cached) {
            return cached;
        }

        const img = new Image();
        let asset: T;
        if (this.assetCtor) {
            asset = this.assetCtor(url);
        }
        else {
            asset = ({
                url,
                image: img,
                loaded: false
            }) as T;
        }
        img.onload = () => {
            asset.loaded = true;
        }
        img.src = url;

        this.addItem(asset);
        return asset;
    }

}