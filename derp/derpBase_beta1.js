// DerpNode: derpBaseAlpha by lordwedggie
import { getRGBA } from "./Herbina/shitUtils.js";
import { toggleMenuOptions, getOptionMenuIndex, OptionMenu } from "./Herbina/derpMenus.js";
import { derpContextMapper } from "./Herbina/coolUtils.js";
//==========================LGraph registration/==========================
export class derpBase_beta1 {
    constructor(node) {
        this.node = node;
        this.node.prop = this.node.properties || {};
        this.node.prop.derpCanvas = {
            Size: [0, - LiteGraph.NODE_TITLE_HEIGHT, 100, 100],
            Margins: [4,2,4,4], // in the format of left right top bottom
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
            TextAlignment: "split",
            stashedTitle: "xcp",
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
            ExtraMenuOptions: [],
            ExtraMenuIndex: [],
            ToggleMenuOptions: [],
            DerpOutputPos: [],
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
        this.node.prop.extraOptions = []; //holds entries for extraMenu (does not include expanded menus)
        this.node.prop.CanvasOffset = 0;
        this.node.prop.CanvasWidthFix = 1;

        /* ================ unsaved globals ================ */
        let outputNodeID = null;    //the last node connected to, output slot will be moved there
        let targetNode = node;      //the node connected to the output slot
        let targetSlotOffsetY = 0;  //offset for target slot other than #0
        let outputTargetPos = [0, 0];   //connected target slot pos, for moving our own slot
        this.configured = false;
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
        /*================================ Comfy extraMenu ================================ */
        // load toggleMenuOptions from derpMenus, and accept menu insertions from derp children
        this.node.loadToggleMenuOptions = function ( menuIndex, indexStart, newOptions ) {
            const { derpCanvas } = node.prop;
            let toggleOptions = toggleMenuOptions;
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
            derpCanvas.ToggleMenuOptions = toggleOptions;
        }
        // adding options with submenu
        this.node.getExtraMenuOptions = function () {
            const { derpCanvas } = this.prop;
            const options = derpCanvas.ToggleMenuOptions.flatMap(optionSet => {
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
            const { derpCanvas } = node.prop;
            const menuItemsMap = {};
            let iconTrue = '', iconFalse = '';
            derpCanvas.ToggleMenuOptions.forEach(optionSet => {
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
            const { derpCanvas } = node.prop;
            const parsedKey = derpKey.substring(2);
            for (const optionSet of derpCanvas.ToggleMenuOptions) {
                for (const [key, pathName] of Object.entries(optionSet)) {
                    // Skip ToggleMenuName entries
                    if (key === 'ToggleMenuName') continue;
                    // Handle boolean toggles
                    if (pathName[2] === 'bool' && pathName[1].trim() === parsedKey.trim()) {
                        const target = pathName[0].split('.').reduce((acc, prop) => acc[prop], node.prop);
                        derpContextMapper(pathName[0], !target, node);
                        return; // Exit early after handling toggle
                    }
                    // Handle array-based options
                    if (Array.isArray(pathName) && pathName.includes(derpKey)) {
                        derpContextMapper(pathName[0], pathName[1], node);
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
        };
        // ================== toggleMenu handler ==================

        // ================== extraMenu handler ==================
        this.node.loadExtraMenuOptions = function ( menuIndex, indexStart, newOptions) {
            const { derpCanvas } = this.prop;
            let extraMenuOptions;
            // check if it's first time loading, or is adding option items
            if (!Array.isArray(derpCanvas.ExtraMenuOptions) || derpCanvas.ExtraMenuOptions.length === 0) {
                extraMenuOptions = OptionMenu;
            } else extraMenuOptions = derpCanvas.ExtraMenuOptions;
            // adding new options to menus
            if (menuIndex !== undefined && indexStart !== undefined && newOptions !== undefined ) {
                // Create a new object to retain the format
                const mergedOptions = {};
                const sourceMenu = extraMenuOptions[menuIndex]
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
                extraMenuOptions[menuIndex] = mergedOptions;
            }
            derpCanvas.ExtraMenuOptions = extraMenuOptions;
        }
    }
}
