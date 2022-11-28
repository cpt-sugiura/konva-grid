"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemMetadata = exports.getColumnWidth = exports.getRowHeight = exports.getColumnOffset = exports.getRowOffset = exports.itemKey = exports.getBoundedCells = exports.getColumnStopIndexForStartIndex = exports.getColumnStartIndexForOffset = exports.getRowStopIndexForStartIndex = exports.getRowStartIndexForOffset = void 0;
const getRowStartIndexForOffset = ({ itemType, rowHeight, columnWidth, rowCount, columnCount, instanceProps, offset }) => {
    return findNearestItem({
        itemType,
        rowHeight,
        columnWidth,
        rowCount,
        columnCount,
        instanceProps,
        offset
    });
};
exports.getRowStartIndexForOffset = getRowStartIndexForOffset;
const getRowStopIndexForStartIndex = ({ startIndex, rowCount, rowHeight, columnWidth, scrollTop, containerHeight, instanceProps }) => {
    const itemMetadata = (0, exports.getItemMetadata)({
        itemType: 'row',
        rowHeight,
        columnWidth,
        index: startIndex,
        instanceProps
    });
    const maxOffset = scrollTop + containerHeight;
    let offset = itemMetadata.offset + itemMetadata.size;
    let stopIndex = startIndex;
    while (stopIndex < rowCount - 1 && offset < maxOffset) {
        stopIndex++;
        offset += (0, exports.getItemMetadata)({
            itemType: 'row',
            rowHeight,
            columnWidth,
            index: stopIndex,
            instanceProps
        }).size;
    }
    return stopIndex;
};
exports.getRowStopIndexForStartIndex = getRowStopIndexForStartIndex;
const getColumnStartIndexForOffset = ({ itemType, rowHeight, columnWidth, rowCount, columnCount, instanceProps, offset }) => {
    return findNearestItem({
        itemType,
        rowHeight,
        columnWidth,
        rowCount,
        columnCount,
        instanceProps,
        offset
    });
};
exports.getColumnStartIndexForOffset = getColumnStartIndexForOffset;
const getColumnStopIndexForStartIndex = ({ startIndex, rowHeight, columnWidth, instanceProps, containerWidth, scrollLeft, columnCount }) => {
    const itemMetadata = (0, exports.getItemMetadata)({
        itemType: 'column',
        index: startIndex,
        rowHeight,
        columnWidth,
        instanceProps
    });
    const maxOffset = scrollLeft + containerWidth;
    let offset = itemMetadata.offset + itemMetadata.size;
    let stopIndex = startIndex;
    while (stopIndex < columnCount - 1 && offset < maxOffset) {
        stopIndex++;
        offset += (0, exports.getItemMetadata)({
            itemType: 'column',
            rowHeight,
            columnWidth,
            index: stopIndex,
            instanceProps
        }).size;
    }
    return stopIndex;
};
exports.getColumnStopIndexForStartIndex = getColumnStopIndexForStartIndex;
const getBoundedCells = (area) => {
    const { top, bottom, left, right } = area;
    const cells = new Set();
    for (let i = top; i <= bottom; i++) {
        for (let j = left; j <= right; j++) {
            cells.add(JSON.stringify([i, j]));
        }
    }
    return cells;
};
exports.getBoundedCells = getBoundedCells;
const itemKey = ({ rowIndex, columnIndex }) => `${rowIndex}:${columnIndex}`;
exports.itemKey = itemKey;
const getRowOffset = ({ index, rowHeight, columnWidth, instanceProps, }) => {
    return (0, exports.getItemMetadata)({
        itemType: 'row',
        index,
        rowHeight,
        columnWidth,
        instanceProps
    }).offset;
};
exports.getRowOffset = getRowOffset;
const getColumnOffset = ({ index, rowHeight, columnWidth, instanceProps, }) => {
    return (0, exports.getItemMetadata)({
        itemType: 'column',
        index,
        rowHeight,
        columnWidth,
        instanceProps
    }).offset;
};
exports.getColumnOffset = getColumnOffset;
const getRowHeight = (index, instanceProps) => {
    return instanceProps.rowMetadataMap[index].size;
};
exports.getRowHeight = getRowHeight;
const getColumnWidth = (index, instanceProps) => {
    return instanceProps.columnMetadataMap[index].size;
};
exports.getColumnWidth = getColumnWidth;
const getItemMetadata = ({ itemType, index, rowHeight, columnWidth, instanceProps }) => {
    let itemMetadataMap, itemSize, lastMeasuredIndex;
    if (itemType === 'column') {
        itemMetadataMap = instanceProps.columnMetadataMap;
        itemSize = columnWidth;
        lastMeasuredIndex = instanceProps.lastMeasuredColumnIndex;
    }
    else {
        itemMetadataMap = instanceProps.rowMetadataMap;
        itemSize = rowHeight;
        lastMeasuredIndex = instanceProps.lastMeasuredRowIndex;
    }
    if (index > lastMeasuredIndex) {
        let offset = 0;
        if (lastMeasuredIndex >= 0) {
            const itemMetadata = itemMetadataMap[lastMeasuredIndex];
            offset = itemMetadata.offset + itemMetadata.size;
        }
        for (let i = lastMeasuredIndex + 1; i <= index; i++) {
            let size = itemSize(i);
            itemMetadataMap[i] = {
                offset,
                size,
            };
            offset += size;
        }
        if (itemType === 'column') {
            instanceProps.lastMeasuredColumnIndex = index;
        }
        else {
            instanceProps.lastMeasuredRowIndex = index;
        }
    }
    return itemMetadataMap[index];
};
exports.getItemMetadata = getItemMetadata;
const findNearestItem = ({ itemType, rowHeight, columnWidth, rowCount, columnCount, instanceProps, offset }) => {
    let itemMetadataMap, lastMeasuredIndex;
    if (itemType === 'column') {
        itemMetadataMap = instanceProps.columnMetadataMap;
        lastMeasuredIndex = instanceProps.lastMeasuredColumnIndex;
    }
    else {
        itemMetadataMap = instanceProps.rowMetadataMap;
        lastMeasuredIndex = instanceProps.lastMeasuredRowIndex;
    }
    const lastMeasuredItemOffset = lastMeasuredIndex > 0 ? itemMetadataMap[lastMeasuredIndex].offset : 0;
    if (lastMeasuredItemOffset >= offset) {
        // If we've already measured items within this range just use a binary search as it's faster.
        return findNearestItemBinarySearch({
            itemType,
            rowHeight,
            columnWidth,
            instanceProps,
            high: lastMeasuredIndex,
            low: 0,
            offset
        });
    }
    else {
        // If we haven't yet measured this high, fallback to an exponential search with an inner binary search.
        // The exponential search avoids pre-computing sizes for the full set of items as a binary search would.
        // The overall complexity for this approach is O(log n).
        return findNearestItemExponentialSearch({
            itemType,
            rowHeight,
            rowCount,
            columnCount,
            columnWidth,
            instanceProps,
            index: Math.max(0, lastMeasuredIndex),
            offset
        });
    }
};
const findNearestItemBinarySearch = ({ itemType, rowHeight, columnWidth, instanceProps, high, low, offset }) => {
    while (low <= high) {
        const middle = low + Math.floor((high - low) / 2);
        const currentOffset = (0, exports.getItemMetadata)({
            itemType,
            rowHeight,
            columnWidth,
            index: middle,
            instanceProps
        }).offset;
        if (currentOffset === offset) {
            return middle;
        }
        else if (currentOffset < offset) {
            low = middle + 1;
        }
        else if (currentOffset > offset) {
            high = middle - 1;
        }
    }
    if (low > 0) {
        return low - 1;
    }
    else {
        return 0;
    }
};
const findNearestItemExponentialSearch = ({ itemType, rowHeight, columnWidth, rowCount, columnCount, instanceProps, index, offset }) => {
    const itemCount = itemType === 'column' ? columnCount : rowCount;
    let interval = 1;
    while (index < itemCount &&
        (0, exports.getItemMetadata)({
            itemType,
            rowHeight,
            columnWidth,
            index,
            instanceProps
        }).offset < offset) {
        index += interval;
        interval *= 2;
    }
    return findNearestItemBinarySearch({
        itemType,
        rowHeight,
        columnWidth,
        instanceProps,
        high: Math.min(index, itemCount - 1),
        low: Math.floor(index / 2),
        offset
    });
};
