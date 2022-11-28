import React from "react";
export interface IProps {
    width: number;
    height: number;
    columnCount: number;
    rowCount: number;
    rowHeight: TItemSize;
    columnWidth: TItemSize;
    children: RenderComponent;
    scrollbarSize: number;
}
type RenderComponent = React.FC<IChildrenProps>;
export interface IChildrenProps extends ICell {
    x: number;
    y: number;
    width: number;
    height: number;
}
export type TItemSize = (index?: number) => number;
export interface IArea {
    top: number;
    bottom: number;
    left: number;
    right: number;
}
export interface ICell {
    rowIndex: number;
    columnIndex: number;
}
export interface IInstanceProps {
    columnMetadataMap: TCellMetaDataMap;
    rowMetadataMap: TCellMetaDataMap;
    lastMeasuredColumnIndex: number;
    lastMeasuredRowIndex: number;
}
export type TCellMetaDataMap = Record<number, TCellMetaData>;
export type TCellMetaData = {
    offset: number;
    size: number;
};
/**
 * Grid component
 * @param props
 */
declare const Grid: React.FC<IProps>;
export default Grid;
