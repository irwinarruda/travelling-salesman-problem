type DataCoordsItem = {
    id: number;
    latitude: number;
    longitude: number;
};

declare module 'dataset.json' {
    const object;
    export default object as DataCoordsItem[];
}
