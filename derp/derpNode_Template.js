// DerpNode: derpSlider by lordwedggie
import { app } from "../../scripts/app.js";
import { derpBase } from "./derpBase.js";
import { derpOnAdded } from "./Herbina/shitUtils.js";
import { updateSliderTextAlignment } from "./Herbina/optionPanel.js";
import { drawDerpDefault1, drawText } from "./Herbina/drawStuff.js";
import { optionPanelMouse } from "./Herbina/mouseStuff.js";
class DerpNodeTemplate extends derpBase {
    constructor(node) {
        super(node);
        //this.node = node;
        this.node.prop = this.node.properties || {};
        this.node.prop.derpNode = {
            Configured : false,
            Label: 'Template',
        }
        console.log ('this.node.widgets[0]',this.node.widgets[0]);
        this.node.widgets[0].type = "hidden";
        // ==================== OnConfigure ====================
        this.node.onConfigure = function () {
        };
        // ==================== OnAdded ====================
        this.node.onAdded = function () {
            const { derpCanvas, derpNode } = this.prop;
            derpOnAdded(node);
            this.title = "Template";
            derpCanvas.stashedTitle = 'xcp';
            // set up initial size
            if (!derpNode.Configured ){
                this.size = [ 200, 30 ];
                derpNode.Configured = true;
            }
            // Instantiating && Adding new menu options
            node.loadToggleMenuOptions();
            node.loadExtraMenuOptions();
        }
        /* ================ onDrawForeground ================ */
        this.node.onDrawForeground = function (ctx) {
            const { derpNode } = this.prop;
            this.flags.collapsed = false; // 'disable' node collapse.
            derpNode.Label = node.handleTitle(derpNode.Label);
            node.commonDraw(ctx);
            /* -------------------- Draw base using Default1 -------------------- */
            drawDerpDefault1(ctx, node); // call external to draw the basic crap

            const nodeLabel = derpNode.Label;
            const nodeValue = node.widgets[0].value;
            updateSliderTextAlignment(ctx, node, nodeLabel, nodeValue, 0, 0 );
            drawText(ctx, node, nodeLabel, nodeValue );
        };
        /* ================================ Mouse Stuff ================================ */
        this.node.onMouseDown = function (derp, pos, canvas) {
            optionPanelMouse (node, derp, canvas );
        };
        this.node.computeSize = () => node.prop.derpCanvas.ComputeSizeMin;
    }
}
app.registerExtension({
    name: "DerpNodeTemplate",
    async beforeRegisterNodeDef(nodeType, nodeData, _app) {
        if (nodeData.name === "DerpNodeTemplate") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                if (onNodeCreated) onNodeCreated.apply(this, []);
                this.DerpNodeTemplate = new DerpNodeTemplate(this);
            };
        }
    }
});