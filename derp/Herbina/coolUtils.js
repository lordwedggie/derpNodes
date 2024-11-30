// these are not shit! by lordwedggie
export function parseStringToArray(path) {
    // Regular expression to match parts and optionally the array index
    const regex = /(\w+)(?:\.(\w+)(?:\[(\d+)\])?|$)/g;
    // Initialize an array to hold parsed parts
    const parsedArray = [];
    // Loop through matches and push them to the array
    let match;
    while ((match = regex.exec(path)) !== null) {
        if (match[1]) {
            parsedArray.push(match[1]);
        }
        if (match[2]) {
            parsedArray.push(match[2]);
        }
        if (match[3]) {
            parsedArray.push(parseInt(match[3], 10));
        }
    }
    return parsedArray;
}
export function derpKeyMapper(option, clampedValue, node, extraMenuOptions) {
    // Mapping option names to their respective property paths
    const {derpCanvas, derpPalette} = node.prop;
    const propertyPathRaw = extraMenuOptions[option][0];
    const propertyPath = parseStringToArray(propertyPathRaw);
    if (propertyPath) {
        let target = node.prop;
        for (let i = 0; i < propertyPath.length - 1; i++) {
            target = target[propertyPath[i]];
        }
        const lastProperty = propertyPath[propertyPath.length - 1];
        target[lastProperty] = clampedValue;
    }
}  // Additional logic for specific cases can be handled here if needed
export function derpContextMapper(pathRaw, propValue, node) {
    // Mapping option names to their respective property paths
    const propertyPath = parseStringToArray(pathRaw);
    if (propertyPath) {
        let target = node.prop;
        for (let i = 0; i < propertyPath.length - 1; i++) {
            target = target[propertyPath[i]];
        }
        const lastProperty = propertyPath[propertyPath.length - 1];
        target[lastProperty] = propValue;
    }
}  // Additional logic for specific cases can be handled here if needed

//creates a property value from a given option list with a key
export function parsePropName (node, option, extraMenuOption) {
    const propertyPath = extraMenuOption[option][0];
    const properties = propertyPath.replace(/\[/g, '.').replace(/]/g, '').split('.');
    let targetValue = node.prop;
    for (const prop of properties){
        if (/\[\d+]/.test(prop)) { // Check if the property includes an array index notation
            const propName = prop.replace(/\[\d+]/, ''); // Extract the property name without the index
            const indexStr = prop.match(/\[(\d+)]/)[1]; // Extract the index
            const index = parseInt(indexStr);
            targetValue = targetValue[propName][index]; // Access the array element
        } else {
            targetValue = targetValue[prop]; // Access the regular property
        }
    }
    return (targetValue);
}
/**
 * Check if the point defined by (derpX, derpY) is within the rectangle defined by (x, y, w, h).
 *
 * @param {number} x - The x-coordinate of the top-left corner of the rectangle.
 * @param {number} y - The y-coordinate of the top-left corner of the rectangle.
 * @param {number} w - The width of the rectangle.
 * @param {number} h - The height of the rectangle.
 * @param {number} derpX - The x-coordinate of the point to check.
 * @param {number} derpY - The y-coordinate of the point to check.
 * @returns {boolean} True if the point is within the bounds, false otherwise.
 */
export const withinBounds = (x, y, w, h, derpX, derpY) => {
    // Validate input types
    if (
        typeof x !== 'number' ||
        typeof y !== 'number' ||
        typeof w !== 'number' ||
        typeof h !== 'number' ||
        typeof derpX !== 'number' ||
        typeof derpY !== 'number'
    ) {
        console.error('All arguments must be numbers.');
        return false;
    }

    // Validate width and height are positive
    //if (w <= 0 || h <= 0) {
    //    console.error('Width and height must be greater than zero.');
    //    return false;
    //}
    const withinXBounds = derpX >= x && derpX <= x + w; // Adjusted for inclusive bounds
    const withinYBounds = derpY >= y && derpY <= y + h; // Adjusted for inclusive bounds
    return withinXBounds && withinYBounds;
};
// parses a path string into reference for a variable
export function parsePropNameV2 (propertyPath) {
    const properties = propertyPath.replace(/\[/g, '.').replace(/]/g, '').split('.');
    let targetValue = node.prop;
    for (const prop of properties){
        if (/\[\d+]/.test(prop)) { // Check if the property includes an array index notation
            const propName = prop.replace(/\[\d+]/, ''); // Extract the property name without the index
            const indexStr = prop.match(/\[(\d+)]/)[1]; // Extract the index
            const index = parseInt(indexStr);
            targetValue = targetValue[propName][index]; // Access the array element
        } else {
            targetValue = targetValue[prop]; // Access the regular property
        }
    }
    return (targetValue);
}

