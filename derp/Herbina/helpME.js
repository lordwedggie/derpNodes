if (derpCanvas.PrevSize[0] !== this.size[0] || derpCanvas.PrevSize[1] !== this.size[1] ) {
    derpCanvas.SizeChanged = true;
}
if (derpCanvas.AlignmentChanged || derpCanvas.SizeChanged ) {
    updateSliderTextAlignment(ctx, node, nodeLabel, nodeValue, 0, 0);
    derpCanvas.AlignmentChanged = false;
    if (derpCanvas.SizeChanged) {
        derpCanvas.PrevSize[0] = this.size[0];
        derpCanvas.PrevSize[1] = this.size[1];
        derpCanvas.SizeChanged = false;
    }
}