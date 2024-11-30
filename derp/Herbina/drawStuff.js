import { getRGBA, resetEffects, extractAlpha } from './shitUtils.js';
import { withinBounds } from "./coolUtils.js";
export function applyGlobalFX (ctx, node){
    const {derpEffects} = node.prop;
    if (derpEffects.DrawGlobalFX) {
        ctx.shadowColor = getRGBA(derpEffects.GlobalFX[0]);
        ctx.shadowBlur = derpEffects.GlobalFX[1];
        ctx.shadowOffsetX = derpEffects.GlobalFX[2];
        ctx.shadowOffsetY = derpEffects.GlobalFX[3];
    } else {
        resetEffects(ctx);
    }
}
export function drawDerpDefault1(ctx, node, nodeLabel, nodeValue ){
    const {derpCanvas, derpEffects, derpEffectPalette, derpPalette } = node.prop;
    const [canvasX, canvasY, canvasW, canvasH] = derpCanvas.Size;
    const [mLeft, mRight, mTop, mBottom] = derpCanvas.Margins;
    // Draw Canvas
    ctx.fillStyle = getRGBA(derpPalette.c_CanvasBG);
    ctx.beginPath();
    // Canvas BG shadow
    applyGlobalFX (ctx, node);
    if (derpEffects.CanvasShadow) {
        ctx.shadowColor = getRGBA(derpEffectPalette.c_CanvasFX);
        ctx.shadowBlur = derpEffects.CanvasShadowBlur;
        ctx.shadowOffsetX = derpEffects.CanvasFX_offsetX;
        ctx.shadowOffsetY = derpEffects.CanvasFX_offsetY;
    }
    // Draw Canvas BG
    node.updateCornerMap (derpCanvas.CornerFlag);
    ctx.roundRect(canvasX, canvasY, canvasW + node.prop.CanvasWidthFix, canvasH, derpCanvas.CornerMap);
    ctx.fill();

    ctx.lineWidth = derpEffects.CanvasStrokeWeight;
// canvas stroke
    if (derpEffects.CanvasStroke) {
        ctx.lineWidth = derpEffects.CanvasStrokeWeight;
        ctx.strokeStyle = getRGBA(derpEffectPalette.c_CanvasStroke);
        ctx.stroke();
    }
// Draw Content shadow
    if (derpEffects.ContentShadow) {
        ctx.shadowColor = getRGBA(derpEffectPalette.c_ContentFX);
        ctx.shadowBlur = derpEffects.ContentFX_Blur;
        ctx.shadowOffsetX = derpEffects.ContentFX_offsetX;
        ctx.shadowOffsetY = derpEffects.ContentFX_offsetY;
    }
    derpCanvas.Content_Pos = [
        derpCanvas.PadLeft + mLeft,
        canvasY+ mTop,
        canvasW - mLeft - mRight - derpCanvas.PadLeft - derpCanvas.PadRight,
        canvasH - mTop - mBottom
    ];
// Draw content BG
    const [contentX, contentY, contentW, contentH] = derpCanvas.Content_Pos;
    ctx.beginPath();
    ctx.fillStyle = getRGBA(derpPalette.c_ContentBG);
    ctx.roundRect(contentX, contentY, contentW, contentH, derpCanvas.ContentCorner);
    ctx.fill();
    applyGlobalFX (ctx, node);
//ctx.fillStyle = getRGBA(derpPalette.c_HeaderBG);

// Draw Header
    resetEffects(ctx);
    derpCanvas.Header_Pos[3] = derpCanvas.DrawHeader ? Math.round(contentH * derpCanvas.ContentRatio) : 0;
    derpCanvas.Header_pos = [mLeft + derpCanvas.PadLeft, canvasY + mTop, derpCanvas.Header_Pos[3]];
    if (derpCanvas.DrawHeader) {
        derpCanvas.Header_Pos[3] = Math.round((canvasH - mTop - mBottom) * derpCanvas.ContentRatio);
        derpCanvas.Header_pos[1] = derpCanvas.Header_Pos[3];
        ctx.beginPath();
        ctx.fillStyle = getRGBA(derpPalette.c_HeaderBG);
        ctx.roundRect(contentX, contentY, contentW, derpCanvas.Header_Pos[3], [derpCanvas.ContentCorner, derpCanvas.ContentCorner, 0, 0]);
        ctx.fill();
    }
// Draw stroke (header and content)
    ctx.beginPath();
    ctx.fillStyle = getRGBA("0, 0, 0, 0"); //draw invisible area for stroke, remove later by changing draw order
    ctx.roundRect(contentX, contentY, contentW, contentH, derpCanvas.ContentCorner);
    ctx.fill();
    if (derpEffects.ContentStroke) {
        ctx.lineWidth = derpEffects.ContentStrokeWeight;
        ctx.strokeStyle = getRGBA(derpEffectPalette.c_ContentStroke);
        ctx.stroke();
    }
}

