// derpMenus by lordwedggie
// all the menus used by these derps
// ================== derpSlider ==================
// ================== Base Menus ==================
export function getOptionMenuIndex() {
    // Find the key 'ToggleMenuName' in the selected option and add its first entry to the array
    const menuNamesArray = [];
    OptionMenu.forEach(option => {
        // Check if the current entry has the 'ToggleMenuName' key
        if ('OptionMenuName' in option) {
            // Add all strings from the 'ToggleMenuName' array to menuNamesArray
            option['OptionMenuName'].forEach(name => { // Correct way to access the property
                menuNamesArray.push(name);
            });
        }
    });
    return menuNamesArray;
}
export const OptionMenu = [
    {
        'OptionMenuName': ['🟩 Node Settings'],
        'tip': [''],
        'Close panel' :['Close'],
    },
    {
        'OptionMenuName': ['🟦 Main Palette'],
        'tip': ['* Set color first then use buttons to adjust brightness'],
        'Canvas BG': ['derpPalette.c_CanvasBG','ColorOptionIndex: 2'],
        'Header BG': ['derpPalette.c_HeaderBG'],
        'Content BG': ['derpPalette.c_ContentBG'],
        'Header Text': ['derpPalette.c_HeaderTextColor', 'ColorOptionIndex: 3'],
        'Output Text': ['derpPalette.c_OutputTextColor'],
        'Close panel' :['Close'],
    },
    {
        'OptionMenuName': ['🟨 Effects options'],
        'tip': ['* Shadows can \'glow\' with brighter colors'],
        'Global FX blur': ['derpEffects.GlobalFX[1]', 0, 20, 1, 0.1],
        'Global FX offsetX': ['derpEffects.GlobalFX[2]', 0, 20, 1, 0.1],
        'Global FX offsetY': ['derpEffects.GlobalFX[3]', 0, 20, 1, 0.1],
        'Canvas stroke weight': ['derpEffects.CanvasStrokeWeight', 0, 10, 1, 0.1,'ColorOptionIndex: 2'],
        'Canvas shadow blur': ['derpEffects.CanvasShadowBlur', 0, 20, 1, 0.1],
        'Canvas shadow X offset': ['derpEffects.CanvasFX_offsetX', -10, 10, 1, 0.1],
        'Canvas shadow Y offset': ['derpEffects.CanvasFX_offsetY', -10,10, 1, 0.1],
        'Content stroke weight': ['derpEffects.ContentStrokeWeight', 0, 10, 1, 0.1, 'ColorOptionIndex: 3'],
        'Content shadow blur': ['derpEffects.ContentShadowBlur',0, 20, 1, 0.1],
        'Content shadow X offset': ['derpEffects.ContentFX_offsetX', -10, 10, 1, 0.1],
        'Content shadow Y offset': ['derpEffects.ContentFX_offsetY', -10, 10, 1, 0.1],
        'Close panel' :['Close'],
    },
    {
        'OptionMenuName': ['🟪 Effects palette'],
        'tip': ['* settings can be saved using ComfyUI template feature'],
        'Global FX color': ['derpEffects.GlobalFX[0]', 'ColorOptionIndex: 0'],
        'Canvas shadow': ['derpEffectPalette.c_CanvasFX', 'ColorOptionIndex: 1'],
        'Canvas stroke': ['derpEffectPalette.c_CanvasStroke'],
        'Content shadow': ['derpEffectPalette.c_ContentFX', 'ColorOptionIndex: 2'],
        'Content stroke': ['derpEffectPalette.c_ContentStroke'],
        'Close panel' :['Close'],
    },
    {
        'OptionMenuName': ['⚙ Canvas layout'],
        'tip': ['* Set font sizes to zero to use auto fontSize'],
        'Width': ['derpCanvas.Size[2]', 50, 400, 10, 2,'ColorOptionIndex: 4'],
        'Height': ['derpCanvas.Size[3]', 20, 400, 10, 2],
        'Header ratio': ['derpCanvas.ContentRatio', 0.1, 0.9, 0.1, 0.2,'ColorOptionIndex: 1'],
        'AutoFont ratio': ['derpCanvas.AutoFontRatio', 0.1, 0.9, 0.1, 0.2],
        'Header font': ['derpCanvas.HeaderFont'],
        'Output font': ['derpCanvas.OutputFont'],
        '*Header font size': ['derpCanvas.HeaderFontSize',0, 24, 1, 2],
        '*Output font size': ['derpCanvas.OutputFontSize',0, 24, 1,2],
        'Canvas corner': ['derpCanvas.CanvasCorner', 0, 20, 1, 0.5, 'ColorOptionIndex: 2'],
        'Content corner': ['derpCanvas.ContentCorner', 0, 20, 1, 0.5],
        'Text MarginX': ['derpCanvas.TextMarginX', -100, 100, 1, 0.5],
        'Text MarginY': ['derpCanvas.TextMarginY', -100, 100, 1, 0.5],
        'Margin left': ['derpCanvas.Margins[0]', 0, 20, 1, 0.5, 'ColorOptionIndex: 0'],
        'Margin right': ['derpCanvas.Margins[1]', 0, 20, 1, 0.5],
        'Margin top': ['derpCanvas.Margins[2]', 0, 20, 1, 0.5],
        'Margin bottom': ['derpCanvas.Margins[3]', 0, 20, 1, 0.5],
        'Slot offsetX': ['derpCanvas.SlotOffset[0]', -100, 100, 1, 0.5, 'ColorOptionIndex: 3'],
        'Slot offsetY': ['derpCanvas.SlotOffset[1]', -100, 100, 1, 0.5],
        'Close panel' :['Close'],
    }
];


