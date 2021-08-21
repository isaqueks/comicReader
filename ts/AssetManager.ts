
export interface Asset<T> {
    url: string;
    data: T;
}

export interface AssetConstructor<T> {
    (data: Blob): T;
}

export default class AssetManager<T> {

    public maxItems: number;
    private storage: Asset<T>[];
    private assetCtor: AssetConstructor<T>;

    constructor(ctor: AssetConstructor<T>, maxItems: number = 20) {
        this.maxItems = maxItems;
        this.storage = new Array<Asset<T>>();
        this.assetCtor = ctor;
    }

    private addItem(item: Asset<T>) {
        if (this.storage.length >= this.maxItems) {
            const removedAsset = this.storage.shift();
            URL.revokeObjectURL(removedAsset.url);
        }
        this.storage.push(item);
    }

    private getCached(url: string): Asset<T> {
        for (let asset of this.storage) {
            if (asset.url === url) {
                return asset;
            }
        }
        return null;
    }

    public async getItem(url: string): Promise<T> {

        const cached = this.getCached(url);
        if (cached) {
            return cached.data;
        }

        const res = await fetch(url);
        const blob = await res.blob();
        const constructedData = this.assetCtor(blob)
        this.addItem({
            url: url,
            data: constructedData
        });
        return constructedData;
    }

}