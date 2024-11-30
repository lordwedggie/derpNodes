// DerpNode by lordwedggie
import { getRGBA } from "./shitUtils.js";
import { parsePropName } from "./coolUtils.js";
// draws custom option menus from the comfy right click extraMenus
export function derpPanelOpen (ctx, node, extraMenuOptions) {
    const { derpCanvas, derpPalette } = node.prop;
    const derpPanel = derpCanvas.DerpPanel;
    const optionPanelColors = ['255, 255, 255, 1.00', '255, 255, 255, 0.50'];
    node.prop.derpCanvas.CurrentOptionKeys = Object.keys(extraMenuOptions);
    let tipSpace = 24;
    const optionCount = Object.keys(extraMenuOptions).length;
    const btnH = derpPanel.font2 * 2;
    const offsetY = derpPanel.font2 + derpPanel.spacingY;
    const spacingY = 8;
    derpPanel.panelStartY = - LiteGraph.NODE_TITLE_HEIGHT + 20;
    let tipArray = extraMenuOptions['tip'];
    let tip = tipArray[0];
    //if (tip === undefined) tip = "n/a";
    const tipY = derpPanel.Y + (derpPanel.font1 + spacingY) * optionCount;
    derpPanel.W = derpPanel.padLeft + btnH * 2 + 2 + derpPanel.fieldW + derpPanel.margin;
    derpPanel.H = offsetY * 2 + (derpPanel.font2 + spacingY) * (optionCount - 2) + tipSpace;
    let colorOptionIndex = 0;
    let currentY = 0;
    derpPanel.X = derpCanvas.Size[2] + 4; // open options to the right
    derpPanel.Y = derpCanvas.Size[1];
    ctx.fillStyle = getRGBA("45,45,45,0.8");
    ctx.shadowColor = getRGBA("0,0,0,0.5");
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    // Panel BG
    ctx.beginPath();
    ctx.roundRect(derpPanel.X, derpPanel.Y, derpPanel.W, derpPanel.H, derpPanel.C);
    ctx.fill();
    node.size = [derpCanvas.Size[2] + derpPanel.W, Math.max(derpPanel.H - LiteGraph.NODE_TITLE_HEIGHT, derpCanvas.Size[3] - LiteGraph.NODE_TITLE_HEIGHT)];

    let count = 0;
    //const tipValue = extraMenuOptions[0]["tip:"];
    // Draw options text
    for (const option in extraMenuOptions) {
        const currentEntry = extraMenuOptions[option];
        // draw title
        if (count === 0){
            // Title text
            const optionTitle = currentEntry[0];
            ctx.fillStyle = getRGBA(String(derpPalette.c_HeaderTextColor), 1.0);
            ctx.font = `${derpPanel.font1}px ${derpCanvas.HeaderFont}`;
            ctx.textBaseline = "top";
            ctx.textAlign = "left";
            ctx.fillText(optionTitle, derpPanel.X + derpPanel.margin, derpPanel.Y + 8);
            count += 1;
            continue;
        }
        if (count === 1){
            // Draw tip
            ctx.font = `${6}px ${derpCanvas.HeaderFont}`;
            ctx.fillStyle = getRGBA(String(derpPalette.c_HeaderTextColor), 0.3);
            ctx.textAlign = "left";
            ctx.fillText(tip, derpPanel.X + derpPanel.margin, tipY);
            count += 1;
            continue;
        }
        currentEntry.some((item, index) => {
            if (String(item).includes('ColorOptionIndex:')) {
                colorOptionIndex = index;
                const str = currentEntry[index];
                const parts = str.split(': ');
                const numStr = parts[1].trim();
                colorOptionIndex = parseInt(numStr);
                return true; // Break the loop once we find a match
            }
        });
        if (count > 1 ) {
            ctx.font = `${derpPanel.font1}px ${derpCanvas.HeaderFont}`;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'left';
            ctx.fillStyle = getRGBA(String(optionPanelColors[1]));
            ctx.fillText(option, derpPanel.X + derpPanel.margin, derpPanel.panelStartY + currentY + btnH / 2);
            // Draw option field
            ctx.fillStyle = getRGBA(derpCanvas.ColorOptions[colorOptionIndex], 0.8);
            if (option === 'Close panel') ctx.fillStyle = getRGBA("55,70,115,0.8");
            ctx.beginPath();
            ctx.roundRect(derpPanel.X + derpPanel.padLeft + btnH + 1, derpPanel.panelStartY + currentY, derpPanel.fieldW, btnH, 2);
            ctx.fill();
            // Draw LRbtn
            if ((option !== "Close panel:" && currentEntry[1] !== undefined) ||
                ((derpCanvas.IsOptionsPanelOpen === 2 || derpCanvas.IsOptionsPanelOpen === 4) && option !== 'Close panel')) {
                ctx.fillStyle = getRGBA(derpCanvas.ColorOptions[colorOptionIndex], 0.5);
                ctx.beginPath();
                ctx.roundRect(derpPanel.X + derpPanel.padLeft, derpPanel.panelStartY + currentY, btnH, btnH, 2);
                ctx.fill();
                ctx.beginPath();
                ctx.roundRect(derpPanel.X + derpPanel.padLeft + btnH + 2 + derpPanel.fieldW, derpPanel.panelStartY + currentY, btnH, btnH, 2);
                ctx.fill();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = getRGBA("255,255,255,0.2", 0.5);
                ctx.font = `${derpPanel.font2 * 0.6}px ${derpCanvas.HeaderFont}`;
                ctx.fillText("◁", derpPanel.X + derpPanel.padLeft + btnH / 2, derpPanel.panelStartY + currentY + btnH / 2);
                ctx.fillText("▷", derpPanel.X + derpPanel.padLeft + btnH + 1 + derpPanel.fieldW + btnH / 2, derpPanel.panelStartY + currentY + btnH / 2);
            }
            const currentEntryValue = parsePropName (node, option, extraMenuOptions);
            ctx.font = `${derpPanel.font2}px ${optionPanelColors[1]}`;
            ctx.textAlign = "center";
            ctx.fillStyle = getRGBA(optionPanelColors[0]);
            if (option === 'Close panel') {
                ctx.fillText(currentEntry[0], derpPanel.X + derpPanel.padLeft + btnH + 1 + derpPanel.fieldW / 2, derpPanel.panelStartY + currentY + btnH / 2);
            } else {
                if (currentEntry[1] === undefined) {
                    ctx.font = `${derpPanel.font2 * 0.8}px ${derpCanvas.HeaderFont}`;
                } else ctx.font = `${derpPanel.font2 }px ${derpCanvas.HeaderFont}`;
                ctx.fillText(currentEntryValue, derpPanel.X + derpPanel.padLeft + btnH + 1 + derpPanel.fieldW / 2, derpPanel.panelStartY + currentY + btnH / 2);
            }
        }
        currentY += btnH + derpPanel.spacingY;
        count += 1;
    }
}
// -------------------- Text alignment handler --------------------
export function updateSliderTextAlignment (ctx, node, nodeLabel, nodeValue, leftOffset, rightOffset ) {
    //console.log ('text alignment nodeLabel', nodeLabel, nodeValue);
    const { derpCanvas } = node.prop;
    const contentH = derpCanvas.Content_Pos[3];
    const headerFontSize = derpCanvas.HeaderFontSize || (contentH * derpCanvas.AutoFontRatio / 2);
    const outputFontSize = derpCanvas.OutputFontSize || (contentH * derpCanvas.AutoFontRatio / 2);
    const derpKey = derpCanvas.TextAlignment;
    const { TextMarginX, TextMarginY, Content_Pos, OutputFont, HeaderFont } = derpCanvas;
    const rightSpace = 4;
    ctx.font = `${outputFontSize}px ${OutputFont}`;
    const outputTextWidth = ctx.measureText(nodeValue).width;
    ctx.font = `${headerFontSize}px ${HeaderFont}`;
    const headerTextWidth = ctx.measureText(nodeLabel).width;
    let labelY;
    if (!derpCanvas.DrawHeader) {
        labelY = Content_Pos[1] + Content_Pos[3] / 2 + TextMarginY;
    } else {
        labelY = Content_Pos[1] + Content_Pos[3] * derpCanvas.ContentRatio / 2 + TextMarginY;
    }
    let outputY = labelY;
    let buttonsOffsetLeft;
    let buttonOffsetRight;    if (derpCanvas.DrawHeader){
        buttonsOffsetLeft = TextMarginX;
        buttonOffsetRight = TextMarginX;
    } else {
        console.log ('offsets:', leftOffset, rightOffset);
        buttonsOffsetLeft = TextMarginX + leftOffset;
        buttonOffsetRight = TextMarginX + rightOffset; // talk about brain failures...
    }
    console.log ('buttonsOffset:', buttonsOffsetLeft, buttonOffsetRight);
    switch (derpKey) {
        case 'left':
            derpCanvas.HeaderText_pos = [Content_Pos[0] + buttonsOffsetLeft , labelY];
            derpCanvas.OutputText_pos = [derpCanvas.HeaderText_pos[0] + headerTextWidth + rightSpace, outputY];
            derpCanvas.textAlign = ['left', 'left'];
            break;
        case 'split':
            //console.log ('buttonsOffsetLeft:', buttonsOffsetLeft);
            derpCanvas.HeaderText_pos = [Content_Pos[0] + buttonsOffsetLeft , labelY];
            derpCanvas.OutputText_pos = [Content_Pos[2] - buttonOffsetRight, outputY];
            derpCanvas.textAlign = ['left', 'right'];
            break;
        case 'center':
            derpCanvas.HeaderText_pos = [Content_Pos[0] + (Content_Pos[2] + buttonsOffsetLeft / 2 - (outputTextWidth + headerTextWidth)) / 2, labelY];
            derpCanvas.OutputText_pos = [derpCanvas.HeaderText_pos[0] + headerTextWidth + rightSpace, outputY];
            derpCanvas.textAlign = ['left', 'left'];
            break;
        case 'right':
            derpCanvas.HeaderText_pos = [Content_Pos[2] - outputTextWidth - rightSpace -buttonOffsetRight, labelY];
            derpCanvas.OutputText_pos = [Content_Pos[2] - buttonOffsetRight, outputY];
            derpCanvas.textAlign = ['right', 'right'];
            break;
        default:
            break;
        case 'vertical-split-L':
            let SplitL_X = Content_Pos[0] + buttonsOffsetLeft;
            if (derpCanvas.DrawHeader) SplitL_X += leftOffset ;
            const SplitL_Y = derpCanvas.DrawHeader ? Content_Pos[1] + Content_Pos[3] -( Content_Pos[3] - derpCanvas.Header_Pos[3]) / 2 + TextMarginY : Content_Pos[1] + Content_Pos[3] / 2 + TextMarginY;
            derpCanvas.HeaderText_pos = [Content_Pos[2] - buttonOffsetRight, outputY];
            derpCanvas.OutputText_pos = [SplitL_X, SplitL_Y];
            derpCanvas.textAlign = ['right', 'left'];
            break;
        case 'vertical-split-C':
            let splitC_X = Content_Pos[2] - buttonOffsetRight;
            if (derpCanvas.DrawHeader) splitC_X -= rightOffset - leftOffset;
            outputY = derpCanvas.DrawHeader ? Content_Pos[1] + Content_Pos[3] -( Content_Pos[3] - derpCanvas.Header_Pos[3]) / 2 + TextMarginY : Content_Pos[1] + Content_Pos[3] / 2 + TextMarginY;
            derpCanvas.HeaderText_pos = [Content_Pos[0] + (Content_Pos[2] + buttonsOffsetLeft / 2 - headerTextWidth) / 2, labelY];
            derpCanvas.OutputText_pos = [Content_Pos[0] + (Content_Pos[2] + buttonsOffsetLeft / 2 - outputTextWidth) / 2, outputY];
            derpCanvas.textAlign = ['left', 'left'];
            break;
        case 'vertical-split-R':
            let splitR_X = Content_Pos[2] - buttonOffsetRight;
            if (derpCanvas.DrawHeader) splitR_X -= rightOffset;
            outputY = derpCanvas.DrawHeader ? Content_Pos[1] + Content_Pos[3] -( Content_Pos[3] - derpCanvas.Header_Pos[3]) / 2 + TextMarginY : Content_Pos[1] + Content_Pos[3] / 2 + TextMarginY;
            derpCanvas.HeaderText_pos = [Content_Pos[0] + buttonsOffsetLeft , labelY];
            derpCanvas.OutputText_pos = [splitR_X, outputY];
            derpCanvas.textAlign = ['left', 'right'];
            break;
    }
}