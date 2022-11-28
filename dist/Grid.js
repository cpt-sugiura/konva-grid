"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_konva_1 = require("react-konva");
const helpers_1 = require("./helpers");
const defaultProps = {
    width: 800,
    height: 800,
    rowCount: 200,
    columnCount: 200,
    rowHeight: () => 20,
    columnWidth: () => 100,
    scrollbarSize: 20,
};
/**
 * Grid component
 * @param props
 */
const Grid = (props) => {
    const { width: containerWidth, height: containerHeight, rowHeight, columnWidth, rowCount, columnCount, scrollbarSize, children, } = props;
    const instanceProps = (0, react_1.useRef)({
        columnMetadataMap: {},
        rowMetadataMap: {},
        lastMeasuredColumnIndex: -1,
        lastMeasuredRowIndex: -1,
    });
    const verticalScrollRef = (0, react_1.useRef)(null);
    const wheelingRef = (0, react_1.useRef)(null);
    const horizontalScrollRef = (0, react_1.useRef)(null);
    const [scrollTop, setScrollTop] = (0, react_1.useState)(0);
    const [scrollLeft, setScrollLeft] = (0, react_1.useState)(0);
    const handleScroll = (0, react_1.useCallback)((e) => {
        setScrollTop(e.target.scrollTop);
    }, []);
    const handleScrollLeft = (0, react_1.useCallback)((e) => {
        setScrollLeft(e.target.scrollLeft);
    }, []);
    const scrollHeight = rowCount * rowHeight();
    const scrollWidth = columnCount * columnWidth();
    const [selectedArea, setSelectedArea] = (0, react_1.useState)({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    });
    const boundedCells = (0, react_1.useMemo)(() => (0, helpers_1.getBoundedCells)(selectedArea), [
        selectedArea,
    ]);
    const handleWheel = (0, react_1.useCallback)((event) => {
        if (wheelingRef.current)
            return;
        const { deltaX, deltaY, deltaMode } = event.nativeEvent;
        let dx = deltaX;
        let dy = deltaY;
        if (deltaMode === 1) {
            dy = dy * 17;
        }
        if (!horizontalScrollRef.current || !verticalScrollRef.current)
            return;
        const x = horizontalScrollRef.current?.scrollLeft;
        const y = verticalScrollRef.current?.scrollTop;
        wheelingRef.current = window.requestAnimationFrame(() => {
            wheelingRef.current = null;
            if (horizontalScrollRef.current)
                horizontalScrollRef.current.scrollLeft = x + dx;
            if (verticalScrollRef.current)
                verticalScrollRef.current.scrollTop = y + dy;
        });
    }, []);
    const rowStartIndex = (0, helpers_1.getRowStartIndexForOffset)({
        itemType: "row",
        rowHeight,
        columnWidth,
        rowCount,
        columnCount,
        instanceProps: instanceProps.current,
        offset: scrollTop,
    });
    const rowStopIndex = (0, helpers_1.getRowStopIndexForStartIndex)({
        startIndex: rowStartIndex,
        rowCount,
        rowHeight,
        columnWidth,
        scrollTop,
        containerHeight,
        instanceProps: instanceProps.current,
    });
    const columnStartIndex = (0, helpers_1.getColumnStartIndexForOffset)({
        itemType: "column",
        rowHeight,
        columnWidth,
        rowCount,
        columnCount,
        instanceProps: instanceProps.current,
        offset: scrollLeft,
    });
    const columnStopIndex = (0, helpers_1.getColumnStopIndexForStartIndex)({
        startIndex: columnStartIndex,
        columnCount,
        rowHeight,
        columnWidth,
        scrollLeft,
        containerWidth,
        instanceProps: instanceProps.current,
    });
    const items = [];
    if (columnCount > 0 && rowCount) {
        for (let rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
            for (let columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
                const width = (0, helpers_1.getColumnWidth)(columnIndex, instanceProps.current);
                const x = (0, helpers_1.getColumnOffset)({
                    index: columnIndex,
                    rowHeight,
                    columnWidth,
                    instanceProps: instanceProps.current,
                });
                const height = (0, helpers_1.getRowHeight)(rowIndex, instanceProps.current);
                const y = (0, helpers_1.getRowOffset)({
                    index: rowIndex,
                    rowHeight,
                    columnWidth,
                    instanceProps: instanceProps.current,
                });
                items.push((0, react_1.createElement)(children, {
                    x,
                    y,
                    width,
                    height,
                    rowIndex,
                    columnIndex,
                    key: (0, helpers_1.itemKey)({ rowIndex, columnIndex }),
                }));
            }
        }
    }
    return (react_1.default.createElement("div", { style: { position: "relative", width: containerWidth + 20 } },
        react_1.default.createElement("div", { style: {
                height: containerHeight,
                overflow: "scroll",
                position: "absolute",
                right: 0,
                top: 0,
                width: scrollbarSize,
                background: "#666",
            }, onScroll: handleScroll, ref: verticalScrollRef },
            react_1.default.createElement("div", { style: {
                    position: "absolute",
                    height: scrollHeight,
                    width: 1,
                } })),
        react_1.default.createElement("div", { style: {
                overflow: "scroll",
                position: "absolute",
                bottom: -scrollbarSize,
                left: 0,
                width: containerWidth,
                height: scrollbarSize,
                background: "#666",
            }, onScroll: handleScrollLeft, ref: horizontalScrollRef },
            react_1.default.createElement("div", { style: {
                    position: "absolute",
                    width: scrollWidth,
                    height: 1,
                } })),
        react_1.default.createElement("div", { onWheel: handleWheel, tabIndex: -1 },
            react_1.default.createElement(react_konva_1.Stage, { width: containerWidth, height: containerHeight },
                react_1.default.createElement(react_konva_1.Layer, null,
                    react_1.default.createElement(react_konva_1.Group, { offsetY: scrollTop, offsetX: scrollLeft }, items))))));
};
Grid.defaultProps = defaultProps;
exports.default = Grid;