// ==================== ToggleMenu ====================
// key: prop.name, display name, value to assign,
export const baseToggleMenuOptions = [
    {
        'ToggleMenuName': ['🔞 Node options', '🟢', '🟠'],
        'Draw Header space': ['derpCanvas.DrawHeader', 'Draw header space', 'bool'],
    },
    {
        'ToggleMenuName': ['🔞 Node corner shape'],
        'FULL': ['derpCanvas.CornerFlag', 'FULL'],
        'TOP-LEFT': ['derpCanvas.CornerFlag', 'TOP-LEFT'],
        'TOP': ['derpCanvas.CornerFlag', 'TOP'],
        'TOP-RIGHT': ['derpCanvas.CornerFlag', 'TOP-RIGHT'],
        'LEFT': ['derpCanvas.CornerFlag', 'LEFT'],
        'CENTER': ['derpCanvas.CornerFlag', 'CENTER'],
        'RIGHT': ['derpCanvas.CornerFlag', 'RIGHT'],
        'BOTTOM-LEFT': ['derpCanvas.CornerFlag', 'BOTTOM-LEFT'],
        'BOTTOM': ['derpCanvas.CornerFlag', 'BOTTOM'],
        'BOTTOM-RIGHT': ['derpCanvas.CornerFlag', 'BOTTOM-RIGHT'],
    },
    {
        'ToggleMenuName': ['🔞 Text alignment'],
        'Left': ['derpCanvas.TextAlignment','left','left'],
        'Right': ['derpCanvas.TextAlignment', 'right','right'],
        'Center': ['derpCanvas.TextAlignment','center','center'],
        'Split': ['derpCanvas.TextAlignment','split','split'],
    },
    {
        'ToggleMenuName': ['🔞 Effects', '🟢', '🟠'],
        'Global FX': ['derpEffects.DrawGlobalFX', 'Global effects', 'bool'],
        'Canvas Shadow': ['derpEffects.CanvasShadow', 'Canvas shadow', 'bool'],
        'Canvas Stroke': ['derpEffects.CanvasStroke', 'Canvas stroke', 'bool'],
        'Content Shadow': ['derpEffects.ContentShadow', 'Content shadow', 'bool'],
        'Content stroke': ['derpEffects.ContentStroke', 'Content stroke', 'bool'],
    },
];
