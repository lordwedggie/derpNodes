/* xcp Derp Nodes by lordwedggie
Based on Max Smirnov's origional sliders! check out his nodes at: https://github.com/Smirnov75/ComfyUI-mxToolki
Half of these are written by AI*/
//"🟩 Node Settings"
export function getMidpointColor(color1, color2) {
    // Extract RGBA components from the first color
    let rgba1 = color1.match(/rgba?\((\d+), (\d+), (\d+), ([\d.]+)\)/).slice(1).map(Number);
    // Extract RGBA components from the second color
    let rgba2 = color2.match(/rgba?\((\d+), (\d+), (\d+), ([\d.]+)\)/).slice(1).map(Number);

    // Calculate the midpoint for each component
    let midR = (rgba1[0] + rgba2[0]) / 2;
    let midG = (rgba1[1] + rgba2[1]) / 2;
    let midB = (rgba1[2] + rgba2[2]) / 2;
    let midA = (rgba1[3] + rgba2[3]) / 2;

    // Combine the components back into an RGBA string
    return `rgba(${midR}, ${midG}, ${midB}, ${midA})`;
};
export function validateRGBA(rgba) {
    // Regular expression to match and replace "1.00" with "1" and "0.00" with "0"
    const fixedRGBA = rgba.replace(/(\.0+|(?<=\d)\.0+)/g, "");

    const rgbaRegex = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/;
    const match = fixedRGBA.match(rgbaRegex);
    if (!match) {
        console.log("validation failed, returning false");
        return false;
    }
    // Extract the values
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    const a = parseFloat(match[4]);

    // Validate the ranges
    if (r < 0 || r > 255) return false;
    if (g < 0 || g > 255) return false;
    if (b < 0 || b > 255) return false;
    if (a < 0 || a > 1) return false;
    return true;
}

// Convert string to RGBA color
export function getRGBA(color, alpha) {
    let rgbaComponents = color.split(',').map(component => component.trim());
    if (alpha !== undefined) {
        rgbaComponents[3] = Math.min(Math.max(rgbaComponents[3], 0), 255);
        rgbaComponents[3] = alpha; // Replace the alpha value
    }
    const rgbaString = `rgba(${rgbaComponents.join(', ')})`;
    return rgbaString;
}
export function resetEffects(ctx) {
    ctx.shadowColor = getRGBA("0,0,0,0");
    ctx.strokeStyle = "rgba(0,0,0,0)";
}

export function derpTitle(derpString, derpWidth) {
    const step = 15; // Every step pixels
    const maxChars = Math.floor(derpWidth / step);
    let result = '';

    for (let i = 0; i < derpString.length && result.length < maxChars; i++) {
        result += derpString[i];
    }

    return result;
}

export function extractAlpha(rgbaString) {
    // Validate the input
    if (typeof rgbaString !== 'string') {
        throw new Error('Input must be a string');
    }
    // Split the string by commas and trim whitespace
    const rgbaComponents = rgbaString.split(',').map(component => component.trim());
    // Ensure there are exactly 4 components
    if (rgbaComponents.length !== 4) {
        throw new Error('Invalid RGBA string format');
    }
    // Convert components to numbers
    const [r, g, b, a] = rgbaComponents.map((component, index) => {
        const value = index < 3 ? parseInt(component, 10) : parseFloat(component);
        if (isNaN(value)) {
            throw new Error(`Invalid value for ${['red', 'green', 'blue', 'alpha'][index]}: ${component}`);
        }
        return value;
    });
    // Return the components as an object
    return a;
}
const derpIDs = [];
export function derpHandler(derpID) {
    derpIDs.push(derpID);
    console.log(derpIDs.length + " derpNodes added.");
}
export function setDerpPalette(name, color, alpha) {
    return {
        name: name,
        color: color,
        alpha: alpha
    };
}

export function simpleRGBA(RGBA, step) {
    // Ensure RGBA is a string
    if (typeof RGBA !== 'string') {
        throw new Error('Input must be a string');
    }

    // Update the regex to handle optional spaces and both int/float alpha
    let rgbaComponents = RGBA.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\s*\)/).slice(1).map(Number);

    // Rest of the function remains the same...
    let r = Math.min(Math.max(rgbaComponents[0] + step, 0), 255);
    let g = Math.min(Math.max(rgbaComponents[1] + step, 0), 255);
    let b = Math.min(Math.max(rgbaComponents[2] + step, 0), 255);
    let a = rgbaComponents[3]; // Keep the alpha component unchanged

    let rStr = r.toString().padStart(3, '0');
    let gStr = g.toString().padStart(3, '0');
    let bStr = b.toString().padStart(3, '0');
    let aStr = a.toFixed(1); // Ensures alpha is formatted with one decimal place

    return `${rStr}, ${gStr}, ${bStr}, ${aStr}`;
}
// moved this here to avoid the stupid warnings on #bgcolor etc
export function derpOnAdded (node){
    const { derpCanvas } = node.properties;
    node.color = "#0000";
    node.bgcolor = "#0000";
    node.boxcolor = "#0000";
    node.outputs[0].name = "";
    derpCanvas.stashedTitle = node.title;
    derpCanvas.OutputIsConnected = 0;
    derpCanvas.AlignmentChanged = true;
    //derpCanvas.PrevSize = node.size;
    derpCanvas.SizeChanged = false;
    derpCanvas.stashedTitle = 'xcp';
    node.setDirtyCanvas(true, true);
    console.log (derpCanvas.PrevSize);
}