export function drawDerpSliderV1(ctx, node){
    const {derpCanvas, derpSlider, derpSliderPalette } = node.prop;
    /* -------------------- Draw Slider BG-------------------- */
    const [mLeft, mRight, mTop, mBottom] = derpSlider.Margins;
    derpSlider.SliderBG_Pos = [
        derpCanvas.Content_Pos[0] + ( mLeft + mRight ) / 2,
        derpCanvas.Content_Pos[1] + mTop,
        derpCanvas.Content_Pos[2] - mLeft - mRight,
        derpCanvas.Content_Pos[3] - mTop- mBottom,
    ]
    if (derpCanvas.DrawHeader) {
        derpSlider.SliderBG_Pos[1] = derpCanvas.Content_Pos[1] + derpCanvas.Header_Pos[3]  + mTop;
        derpSlider.SliderBG_Pos[3] = derpCanvas.Content_Pos[3] - derpCanvas.Header_Pos[3]  - mTop- mBottom;
    }
    const [sliderBG_X, sliderBG_Y, sliderBG_W, sliderBG_H ] = derpSlider.SliderBG_Pos;
    applyGlobalFX (ctx, node);

    ctx.fillStyle = getRGBA(derpSliderPalette.c_SliderBG);
    ctx.beginPath();
    ctx.roundRect(sliderBG_X, sliderBG_Y, sliderBG_W, sliderBG_H, derpSlider.Corner);
    ctx.fill();
    /* -------------------- Draw DefaultBtn -------------------- */
    derpSlider.DrawDefaultBtn_Pos = [0, 0, 0, 0];
    if (derpSlider.DrawDefaultBtn) {
        // this allows reverting the slider value back to a default one set in the Node Settings option panel
        derpSlider.DrawDefaultBtn_Pos = [
            sliderBG_X + derpSlider.Spacing,
            sliderBG_Y + derpSlider.Spacing,
            sliderBG_H * derpSlider.LRbtnWidth - derpSlider.Spacing * 2,
            sliderBG_H - derpSlider.Spacing * 2,
        ]
        let [defaultBtn_X, defaultBtn_Y, defaultBtn_W, defaultBtn_H] = derpSlider.DrawDefaultBtn_Pos;
        ctx.fillStyle = getRGBA(derpSliderPalette.c_LRbtnColor);
        ctx.beginPath();
        ctx.roundRect(defaultBtn_X, defaultBtn_Y, defaultBtn_W, defaultBtn_H, derpSlider.Corner);
        ctx.fill();
        // draw indicator icon
        ctx.fillStyle = getRGBA(derpSlider.c_BtnColors[0]);
        const fontSize = defaultBtn_W * derpSlider.BtnIcons[0];
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(derpSlider.BtnIcons[3], defaultBtn_X + defaultBtn_W / 2, defaultBtn_Y + defaultBtn_H / 2 * 1.1 );
    }
    /* -------------------- Draw LRbtn -------------------- */
    // for lack of a better word...these are the buttons pointing left and right for value adjustment
    let offsetMultiplier = 1;
    if (derpSlider.DrawDefaultBtn) offsetMultiplier += 1;
    derpSlider.Lbtn_Pos = [0, 0, 0, 0];
    derpSlider.Rbtn_Pos = [0, 0, 0, 0];
    let [Lbtn_X, Lbtn_Y, Lbtn_W, Lbtn_H] = derpSlider.Lbtn_Pos;
    let [Rbtn_X, Rbtn_Y, Rbtn_W, Rbtn_H] = derpSlider.Lbtn_Pos;
    let [, , defaultBtn_W]  = derpSlider.DrawDefaultBtn_Pos;
    if (derpSlider.DrawLRbtn) {
        derpSlider.Lbtn_Pos = [
            sliderBG_X + defaultBtn_W + derpSlider.Spacing * offsetMultiplier,
            sliderBG_Y + derpSlider.Spacing,
            sliderBG_H * derpSlider.LRbtnWidth - derpSlider.Spacing * 2,
            sliderBG_H - derpSlider.Spacing * 2,
        ];
        // draw buttons
        derpSlider.Rbtn_Pos = [
            sliderBG_X + sliderBG_W - (sliderBG_H - derpSlider.Spacing * 2) * derpSlider.LRbtnWidth - derpSlider.Spacing,
            sliderBG_Y + derpSlider.Spacing,
            (sliderBG_H - derpSlider.Spacing * 2) * derpSlider.LRbtnWidth,
            sliderBG_H - derpSlider.Spacing * 2,
        ];
        [Lbtn_X, Lbtn_Y, Lbtn_W, Lbtn_H] = derpSlider.Lbtn_Pos;
        [Rbtn_X, Rbtn_Y, Rbtn_W, Rbtn_H] = derpSlider.Rbtn_Pos;
        ctx.fillStyle = getRGBA(derpSliderPalette.c_LRbtnColor);
        ctx.beginPath();
        ctx.roundRect(Lbtn_X, Lbtn_Y, Lbtn_W, Lbtn_H, derpSlider.Corner);
        ctx.roundRect(Rbtn_X, Rbtn_Y, Rbtn_W, Rbtn_H, derpSlider.Corner);
        ctx.fill();
        // draw icons
        ctx.fillStyle = getRGBA(derpSlider.c_BtnColors[0]);
        const fontSize = Lbtn_W * derpSlider.BtnIcons[0];
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if(derpSlider.DrawLRbtn){
            ctx.fillText(derpSlider.BtnIcons[1], Lbtn_X + Lbtn_W / 2, Lbtn_Y + Lbtn_H / 2 * 1.1);
            ctx.fillText(derpSlider.BtnIcons[2], Rbtn_X + Rbtn_W / 2, Lbtn_Y + Rbtn_H / 2 * 1.1 );
        }
    }
    /* -------------------- Draw FillBar -------------------- */
    if (derpSlider.DrawLRbtn) offsetMultiplier += 1;
    derpSlider.FillBarFullWidth = sliderBG_W - (defaultBtn_W + Lbtn_W + Rbtn_W + derpSlider.Spacing * (offsetMultiplier + 2));
    derpSlider.FillBar_Pos = [
        sliderBG_X + defaultBtn_W + Lbtn_W + derpSlider.Spacing * offsetMultiplier,
        sliderBG_Y + derpSlider.Spacing,
        derpSlider.FillBarFullWidth * derpSlider.FillRate.X,
        sliderBG_H - derpSlider.Spacing * 2,
    ]
    const [fillBarX, fillBarY, fillBarW, fillBarH] = derpSlider.FillBar_Pos;
    applyGlobalFX (ctx, node);
    ctx.fillStyle = getRGBA(derpSliderPalette.c_FillBarColor);
    ctx.beginPath();
    ctx.roundRect(fillBarX, fillBarY, fillBarW, fillBarH, derpSlider.Corner);
    ctx.fill();
    resetEffects(ctx);
}

