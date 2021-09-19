import React from 'react';

import * as ol from 'ol';
import * as layer from 'ol/layer';
import * as geom from 'ol/geom';
import * as style from 'ol/style';
import XYZ from 'ol/source/XYZ';
import SourceVector from 'ol/source/Vector';

import { exportFile } from '@helpers/exportFile';
import salesman from '@helpers/salesman';

import dataCoords from 'dataset.json';
import mockData from 'matriz_od.json';

type Tuple<T> = [T, T];

type RoutingData = {
    bestRoute: number[];
    bestRouteValue: number;
};

export type RoutingMapContextProps = {
    mapRef: React.MutableRefObject<ol.Map | null>;
    routingData: RoutingData | null;
    findMatrixButonDisabled: boolean;
    setRoutingData: React.Dispatch<React.SetStateAction<RoutingData | null>>;
    handleDownloadData(type: 'json' | 'csv'): void;
    handleGetBestRoute(): Promise<void>;
};

export type RoutingMapProviderProps = {
    children: React.ReactNode;
};

export const RoutingMapContext = React.createContext(
    {} as RoutingMapContextProps,
);

export const RoutingMapProvider = ({
    children,
}: RoutingMapProviderProps): JSX.Element => {
    const [findMatrixButonDisabled, setFindMatrixButtonDisabled] =
        React.useState(false);
    const [routingData, setRoutingData] = React.useState<RoutingData | null>(
        null,
    );
    const mapRef = React.useRef<ol.Map | null>(null);
    const hasLine = React.useRef<boolean>(false);

    const handleDownloadData = (type: 'json' | 'csv') => {
        const odMatrix = [...mockData] as number[][];
        if (type === 'json') {
            exportFile({
                data: JSON.stringify(odMatrix, null, 4),
                contentType: 'application/json;charset=utf-8;',
                fileName: 'matriz_od',
            });
        } else {
            exportFile({
                data: odMatrix.map((row) => row.join(';')).join('\n'),
                contentType: 'data:text/csv;charset=utf-8;',
                fileName: 'matriz_od.csv',
            });
        }
    };

    const handleGetBestRoute = async () => {
        setFindMatrixButtonDisabled(true);
        setRoutingData(null);
        if (hasLine.current) {
            dataCoords.forEach(() => mapRef.current?.getLayers().removeAt(1));
        }
        const delay = 100;
        const odMatrix = [...mockData] as number[][];
        const coords = [...dataCoords].map((coord) => [
            coord.latitude,
            coord.longitude,
        ]);
        const points = coords.map(
            (coord) => new salesman.Point(coord[0], coord[1]),
        );
        points.pop();

        const solution = salesman.solve(points, odMatrix);
        const ordered_points = solution.map((i) => coords[i]);

        await createLineBetweenPoints(
            [
                [coords[coords.length - 1][1], coords[coords.length - 1][0]],
                [ordered_points[0][1], ordered_points[0][0]],
            ],
            delay,
        );
        let i;
        for (i = 0; i < ordered_points.length - 1; i++) {
            await createLineBetweenPoints(
                [
                    [ordered_points[i][1], ordered_points[i][0]],
                    [ordered_points[i + 1][1], ordered_points[i + 1][0]],
                ],
                delay,
            );
        }
        await createLineBetweenPoints(
            [
                [ordered_points[i][1], ordered_points[i][0]],
                [coords[coords.length - 1][1], coords[coords.length - 1][0]],
            ],
            delay,
        );
        let bestValue = 0;
        let j;
        bestValue += odMatrix[solution.length][solution[0]];
        for (j = 0; j < solution.length - 1; j++) {
            bestValue += odMatrix[solution[j]][solution[j + 1]];
        }
        bestValue += odMatrix[solution[j]][solution.length];
        setRoutingData({
            bestRoute: solution.map((num) => num + 1),
            bestRouteValue: bestValue,
        });
        setFindMatrixButtonDisabled(false);
        hasLine.current = true;
    };

    const createLineBetweenPoints = (
        point: Tuple<Tuple<number>>,
        delay: number,
    ) => {
        return new Promise<void>((resolve) =>
            setTimeout(() => {
                let featureLine = new ol.Feature({
                    geometry: new geom.LineString(point),
                });
                let vectorLine = new SourceVector({});
                vectorLine.addFeature(featureLine);
                let vectorLineLayer = new layer.Vector({
                    source: vectorLine,
                    style: new style.Style({
                        fill: new style.Fill({ color: '#805AD5' }),
                        stroke: new style.Stroke({
                            color: '#805AD5',
                            width: 7,
                        }),
                    }),
                });
                mapRef.current?.getLayers().insertAt(1, vectorLineLayer);
                resolve();
            }, delay),
        );
    };
    React.useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = new ol.Map({
                target: 'map',
                layers: [
                    new layer.Tile({
                        source: new XYZ({
                            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        }),
                    }),
                ],
                view: new ol.View({
                    projection: 'EPSG:4326',
                    center: [-49.2727665, -16.7384281],
                    zoom: 12,
                }),
            });
            dataCoords.forEach((coord) => {
                let markerLayer = new layer.Vector({
                    source: new SourceVector({
                        features: [
                            new ol.Feature({
                                geometry: new geom.Point(
                                    [coord.longitude, coord.latitude],
                                    'EPSG:4326',
                                ),
                                name: coord.id,
                            }),
                        ],
                    }),
                    style: new style.Style({
                        text: new style.Text({
                            text: coord.id.toString(),
                            scale: 2,
                            textAlign: 'center',
                            fill: new style.Fill({
                                color: '#fefefe',
                            }),
                        }),
                        image: new style.Circle({
                            radius: 20,
                            scale: 1,
                            fill: new style.Fill({
                                color: '#007da3',
                            }),
                        }),
                    }),
                });
                mapRef.current?.addLayer(markerLayer);
            });
            setTimeout(() => mapRef.current?.updateSize(), 100);
        }
    }, []);
    return (
        <RoutingMapContext.Provider
            value={{
                mapRef,
                routingData,
                findMatrixButonDisabled,
                handleDownloadData,
                handleGetBestRoute,
                setRoutingData,
            }}
        >
            {children}
        </RoutingMapContext.Provider>
    );
};

