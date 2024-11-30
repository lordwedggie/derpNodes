//mouseStuff by lordwedggie, stuff about mouse
import { getRGBA, simpleRGBA } from "./shitUtils.js";
import { parsePropName, derpKeyMapper, withinBounds } from "./coolUtils.js";
export function optionPanelMouse (node, derp, canvas ){
    const { derpCanvas, derpPalette } = node.prop;
    const derpPanel = derpCanvas.DerpPanel;
    const optionIndex = derpCanvas.IsOptionsPanelOpen - 1;
    const optionMenu = derpCanvas.ExtraMenuOptions[optionIndex];
    const derpX = derp.canvasX - node.pos[0];
    const derpY = derp.canvasY - node.pos[1];
    const optionKeysArray = Object.values (node.prop.derpCanvas.CurrentOptionKeys);
    let currentY = 0;
    const btnH = derpCanvas.DerpPanel.font2 * 2;
    const spacingY = 8;
    const optionSetup = (option) => {
        // Find the object in OptionMenu that contains the current option
        const targetObject = optionMenu;
        const optionArray = targetObject[option];
        propertyValue = parsePropName(node, option, targetObject);
        optionMin = optionArray[1];
        optionMax = optionArray[2];
        optionStep = optionArray[3];
        optionStepX = optionArray[4];
    };
    const handleOptionChange = (option, propertyValue) => {
        console.log ('option is this: ',option);
        derpKeyMapper(option, propertyValue, node, optionMenu);
        derpCanvas.AlignmentChanged = true; //add checks later, or...going to rewrite the whole mouse thing anyway.
    };
    let skipping = false; let propertyValue; let optionMin; let optionMax; let optionStep; let optionStepX;
    optionKeysArray.slice(2).forEach(option => {
        const inputBounds = withinBounds(
            derpPanel.X + derpPanel.padLeft + btnH + 11,
            derpPanel.panelStartY + currentY,
            derpPanel.fieldW - 10,
            derpPanel.font2 * 2 - 2, derpX, derpY
        );
        // -------------------- input fields --------------------
        if ( inputBounds ) {    // if it's the close button, close panel and reset index
            optionSetup(option);
            if (option === "Close panel") {
                derpCanvas.IsOptionsPanelOpen = 0;
                node.size[0] = derpCanvas.Size[2];
                node.size[1] = derpCanvas.Size[3] - LiteGraph.NODE_TITLE_HEIGHT;
                return false;
            }
            const promptElement = canvas.prompt(option, propertyValue, function (v) {
                if (optionMin !== undefined && optionMax !== undefined) {
                    v = Math.max(optionMin, Math.min(optionMax, v));
                } else { v = String(v); }
                propertyValue = v;
                handleOptionChange(option, propertyValue);
            }.bind(this), derp);

            const inputElement = promptElement.querySelector('input');
            if (inputElement) {
                // Style the input
                inputElement.style.backgroundColor = getRGBA(derpPalette.c_CanvasBG);
                inputElement.style.color = getRGBA(derpPalette.c_OutputTextColor);
                inputElement.style.border = `1px solid ${getRGBA(derpPalette.c_HeaderBG)}`;
                inputElement.style.borderRadius = `${derpCanvas.ContentCorner}px`;
                inputElement.style.padding = '4px 8px';
                inputElement.style.fontSize = '10px';
                inputElement.style.width = '120px';       // Wider input
                inputElement.style.height = '16px';       // Taller input
                inputElement.style.fontFamily = derpCanvas.OutputFont;

                // Optional: style the container
                const container = inputElement.parentElement;
                if (container) {
                    //container.style.backgroundColor = 'transparent';
                    container.style.border = 'none';
                }
            }
        }
        // -------------------- LRbtns --------------------
        const lbtnBounds = withinBounds(
            derpPanel.X + derpPanel.padLeft,
            derpPanel.panelStartY + currentY, btnH, btnH, derpX, derpY
        );
        const rbtnBounds = withinBounds(
            derpPanel.X + derpPanel.padLeft + btnH + 2 + derpPanel.fieldW,
            derpPanel.panelStartY + currentY, btnH, btnH, derpX, derpY
        );
        if ((derpCanvas.IsOptionsPanelOpen !== 2 && derpCanvas.IsOptionsPanelOpen !== 4)  && (lbtnBounds || rbtnBounds)) {
            // need to change the index number to keys
            optionSetup(option);
            if (optionMin === undefined || optionMax === undefined || optionStep === undefined) {
                // skipping text field inputs that are neither colors nor have LR btn
                skipping = true;
            }
            if (!skipping) {
                if (lbtnBounds) {
                    propertyValue = derp.shiftKey ? Math.max(optionMin, propertyValue - optionStep * optionStepX) : propertyValue - optionStep;
                } else {
                    propertyValue = derp.shiftKey ? Math.max(optionMin, propertyValue + optionStep * optionStepX) : propertyValue + optionStep;
                }
                propertyValue = Math.max(optionMin, Math.min(optionMax, propertyValue));
                const floatCheck = propertyValue.toString();
                if (floatCheck.includes('.')) {
                    propertyValue = propertyValue.toFixed(2);
                    propertyValue = parseFloat(propertyValue);
                }
                handleOptionChange(option, propertyValue);
            }
        }
        // -------------------- Palette LRbtn --------------------
        if ((derpCanvas.IsOptionsPanelOpen === 2 || derpCanvas.IsOptionsPanelOpen === 4) && (lbtnBounds || rbtnBounds)) {
            // need to change the index number to keys, so the order of the menus can be changed?
            optionSetup(option);
            let newRGBA = getRGBA(propertyValue);
            if (lbtnBounds) {
                newRGBA = derp.shiftKey ? simpleRGBA(newRGBA, -10) : simpleRGBA(newRGBA, -1);
            } else {
                newRGBA = derp.shiftKey ? simpleRGBA(newRGBA, 10) : simpleRGBA(newRGBA, 1);
            }
            handleOptionChange(option, newRGBA);
        }
        currentY += derpPanel.font1 + spacingY;
        skipping = false;
    })
}