export function drawText (ctx, node, nodeLabel, nodeValue){
    const {derpCanvas, derpPalette } = node.prop;
    const contentH = derpCanvas.Content_Pos[3];
    const headerFontSize = derpCanvas.HeaderFontSize || (contentH * derpCanvas.AutoFontRatio / 2);
    const outputFontSize = derpCanvas.OutputFontSize || (contentH * derpCanvas.AutoFontRatio / 2);
    // HeaderText
    ctx.fillStyle = getRGBA(derpPalette.c_HeaderTextColor);
    ctx.textAlign = derpCanvas.textAlign[0];
    ctx.textBaseline = "middle";
    ctx.font = `${headerFontSize}px ${derpCanvas.HeaderFont}`;
    ctx.fillText(nodeLabel, derpCanvas.HeaderText_pos[0], derpCanvas.HeaderText_pos[1]);
    // outputText
    ctx.fillStyle = getRGBA(derpPalette.c_OutputTextColor);
    ctx.textAlign = derpCanvas.textAlign[1];
    ctx.font = `${outputFontSize}px ${derpCanvas.OutputFont}`;
    ctx.fillText(nodeValue, derpCanvas.OutputText_pos[0], derpCanvas.OutputText_pos[1]);
}
// ======================================== Draw ComboBox ========================================
export function drawComboBox (ctx, node, comboList, derpX, derpY, ){
    const {derpCanvas, derpComboLoader, derpComboPalette, derpComboEffect } = node.prop;
    const [mLeft, mRight, mTop, mBottom] = derpComboLoader.Margins;
    const comboBoxEntryHeight = 12;
    const promptY = derpCanvas.DrawHeader ? derpCanvas.Content_Pos[1] +derpCanvas.Header_Pos[3] : derpCanvas.Content_Pos[1] ;
    const promptHeight = derpCanvas.DrawHeader ? derpCanvas.Content_Pos[3] - derpCanvas.Header_Pos[3] : derpCanvas.Content_Pos[3];
    const c_PromptBG = derpComboLoader.ComboBox_Palette[1];
    derpComboLoader.ComboPrompt_Pos = [
        derpCanvas.Content_Pos[0] + mLeft,
        promptY + mTop,
        derpCanvas.Content_Pos[2] - mLeft - mRight,
        promptHeight - mTop - mBottom,
    ];
    const [promptBoxX, promptBoxY, promptBoxW, promptBoxH] =  derpComboLoader.ComboPrompt_Pos;
    const promptBoxMouseover = withinBounds( node.pos[0] +promptBoxX, node.pos[1] +promptBoxY, promptBoxW, promptBoxH, derpX, derpY );
    if (!derpComboLoader.ComboIsOpen){
        derpComboLoader.ComboBox_Pos = [
            derpCanvas.Size[0] + (derpX - node.pos[0]) + 5,
            (derpCanvas.Size[3] - LiteGraph.NODE_TITLE_HEIGHT) / 2 - comboBoxEntryHeight * comboList.length / 2,
            derpComboLoader.ComboListWidth + derpComboLoader.ComboList_MarginX * 2,
            comboBoxEntryHeight * comboList.length + derpComboLoader.ComboList_MarginY * 2,
        ];
    }
    let [ x, y, w, h ] = derpComboLoader.ComboBox_Pos;
    /* -------------------- Draw ComboPrompt-------------------- */
    const c_PromptBG_MoAlpha = extractAlpha( c_PromptBG ) * 1.3;

    let mouseClicked = app.canvas.last_click_position;

    ctx.fillStyle = promptBoxMouseover? getRGBA(c_PromptBG, c_PromptBG_MoAlpha) : getRGBA(c_PromptBG);
    ctx.beginPath();
    ctx.roundRect(promptBoxX, promptBoxY, promptBoxW, promptBoxH, derpCanvas.ContentCorner);
    ctx.fill();
    if ( promptBoxMouseover && mouseClicked !== null && !derpComboLoader.ComboIsOpen && derpComboLoader.PrevMouseclick !== app.canvas.last_mouseclick ) {
        mouseClicked = null;
        derpComboLoader.ComboIsOpen = true;
    }
    /* -------------------- Draw ComboBox Selections -------------------- */
    if ( derpComboLoader.ComboIsOpen){
        const actualY = y + derpComboLoader.ComboList_MarginY;
        const ComboBoxMouseover = withinBounds( node.pos[0] + x, node.pos[1] + actualY, w, h, derpX, derpY );
        /* -------------------- Draw ComboBox BG -------------------- */

        const entryY = Math.round ((derpY - node.pos[1] - actualY + LiteGraph.NODE_TITLE_HEIGHT ) / comboBoxEntryHeight ); //+ h - LiteGraph.NODE_TITLE_HEIGHT / 2
        const c_ComboBoxBG = derpComboLoader.ComboBox_Palette[0];
        let comboIndex = -1;
        if ( !ComboBoxMouseover && !promptBoxMouseover && mouseClicked!== null) derpComboLoader.ComboIsOpen = false;
        ctx.fillStyle = getRGBA(c_ComboBoxBG);
        ctx.beginPath();
        ctx.roundRect(x, y - derpComboLoader.ComboList_MarginY, w, h, derpCanvas.ContentCorner);
        ctx.fill();
        if ( ComboBoxMouseover && entryY > 1 && entryY <= comboList.length + 1){
            comboIndex = entryY - 2;
            ctx.fillStyle = getRGBA('200, 140, 10, 0.8');
            ctx.beginPath();
            ctx.roundRect(
                derpComboLoader.ComboBox_Pos[0],
                derpComboLoader.ComboBox_Pos[1]  + comboBoxEntryHeight *  (entryY - 1) - comboBoxEntryHeight,
                derpComboLoader.ComboBox_Pos[2],
                comboBoxEntryHeight,
                0);
            ctx.fill();
            if (mouseClicked !== null)
            {
                node.widgets[0].value = comboList[comboIndex];
                derpComboLoader.ComboIsOpen = false;
                derpComboLoader.PrevMouseclick = app.canvas.last_mouseclick; // log this click so it won't be used in the next loop
            }
        }
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.font = `${derpComboLoader.ComboList_Font}px ${derpComboLoader.ComboList_FontSize}`;
        for (let i = 0; i < comboList.length; i++) {
            if (i === comboIndex){
                ctx.fillStyle = getRGBA('255, 255, 255, 0.80');
            } else {
                ctx.fillStyle = getRGBA(derpComboPalette.ComboFontColor);
            }
            ctx.fillText(comboList[i], x + derpComboLoader.ComboList_MarginX , y + comboBoxEntryHeight *  i + comboBoxEntryHeight / 2 );
        }
    }
}