export const useRoutingMap = (): RoutingMapContextProps => {
    const context = React.useContext(RoutingMapContext);
    if (!context) {
        throw new Error('useRoutingMap should be used within a context');
    }
    return context;
};

// type ApiResponse = {
//     destination_addresses: string[];
//     origin_addresses: string[];
//     rows: {
//         elements: {
//             distance: {
//                 text: string;
//                 value: number;
//             };
//             duration: {
//                 text: string;
//                 value: number;
//             };
//             status: string;
//         }[];
//     }[];
// };
// const handleFindDistance = async () => {
//     const api = getApiClient();
//     let odMatrix: number[][] = [];
//     let i, j;
//     for (i = 0; i < dataCoords.length; i++) {
//         const origin = dataCoords[i];
//         odMatrix[origin.id - 1] = [];
//         for (j = 0; j < dataCoords.length; j++) {
//             const destination = dataCoords[j];
//             const body = {
//                 destinations: [[origin.latitude, origin.longitude]],
//                 origins: [[destination.latitude, destination.longitude]],
//             };
//             const response = await api({
//                 url: 'api/google/distancematrix',
//                 method: 'post',
//                 data: body,
//             });
//             const data = response.data as ApiResponse;
//             odMatrix[origin.id - 1][destination.id - 1] =
//                 data.rows[0].elements[0].distance.value;
//         }
//         if (i === dataCoords.length - 1) {
//             exportFile({
//                 data: JSON.stringify(odMatrix, null, 4),
//                 contentType: 'application/json;charset=utf-8;',
//                 fileName: 'matriz_od',
//             });
//             exportFile({
//                 data: odMatrix.map((row) => row.join(';')).join('\n'),
//                 contentType: 'data:text/csv;charset=utf-8;',
//                 fileName: 'matriz_od',
//             });
//         }
//     }
// };
