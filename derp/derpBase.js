// DerpNode: derpBaseAlpha by lordwedggie
import { getRGBA } from "./Herbina/shitUtils.js";
import { getOptionMenuIndex } from "./Herbina/derpMenus.js";
import { derpContextMapper } from "./Herbina/coolUtils.js";
import { derpPanelOpen } from "./Herbina/optionPanel.js";
//==========================LGraph registration/==========================
export class derpBase {
    constructor(node) {
        this.node = node;
        this.node.prop = this.node.properties || {};
        this.node.prop.derpCanvas = {
            Size: [0, - LiteGraph.NODE_TITLE_HEIGHT, 100, 100],
            Margins: [4,4,4,4], // in the format of left right top bottom
            CornerMap: [8,8,8,8],
            CornerFlag: 'FULL',
            HeaderFont: "DengXian",
            OutputFont: "DengXian light",
            ContentRatio: 0.4,  // wrong name, should be header ratio, too lazy to change it
            AutoFontRatio: 0.5,
            HeaderFontSize: 0,
            OutputFontSize: 0,
            TextMarginX: 4,
            TextMarginY: 0,
            CanvasCorner: 8,
            ContentCorner: 6,
            TextAlignment: 'split',
            stashedTitle: 'xcp',
            DrawHeader: true,
            SlotOffset: [8, 8],
            textAlign: [],
            Content_Pos: [8,8,8,8],
            Header_Pos: [0, 0, 0, 0],
            HeaderText_pos: [0, 0],
            OutputText_pos: [0, 0],
            PadRight: 16,
            PadLeft: 0,
            HideLinks: true,
            IsOptionsPanelOpen: 0,
            DerpPanel: { X: 0, Y: 0, W: 150, H: 100, C: 8, margin: 8, font1: 6, font2: 6, panelStartY: 20, padLeft: 80, fieldW: 60, spacingY: 2 },
            OutputIsConnected: 0,
            ExtraMenuIndex: [],
            ToggleMapOptions: [],
            ExtraMenuOptions: [],
            CurrentOptionKeys: [],
            DerpOutputPos: [],
            SizeChanged: false,
            PrevSize: [0,0],
            AlignmentChanged: false,
            ComputeSizeMin: [100, 20],
            ColorOptions: [
                '050, 050, 050, 1.0',
                '100, 080, 080, 0.9',
                '080, 100, 080, 0.9',
                '080, 080, 100, 0.9',
                '140, 120, 80, 0.9',
            ]
        };
        this.node.prop.derpPalette = {
            c_CanvasBG: "045, 045, 045, 1",
            c_HeaderBG: "065, 065, 065, 1",
            c_ContentBG: "035, 035, 035, 1",
            c_HeaderTextColor: "255, 255, 255, 0.5",
            c_OutputTextColor: "255, 255, 255, 0.8",
        };
        this.node.prop.derpEffects = {
            DrawGlobalFX: true,
            GlobalFX: ['100, 200, 100, 0.50', 8, 0, 0],  // on/off, RGBA color, blur, offsetX, offsetY
            CanvasStroke: false,
            CanvasStrokeWeight: 1,
            CanvasShadow: true,
            CanvasShadowBlur: 8,
            CanvasFX_offsetX: 0,
            CanvasFX_offsetY: 2,
            ContentStroke: false,
            ContentStrokeWeight: 1,
            ContentShadow: true,
            ContentShadowBlur: 8,
            ContentFX_offsetX: 0,
            ContentFX_offsetY: 2,
        };
        this.node.prop.derpEffectPalette = {
            c_CanvasStroke: "045, 045, 045, 1.00",
            c_CanvasFX: "000, 000, 000, 0.50",
            c_ContentStroke: "025, 025, 025, 1.00",
            c_ContentFX: "000, 000, 000, 0.50",
        };
        //this.node.prop.extraOptions = []; //holds entries for extraMenu (does not include expanded menus)
        this.node.prop.CanvasOffset = 0;
        this.node.prop.CanvasWidthFix = 1;

        const baseExtraOptions = [
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
        // key: prop.name, display name, value to assign,
        const baseToggleMenuOptions = [
            {
                'ToggleMenuName': ['🔞 Node options', '🟢', '🟠'],
                'DrawHeader': ['derpCanvas.DrawHeader', 'Draw header space', 'bool'],
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
                'Left': ['derpCanvas.TextAlignment','⇤ left','left'],
                'Right': ['derpCanvas.TextAlignment', '⇥ right','right'],
                'Center': ['derpCanvas.TextAlignment','⤒ center','center'],
                'Split': ['derpCanvas.TextAlignment','⟷ split','split'],
                'Vertical-Split-L': ['derpCanvas.TextAlignment', '⤢ vertical-split-L', 'vertical-split-L'],
                'Vertical-Split-C': ['derpCanvas.TextAlignment', '⇵ vertical-split-C', 'vertical-split-C'],
                'Vertical-Split-R': ['derpCanvas.TextAlignment', '⤡ vertical-split-R', 'vertical-split-R']
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

        /* ================ unsaved globals ================ */
        let outputNodeID = null;    //the last node connected to, output slot will be moved there
        let targetNode = node;      //the node connected to the output slot
        let targetSlotOffsetY = 0;  //offset for target slot other than #0
        let outputTargetPos = [0, 0];   //connected target slot pos, for moving our own slot


        /* ================ onConnectionsChange ================ */
        this.node.onConnectionsChange = function (slotType, slot, isChangeConnect, link_info) {
            const { derpCanvas } = this.prop;
            this.prop.derpCanvas.OutputIsConnected = this.outputs[0].links.length;

            if (this.prop.derpCanvas.OutputIsConnected > 0 && link_info && link_info.id != null && this.graph.links[link_info.id]) {
                const linkID = link_info.id;
                this.graph.links[linkID].color = derpCanvas.HideLinks ? getRGBA("0, 0, 0, 0") : LiteGraph.LINK_COLOR;
                this.graph.links[linkID].color_off = derpCanvas.HideLinks ? getRGBA("0, 0, 0, 0") : LiteGraph.LINK_COLOR;
                outputNodeID = this.graph.links[linkID].target_id;
                // Access the target node
                targetNode = this.graph.getNodeById(outputNodeID);
                if (targetNode && targetNode.inputs && targetNode.inputs.length > 0) {
                    targetSlotOffsetY = LiteGraph.NODE_SLOT_HEIGHT * (targetNode.graph.links[linkID].target_slot + 1) - (LiteGraph.NODE_SLOT_HEIGHT * (Math.PI / 10));
                    outputTargetPos = [
                        targetNode.pos[0] - this.pos[0] + LiteGraph.NODE_SLOT_HEIGHT / 2,
                        targetNode.pos[1] - this.pos[1] + targetSlotOffsetY// + this.prop.derpCanvas.SlotOffset[1],
                    ];
                }
                derpCanvas.PadRight = 0;
            } else {
                derpCanvas.PadRight = 12;
            }
        }

        // adding options with submenu
        this.node.getExtraMenuOptions = function () {
            const options = this.prop.derpCanvas.toggleMenuOptions.flatMap(optionSet => {
                const toggleMenuName = optionSet.ToggleMenuName[0]; // Assuming there's always one name
                return [
                    {
                        content: toggleMenuName,
                        has_submenu: true,
                        callback: this.make_submenu,
                    },
                ];
            });
            const menuKey = getOptionMenuIndex();
            menuKey.forEach((key) => {
                options.push( {
                    content: key,
                    callback: () => {
                        this.contextSubMenuClick(key);
                    }
                });
            });
            return options;
        };
        // make sub menus
        this.node.make_submenu = function (value, options, e, menu, node) {
            const menuItemsMap = {};
            let iconTrue = '', iconFalse = '';
            node.properties.derpCanvas.toggleMenuOptions.forEach(optionSet => {
                const menuName = optionSet['ToggleMenuName'][0]; // Assuming there's always one name
                menuItemsMap[menuName] = menuItemsMap[menuName] || [];

                Object.entries(optionSet).forEach(([key, value]) => {
                    if (key === 'ToggleMenuName') {
                        [iconTrue, iconFalse] = value.slice(1, 3); // Directly assign icons
                        return;
                    }
                    // convert string to variable name
                    const target = value[0].split('.').reduce((acc, prop) => acc[prop], node.prop);
                    let displayValue = (typeof target === 'boolean') ?
                        `${target ? iconTrue : iconFalse} ${value[1]}` : value[1];
                    menuItemsMap[menuName].push(displayValue);
                });
            });
            const menuKey = menuItemsMap[value.content] || [];
            new LiteGraph.ContextMenu(
                menuKey,
                {
                    event: e,
                    callback: derpKey => node.handleContextMenu(derpKey),
                    parentMenu: menu,
                    node: node
                }
            );
        };
        /* ================================ Handle Context Menu ================================ */
        this.node.handleContextMenu = function (derpKey) {
            const { derpCanvas } = this.prop;
            const parsedKey = derpKey.substring(2);
            for (const optionSet of derpCanvas.toggleMenuOptions) {
                for (const [key, pathName] of Object.entries(optionSet)) {
                    //console.log ('key, pathName:', key, pathName);
                    // Skip ToggleMenuName entries
                    if (key === 'ToggleMenuName') continue;
                    if (key === 'DrawHeader') derpCanvas.AlignmentChanged = true;
                    // Handle boolean toggles
                    if (pathName[2] === 'bool' && pathName[1].trim() === parsedKey.trim()) {
                        const target = pathName[0].split('.').reduce((acc, prop) => acc[prop], node.prop);
                        derpContextMapper(pathName[0], !target, node);
                        return; // Exit early after handling toggle
                    }
                    // Handle index numbers
                    let pathIndex = 1;
                    const alignmentKeys = new Set(['Left', 'Right', 'Center', 'Split', 'Vertical-Split-L', 'Vertical-Split-C','Vertical-Split-R',]);
                    const isAlignmentChange = alignmentKeys.has (key);
                    if (isAlignmentChange) {
                        pathIndex = 2;
                        derpCanvas.AlignmentChanged = true;
                    }
                    // Handle array-based options
                    if (Array.isArray(pathName) && pathName.includes(derpKey)) {
                        derpContextMapper(pathName[0], pathName[pathIndex], node);
                        return; // Exit early after handling array option
                    }
                }
            }
        };
        // ================== updating the almost useless cornerMap feature ==================
        this.node.updateCornerMap = function ( derpKey ) {
            const { derpCanvas } = node.prop;
            const cornerMap = {
                "TOP-LEFT": [derpCanvas.CanvasCorner, 0, 0, 0],
                "TOP": [derpCanvas.CanvasCorner, derpCanvas.CanvasCorner, 0, 0],
                "TOP-RIGHT": [0, derpCanvas.CanvasCorner, 0, 0],
                "LEFT": [derpCanvas.CanvasCorner, 0, 0, derpCanvas.CanvasCorner],
                "CENTER": [0, 0, 0, 0],
                "RIGHT": [0, derpCanvas.CanvasCorner, derpCanvas.CanvasCorner, 0],
                "BOTTOM-LEFT": [0, 0, 0, derpCanvas.CanvasCorner],
                "BOTTOM": [0, 0, derpCanvas.CanvasCorner, derpCanvas.CanvasCorner],
                "BOTTOM-RIGHT": [0, 0, derpCanvas.CanvasCorner, 0],
                "FULL": [derpCanvas.CanvasCorner, derpCanvas.CanvasCorner, derpCanvas.CanvasCorner, derpCanvas.CanvasCorner]
            };
            if (cornerMap[derpKey]) {
                this.prop.derpCanvas.CornerMap = cornerMap[derpKey];
            }
        }
        /* ================================ extra subMenu clicked ================================ */
        this.node.contextSubMenuClick = function (derpKey) {
            const { derpCanvas } = this.prop;
            const indexOfTargetObject = derpCanvas.ExtraMenuOptions.findIndex((option) => {
                return option['OptionMenuName'].some(optionName => optionName.includes(derpKey));
            });
            const openedMenuIndex = indexOfTargetObject + 1;
            derpCanvas.IsOptionsPanelOpen = (derpCanvas.IsOptionsPanelOpen === openedMenuIndex) ? 0 : openedMenuIndex;
            if (derpCanvas.IsOptionsPanelOpen === 0) {
                this.size[0] = derpCanvas.Size[2];
                this.size[1] = derpCanvas.Size[3] - LiteGraph.NODE_TITLE_HEIGHT;
            }
        };
        // ================== derpSlot handler ==================
        this.node.updateDerpSlot = function () {
            const { derpCanvas } = this.prop;
            let slotOffsetX = LiteGraph.NODE_SLOT_HEIGHT / 2;
            let slotOffsetY = targetSlotOffsetY;

            if (targetNode.collapsed) {
                //slotOffsetY = -this.prop.slotOffsetY;
                slotOffsetX = 0;
            }

            const updateSlotPos = () => {
                outputTargetPos = [
                    targetNode.pos[0] - this.pos[0] + slotOffsetX,
                    targetNode.pos[1] - this.pos[1] + slotOffsetY// + this.prop.derpCanvas.SlotOffset[1],
                ];
                this.outputs[0].pos = outputTargetPos;
            };

            updateSlotPos.call(this);
            derpCanvas.PadRight = 0;

            if (this.is_selected) {

                derpCanvas.PadRight = 12;
                this.outputs[0].pos = derpCanvas.DerpOutputPos;
            } else if (targetNode.collapsed) {
                if (!this.is_selected && !targetNode.is_selected) {

                    slotOffsetY = - LiteGraph.NODE_SLOT_HEIGHT / 2 - 2;
                    slotOffsetX = 0;
                    this.outputs[0].pos = [outputTargetPos[0], outputTargetPos[1]];
                    derpCanvas.PadRight = 0;
                    updateSlotPos.call(this);
                } else {

                    this.outputs[0].pos = derpCanvas.DerpOutputPos;
                    derpCanvas.PadRight = 12;
                }
                return;
            } else if (targetNode.is_selected && !targetNode.collapsed) {
                derpCanvas.PadRight = 12;
                this.outputs[0].pos = derpCanvas.DerpOutputPos;
                return;
            }

            if (!this.prevTargetNodePos) {
                this.prevTargetNodePos = [...targetNode.pos];
                return;
            }

            if (targetNode.is_selected && (targetNode.pos[0] !== this.prevTargetNodePos[0] || targetNode.pos[1] !== this.prevTargetNodePos[1])) {
                updateSlotPos.call(this);
                return;
            }

            this.prevTargetNodePos = [...targetNode.pos];

            if (targetNode.collapsed && targetNode.is_selected && !this.is_selected) {
                derpCanvas.PadRight = 12;
                this.outputs[0].pos = derpCanvas.DerpOutputPos;
                return;
            }
            if (targetNode.collapsed && !targetNode.is_selected && !this.is_selected) {
                slotOffsetX = 0;
                updateSlotPos.call(this);
                derpCanvas.PadRight = 0;
            }
            derpCanvas.SizeChanged = true;
        };
        // ================== shared function calls by derps in ctx loop ==================
        this.node.commonDraw = function (ctx) {
            const {derpCanvas } = this.prop;
            // updates slots positions, note: add input slots
            const [, , canvasW] = derpCanvas.Size;
            const titleOffsetHeight = LiteGraph.NODE_TITLE_HEIGHT;
            derpCanvas.DerpOutputPos = [canvasW - derpCanvas.SlotOffset[0], derpCanvas.SlotOffset[1] - titleOffsetHeight];
            if (derpCanvas.OutputIsConnected) {
                node.updateDerpSlot();
            } else {
                derpCanvas.PadRight = 12;
                this.outputs[0].pos = derpCanvas.DerpOutputPos;
            }
            // handles options panel, calls derpPanel if any of the panels are open.
            if (derpCanvas.IsOptionsPanelOpen === 0) {
                derpCanvas.Size[2] = this.size[0];
                derpCanvas.Size[3] = this.size[1] + LiteGraph.NODE_TITLE_HEIGHT;
            }
            // handles opened options panels
            if (derpCanvas.IsOptionsPanelOpen !== 0) {
                derpPanelOpen(ctx, node, derpCanvas.ExtraMenuOptions[derpCanvas.IsOptionsPanelOpen - 1]);
            }
        };
        /* ================================ Handles node title ================================ */
        this.node.handleTitle = function (currentTitle) {
            if (this.title !== this.prop.derpCanvas.stashedTitle){
                const newTitle = this.title;
                this.title = this.prop.derpCanvas.stashedTitle;
                return newTitle;
            }
            return currentTitle;
        };
        // ================== extraMenu handler ==================
        this.node.loadExtraMenuOptions = function ( menuIndex, indexStart, newOptions) {
            const {derpCanvas } = this.prop;
            let tempOptions;
            // check if it's first time loading, or is adding option items
            if (!Array.isArray(derpCanvas.ExtraMenuOptions ) || derpCanvas.ExtraMenuOptions .length === 0) {
                tempOptions = baseExtraOptions;
            } else tempOptions = derpCanvas.ExtraMenuOptions ;
            // adding new options to menus
            if (menuIndex !== undefined && indexStart !== undefined && newOptions !== undefined ) {
                // Create a new object to retain the format
                const mergedOptions = {};
                const sourceMenu = tempOptions[menuIndex]
                // Copy entries up to the indexStart entry from requested menu
                let index = 0;
                for (const key in sourceMenu) {
                    if (index === indexStart) break; // Stop before the 2nd entry to insert sliderOptions
                    mergedOptions[key] = sourceMenu[key];
                    index++;
                }
                // Insert new options
                for (const key in newOptions) {
                    mergedOptions[key] = newOptions[key];
                }
                // Continue copying the rest of the sourceMenu
                for (const key in sourceMenu) {
                    if (mergedOptions.hasOwnProperty(key)) continue; // Skip already added keys
                    mergedOptions[key] = sourceMenu[key];
                }
                tempOptions[menuIndex] = mergedOptions;
            }
            derpCanvas.ExtraMenuOptions = tempOptions;
        }
        /*================================ Comfy extraMenu ================================ */
        // load toggleMenuOptions from derpMenus, and accept menu insertions from derp children
        this.node.loadToggleMenuOptions = function ( menuIndex, indexStart, newOptions ) {
            const {derpCanvas } = this.prop;
            let toggleOptions;
            if (!Array.isArray(derpCanvas.toggleMenuOptions) || derpCanvas.toggleMenuOptions.length === 0) {
                toggleOptions = baseToggleMenuOptions;
            } else toggleOptions = derpCanvas.toggleMenuOptions;
            if (menuIndex !== undefined && indexStart !== undefined && newOptions !== undefined ) {
                // Create a new object to retain the format
                const mergedOptions = {};
                const sourceMenu = toggleOptions[menuIndex]
                // Copy entries up to the indexStart entry from requested menu
                let index = 0;
                for (const key in sourceMenu) {
                    if (index === indexStart) break; // Stop before the 2nd entry to insert sliderOptions
                    mergedOptions[key] = sourceMenu[key];
                    index++;
                }
                // Insert new options
                for (const key in newOptions) {
                    mergedOptions[key] = newOptions[key];
                }
                // Continue copying the rest of the sourceMenu
                for (const key in sourceMenu) {
                    if (mergedOptions.hasOwnProperty(key)) continue; // Skip already added keys
                    mergedOptions[key] = sourceMenu[key];
                }
                toggleOptions[menuIndex] = mergedOptions;
            }
            derpCanvas.toggleMenuOptions = toggleOptions;
        }
    }
}
