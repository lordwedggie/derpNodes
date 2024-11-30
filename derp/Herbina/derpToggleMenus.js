// derpToggleMenus by lordwedggie,
// menu items for all the extraMenu taco...toggles

const toggleMenuOptions = [
    {
        'ToggleMenuName': ['🔞 Node Corner Shape'],
        'TOP-LEFT': ['CornerMap', 'TOP-LEFT', 'derpCanvas.CanvasCorner, 0, 0, 0'],
        'TOP': ['CornerMap', 'TOP', 'derpCanvas.CanvasCorner, derpCanvas.CanvasCorner, 0,0'],
        'TOP-RIGHT': ['CornerMap', 'TOP-RIGHT', '0, 0, derpCanvas.CanvasCorner, 0'],
        'LEFT': ['CornerMap', 'LEFT', '0, 0, derpCanvas.CanvasCorner, 0'],
        'CENTER': ['CornerMap', 'CENTER', '0, 0, 0, 0'],
        'RIGHT': ['CornerMap', 'RIGHT', '0, derpCanvas.CanvasCorner, 0, derpCanvas.CanvasCorner'],
        'BOTTOM-LEFT': ['CornerMap', 'BOTTOM-LEFT', '0, 0, derpCanvas.CanvasCorner, 0'],
        'BOTTOM': ['CornerMap', 'BOTTOM', '0, 0, derpCanvas.CanvasCorner, derpCanvas.CanvasCorner'],
        'BOTTOM-RIGHT': ['CornerMap', 'BOTTOM-RIGHT', '0, 0, 0, derpCanvas.CanvasCorner'],
        'FULL': ['CornerMap', 'derpCanvas.CanvasCorner, derpCanvas.CanvasCorner, derpCanvas.CanvasCorner, derpCanvas.CanvasCorner'],
    },
    {
        'ToggleMenuName': ['🔞 Toggle effects'],
    },
    {
        'ToggleMenuName': ['🔞 Text alignment'],
    },
];

export function getToggleMenuIndex() {
    // Find the key 'ToggleMenuName' in the selected option and add its first entry to the array
    const menuNamesArray = [];
    toggleMenuOptions.forEach(option => {
        // Check if the current entry has the 'ToggleMenuName' key
        if ('ToggleMenuName' in option) {
            // Add all strings from the 'ToggleMenuName' array to menuNamesArray
            option['ToggleMenuName'].forEach(name => { // Correct way to access the property
                menuNamesArray.push(name);
            });
        }
    });
    console.log(menuNamesArray);
    return menuNamesArray;
}