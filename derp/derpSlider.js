// DerpNode: derpSlider by lordwedggie
import { app } from "../../scripts/app.js";
import { derpBase_beta1 } from "./derpBase_beta1.js";
import {derpOnAdded, getRGBA, resetEffects} from "./Herbina/shitUtils.js";
import { derpPanelOpen } from "./Herbina/optionPanel.js";
import { drawDerpDefault1, drawDerpSliderV1 } from "./Herbina/drawStuff.js";
import { optionPanelMouse } from "./Herbina/mouseStuff.js"
import { withinBounds } from "./Herbina/coolUtils.js";
//==========================LGraph registration/==========================
class DERP_SLIDER extends derpBase_beta1{
    constructor(node) {
        super(node);

        this.node.prop = this.node.properties || {};
        this.node.prop.derpSlider = {
            Configured: false,
            DerpValue: 0.5,
            SliderBG_Pos: [],
            Label: 'DerpSlider',
            Decimals: 2,
            Min: 0,
            Max: 1,
            Step: 0.01,
            StepX: 10,
            Default: 0.5,
            Corner: 2,
            Margins: [2, 2, 2, 2],
            Spacing: 2,
            DrawLRbtn: true,
            Lbtn_Pos: [],
            Rbtn_Pos: [],
            LRbtnWidth: 1,
            DrawDefaultBtn: true,
            DrawDefaultBtn_Pos: [],
            FillBar_Pos: [],
            FillBarFullWidth: 0,
            FillRate: {X: 0.5},
            BtnIcons: [0.5,'◄','►','☼'], // first float is the size: percentage of the btn
            c_BtnColors: ["200, 200, 200, 0.3", "200, 200, 200, 0.3", "200, 200, 200, 0.3"],
            CurrentOptionKeys: [],
            SliderToggleOptions:
                {
                    'Draw LR buttons': ['derpSlider.DrawLRbtn', 'Enable LR buttons', 'bool'],
                    'Draw Default button': ['derpSlider.DrawDefaultBtn', 'Enable Default button', 'bool']
                },
            SliderOptions:
                {
                    'Slider label': ['derpSlider.Label','ColorOptionIndex: 0'],
                    'Decimals': ['derpSlider.Decimals', 0, 4, 1, 1, 'ColorOptionIndex: 4'],
                    'Minimum value': ['derpSlider.Min', -4294967296, 4294967296, 1, 10,'ColorOptionIndex: 0'],
                    'Maximum value': ['derpSlider.Max', -4294967296, 4294967296, 1, 10],
                    'Step': ['derpSlider.Step', -4294967296, 4294967296, 1, 10],
                    'Step multiplier (shiftClick)': ['derpSlider.StepX', -4294967296, 4294967296, 1, 10],
                    'Default value': ['derpSlider.Default', -4294967296, 4294967296, 1, 10],
                    'Slider corner': ['derpSlider.Corner', 0, 10, 1, 0.5, 'ColorOptionIndex: 2'],
                    'LR-button width': ['derpSlider.LRbtnWidth', 0.1, 6, 0.1, 2, 'derpSlider.DrawLRbtn'],
                    'Element spacing': ['derpSlider.Spacing', 0, 10, 1, 0.1 ],
                    'Margin left': ['derpSlider.Margins[0]', 0, 10, 1, 0.5, 'ColorOptionIndex: 3'],
                    'Margin right': ['derpSlider.Margins[1]', 0, 10, 1, 0.5],
                    'Margin top': ['derpSlider.Margins[2]', 0, 10, 1, 0.5],
                    'Margin bottom': ['derpSlider.Margins[3]', 0, 10, 1, 0.5],
                    'Close panel': ['Close'],
                },
            SliderPalette:
                {
                    'Slider BG': ['derpSliderPalette.c_SliderBG','ColorOptionIndex: 1'],
                    'LR button color': ['derpSliderPalette.c_LRbtnColor'],
                    'FillBar color': ['derpSliderPalette.c_FillBarColor'],
                }
        };
        this.node.prop.derpSliderPalette = {
            c_SliderBG: "0, 0, 0, 0.1",
            c_LRbtnColor: "200, 200, 200, 0.3",
            c_FillBarColor: "200, 200, 200, 0.4",
        };
        this.node.onConfigure = function () {
            this.outputs[0].type = (node.prop.derpSlider.Decimals > 0)?"FLOAT":"INT";
            this.configured = true;
        };
        for (let i=0; i<3; i++) this.node.widgets[i].type = "hidden";
        // ==================== OnAdded ====================
        this.node.onAdded = function () {
            const { derpCanvas, derpSlider } = this.prop;
            derpOnAdded(node);
            if (!derpSlider.Configured ){
                this.size = [200, 10 ];
                // Adding new menu options
                node.loadToggleMenuOptions(0, 2, derpSlider.SliderToggleOptions);
                node.loadExtraMenuOptions(0, 2, derpSlider.SliderOptions);
                node.loadExtraMenuOptions(1, 2, derpSlider.SliderPalette);
                derpSlider.Configured = true;
            }
            derpSlider.sliderBG_Pos = derpCanvas.Content_Pos;
            this.title = "DerpSlider Alpha2";

        }
        /* ================ onDrawForeground ================ */
        this.node.onDrawForeground = function (ctx) {
            this.configured = true;
            //if ( this.flags.collapsed ) return false;
            this.flags.collapsed = false;
            const {derpCanvas, derpEffects, derpSlider } = this.prop;
            const titleOffsetHeight = LiteGraph.NODE_TITLE_HEIGHT;
            const [, , canvasW] = derpCanvas.Size;
            const applyGlobalFX = (ctx) => {
                ctx.shadowColor = getRGBA("0,0,0,0.5");
                ctx.shadowBlur = 8;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
            };
            derpCanvas.DerpOutputPos = [canvasW - derpCanvas.SlotOffset[0], derpCanvas.SlotOffset[1] - titleOffsetHeight];
            if (derpCanvas.OutputIsConnected) {
                node.updateDerpSlot();
            } else {
                derpCanvas.PadRight = 12;
                this.outputs[0].pos = derpCanvas.DerpOutputPos;
            }
            // maintain title, so a long title won't show up from underneath. can be removed once I figure out how to set title
            // font color or turn it off.
            if (this.title !== this.prop.derpSlider.stashedTitle) {
                // note to self: move this to base function
                //this.prop.derpSlider.Label = this.title;
                this.prop.derpCanvas.stashedTitle = "xcp";
                this.title = "xcp";
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
            if (derpEffects.GlobalFX) {
                applyGlobalFX(ctx);
            } else {
                resetEffects(ctx);
            }
            /* -------------------- Draw base using Default1 -------------------- */
            drawDerpDefault1(ctx, node, derpSlider.Decimals); // call external to draw the basic crap
            /* -------------------- Draw derpSlider v1-------------------- */
            drawDerpSliderV1(ctx, node);
            /* -------------------- Draw derpSlider v2-------------------- */

        };
        /* ================================ Mouse Stuff ================================ */
        this.node.onMouseDown = function (derp, pos, canvas) {
            const { derpCanvas, derpSlider } = this.prop;
            //const derpPanel = derpCanvas.DerpPanel;
            const derpX = derp.canvasX - this.pos[0];
            const derpY = derp.canvasY - this.pos[1];
            /* -------------------- derp Options panels -------------------- */
            const optionIndex = derpCanvas.IsOptionsPanelOpen - 1;
            const oldDecimal = derpSlider.Decimals;
            optionPanelMouse (node, derp, canvas, derpCanvas.ExtraMenuOptions[optionIndex], derpX, derpY);
            if (oldDecimal !== derpSlider.Decimals) this.outputs[0].type = (node.prop.derpSlider.Decimals > 0)?"FLOAT":"INT";
            /* -------------------- Slider FillBar -------------------- */
            const [ fillBarX, fillBarY, , fillBarH ] = derpSlider.FillBar_Pos;
            if (withinBounds ( fillBarX, fillBarY, derpSlider.FillBarFullWidth, fillBarH, derpX, derpY )) {
                node.capture = true;
                node.unlock = false;
                node.captureInput(true);
                this.onMouseMove (derp);
                return true;
            }
            /* -------------------- Slider LRbtn -------------------- */
            if ( derpSlider.LRbtnWidth ) {
                const [ LbtnX, LbtnY, LbtnW, LbtnH ] = derpSlider.Lbtn_Pos;
                if (withinBounds ( LbtnX, LbtnY, LbtnW, LbtnH, derpX, derpY )){
                    const stepValue = -derpSlider.Step;
                    handleDerpValue( stepValue);
                    return true;
                }
                const [ RbtnX, RbtnY, RbtnW, RbtnH ] = derpSlider.Rbtn_Pos;
                if (withinBounds ( RbtnX, RbtnY, RbtnW, RbtnH, derpX, derpY )){
                    const stepValue = +derpSlider.Step;
                    handleDerpValue( stepValue);
                    return true;
                }
                function handleDerpValue (stepValue){
                    let tempValue = derp.shiftKey ? derpSlider.DerpValue + ( stepValue * derpSlider.StepX) : derpSlider.DerpValue + stepValue;
                    derpSlider.DerpValue = Math.max( derpSlider.Min, Math.min (derpSlider.Max, tempValue));
                    derpSlider.FillRate.X = Math.max (0, Math.min (1, (derpSlider.DerpValue - derpSlider.Min) / (derpSlider.Max - derpSlider.Min)));
                    node.graph.setisChangedFlag();
                }
            }
            /* -------------------- Default LRbtn -------------------- */
            if (derpSlider.DrawDefaultBtn){
                const [ defaultBtnX, defaultBtnY, defaultBtnW, defaultBtnH ] = derpSlider.DrawDefaultBtn_Pos;
                if (withinBounds( defaultBtnX, defaultBtnY, defaultBtnW, defaultBtnH, derpX, derpY )){
                    derpSlider.DerpValue = derpSlider.Default;
                    derpSlider.FillRate.X = Math.max (0, Math.min (1, (derpSlider.DerpValue - derpSlider.Min) / (derpSlider.Max - derpSlider.Min)));
                    node.graph.setisChangedFlag(this.id);
                }
            }
        };
        this.node.onMouseMove = function (derp){
            // /this.node.computeSize = () => [LiteGraph.NODE_WIDTH,Math.floor(LiteGraph.NODE_SLOT_HEIGHT*1.5)];
            const { derpSlider } = node.prop;
            if ( !node.capture) return false;
            let prevX = derpSlider.DerpValue;
            let rn = Math.pow(10, derpSlider.Decimals);
            let vX = (derp.canvasX - this.pos[0] - derpSlider.FillBar_Pos[0]) / derpSlider.FillBarFullWidth ;
            derpSlider.FillRate.X = Math.max (0, Math.min (1, vX));
            derpSlider.DerpValue = Math.round (rn * (derpSlider.Min + (derpSlider.Max - derpSlider.Min) * ((derpSlider.Unlock) ? vX : derpSlider.FillRate.X))) / rn;
            if (derpSlider.DerpValue !== prevX) node.graph.setisChangedFlag(this.id);

        }
        this.node.onMouseUp = function () {
            const { derpSlider } = node.prop;
            node.capture = false;
            node.captureInput(false);
            node.widgets[0].value = derpSlider.DerpValue;
        };
        this.node.computeSize = () => node.prop.derpCanvas.ComputeSizeMin; //minimum allow canvas size, note going below title height, but doing so will disable comfyui resize function
    }
}
app.registerExtension({
    name: "DERP_SLIDER",
    async beforeRegisterNodeDef(nodeType, nodeData, _app) {
        if (nodeData.name === "DERP_SLIDER") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                if (onNodeCreated) onNodeCreated.apply(this, []);
                this.DERP_SLIDER = new DERP_SLIDER(this);
            };
        }
    }
});
