// DerpNode: derpSlider by lordwedggie
import {app} from "../../scripts/app.js";
import {derpBase} from "./derpBase.js";
import {derpOnAdded, getRGBA} from "./Herbina/shitUtils.js";
import {updateSliderTextAlignment} from "./Herbina/optionPanel.js";
import {drawDerpDefault1, drawText, drawComboBox} from "./Herbina/drawStuff.js";
import {optionPanelMouse} from "./Herbina/mouseStuff.js";
import {withinBounds} from "./Herbina/coolUtils.js";

class DerpLoadSamplerName extends derpBase {
    constructor(node) {
        super(node);
        //this.node = node;
        this.node.prop = this.node.properties || {};
        this.node.prop.derpComboLoader = {
            Configured: false,
            Label: 'Load Sampler',
            ComboIsOpen: false,
            OutputCombo: true,
            ComboList: [],
            ComboList_Font: 'DengXian Light',
            ComboList_FontSize: 10,
            ComboList_MarginX: 6,
            ComboList_MarginY: 8,
            ComboPrompt_Pos: [0, 0, 0, 0],
            ComboBox_Pos: [0, 0, 0, 0],
            Margins: [2, 2, 2, 2],
            c_ComboBox_BG: '0, 0, 0, 0.3',
            ComboBox_Palette: [
                '20, 20, 20, 0.9', '0, 0, 0, 0.1',
            ], //0: ComboBoX BG, 1: PromptBox BG, remove this bullshit later, too hard to read...
            ComboListWidth: 0,
            PrevMouseclick: 0,
        };
        this.node.prop.derpComboPalette = {
            ComboFontColor: '255, 255, 255, 0.50',
        };
        this.node.prop.derpComboEffect = {
            ComboFont_mo: 2,
        };
        this.node.prop.derpComboList = [
            'comfy.samplers.KSampler.SAMPLERS',
        ];
        const nodeToggleOptions = {
            'Output Combo': ['derpComboLoader.OutputCombo', 'Output type Combo', 'bool'],
        };
        console.log('this.node.widgets', this.node.widgets);
        for (let i=0; i<this.node.widgets.length; i++) this.node.widgets[i].type = "hidden";


        // ==================== OnConfigure ====================
        this.node.onConfigure = function () {
        };
        // ==================== OnAdded ====================
        this.node.onAdded = function () {
            const {derpCanvas, derpComboLoader, derpComboList } = this.prop;
            derpOnAdded(node);
            this.title = "Derp Load Sampler";
            derpCanvas.TextAlignment = 'vertical-split-R';
            if (!derpComboLoader.Configured) {
                this.size = [200, 20];
                // Instantiating && Adding new menu options
                node.loadToggleMenuOptions(0, 1, nodeToggleOptions);
                node.loadExtraMenuOptions();
                derpComboLoader.Configured = true;
            }
            app.ctx.font = '10px DengXian';
            app.ctx.imageSmoothingQuality = 'high';
            app.canvas.node_title_color = getRGBA('255, 255, 255, 0.5');
            app.canvas.ctx.font = '8px DengXian Lights';
            node.getMaXStringWidth (app.canvas.ctx, this.widgets[0].options.values);
            console.log('app.canvas:', app.canvas);
            console.log (app);
            console.log (derpComboList[0]);
        };
        /* ================ onDrawForeground ================ */
        this.node.onDrawForeground = function (ctx) {
            const {derpCanvas, derpComboLoader} = this.prop;
            // stuff that should only run once
            if (!derpComboLoader.Configured) {
                derpComboLoader.Configured = true;
            }
            // the rest
            this.flags.collapsed = false; // 'disable' node collapse.
            derpComboLoader.Label = node.handleTitle(derpComboLoader.Label);
            derpComboLoader.ComboList = node.widgets[0].options.values;
            //console.log (derpComboLoader.ComboList);
            node.commonDraw(ctx);
            /* -------------------- Draw base using Default1 -------------------- */
            drawDerpDefault1(ctx, node); // call external to draw the basic crap
            const nodeLabel = derpComboLoader.Label;
            const nodeValue = node.widgets[0].value;
            if ( derpCanvas.PrevSize[0] !== this.size[0] || derpCanvas.PrevSize[1] !== this.size[1]) derpCanvas.SizeChanged = true;
            if (derpCanvas.SizeChanged || derpCanvas.AlignmentChanged) {
                updateSliderTextAlignment(ctx, node, nodeLabel, nodeValue, 0, 0);
                derpCanvas.AlignmentChanged = false;
                if (derpCanvas.SizeChanged) {
                    [derpCanvas.PrevSize[0], derpCanvas.PrevSize[1]] = this.size;
                    derpCanvas.SizeChanged = false;
                }
            }
            drawText(ctx, node, nodeLabel, nodeValue);
            const derpX = app.canvas.graph_mouse[0];
            const derpY = app.canvas.graph_mouse[1];
            drawComboBox(ctx, node, derpComboLoader.ComboList, derpX, derpY);
        };
        /* ================================ Mouse Stuff ================================ */
        this.node.onMouseDown = function (derp, pos, canvas) {
            const {derpCanvas} = node.prop;
            const derpX = derp.canvasX - this.pos[0];
            const derpY = derp.canvasY - this.pos[1];
            optionPanelMouse(node, derp, canvas);
            const inputBounds = derpCanvas.Size;
            if (withinBounds(inputBounds[0], inputBounds[1], inputBounds[2], inputBounds[3], derpX, derpY)) {

            }
        };
        this.node.getMaXStringWidth = function (ctx, derpString) {
            const { derpComboLoader } = node.prop;
            let maxLength = 0;
            let derpIndex = -1;
            for (let i = 0; i < derpString.length; i++) {
                if (derpString[i].length > maxLength){
                    maxLength = derpString[i].length;
                    derpIndex = i;
                }
            }
            ctx.font = `${derpComboLoader.ComboList_Font}px ${derpComboLoader.ComboList_FontSize}`;
            console.log ('textWidth:', ctx.measureText(derpString[derpIndex]).width);
            derpComboLoader.ComboListWidth = Math.round(ctx.measureText(derpString[derpIndex]).width) ;
        }
        // compute min size
        this.node.computeSize = () => node.prop.derpCanvas.ComputeSizeMin;
    }
}
app.registerExtension({
    name: "DerpLoadSamplerName",
    async beforeRegisterNodeDef(nodeType, nodeData, _app) {
        if (nodeData.name === "DerpLoadSamplerName") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                if (onNodeCreated) onNodeCreated.apply(this, []);
                this.DerpLoadSamplerName = new DerpLoadSamplerName(this);
            };
        }
    }
});