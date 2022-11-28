import { TItemSize, IInstanceProps, IArea, ICell, TCellMetaData } from './Grid';
export interface IItemMetaData {
    itemType: 'row' | 'column';
    offset: number;
    index: number;
    rowCount: number;
    columnCount: number;
    rowHeight: TItemSize;
    columnWidth: TItemSize;
    instanceProps: IInstanceProps;
}
export declare const getRowStartIndexForOffset: ({ itemType, rowHeight, columnWidth, rowCount, columnCount, instanceProps, offset }: Omit<IItemMetaData, 'index'>) => number;
interface IRowStopIndex extends Omit<IItemMetaData, 'itemType' | 'index' | 'offset' | 'columnCount'> {
    startIndex: number;
    containerHeight: number;
    scrollTop: number;
}
export declare const getRowStopIndexForStartIndex: ({ startIndex, rowCount, rowHeight, columnWidth, scrollTop, containerHeight, instanceProps }: IRowStopIndex) => number;
export declare const getColumnStartIndexForOffset: ({ itemType, rowHeight, columnWidth, rowCount, columnCount, instanceProps, offset }: Omit<IItemMetaData, 'index'>) => number;
interface IColumnStopIndex extends Omit<IItemMetaData, 'itemType' | 'index' | 'offset' | 'rowCount'> {
    startIndex: number;
    containerWidth: number;
    scrollLeft: number;
}
export declare const getColumnStopIndexForStartIndex: ({ startIndex, rowHeight, columnWidth, instanceProps, containerWidth, scrollLeft, columnCount }: IColumnStopIndex) => number;
export declare const getBoundedCells: (area: IArea) => Set<unknown>;
export declare const itemKey: ({ rowIndex, columnIndex }: ICell) => string;
export declare const getRowOffset: ({ index, rowHeight, columnWidth, instanceProps, }: Omit<IGetItemMetadata, 'itemType'>) => number;
export declare const getColumnOffset: ({ index, rowHeight, columnWidth, instanceProps, }: Omit<IGetItemMetadata, 'itemType'>) => number;
export declare const getRowHeight: (index: number, instanceProps: IInstanceProps) => number;
export declare const getColumnWidth: (index: number, instanceProps: IInstanceProps) => number;
interface IGetItemMetadata extends Pick<IItemMetaData, 'itemType' | 'index' | 'rowHeight' | 'columnWidth' | 'instanceProps'> {
}
export declare const getItemMetadata: ({ itemType, index, rowHeight, columnWidth, instanceProps }: IGetItemMetadata) => TCellMetaData;
export {};
