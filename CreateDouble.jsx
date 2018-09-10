/***********************************
    Auth: QiFen (QiFen.Pocket@gmail.com)
    LICENSE: MIT
************************************/

createProgressWindow();
createDouble(updateProgress);
close();

function createDouble(updateProgress) {
    var selectedLayerIndex = getSelectedLayersIdx();

    startSelectionProcess();

    for (var p = 0; p < selectedLayerIndex.length; p++) {
        selectLayerByIndex(selectedLayerIndex[p]);
        if (!activeLayerIsNormalLayer()) { continue; }

        selectOpaquePixel(selectedLayerIndex[p]);
        selectOpaquePixel(selectedLayerIndex[p]);

        var percentage = p / selectedLayerIndex.length * 100;
        updateProgress(percentage, percentage + "%");
    }
    copyMerge();
    pastInPanel();
}

function activeLayerIsNormalLayer() {
    var activeLayer = activeDocument.activeLayer;

    return activeLayer.kind === LayerKind.NORMAL && !activeLayer.grouped;
}

function selectLayerByIndex(index, add) {
    add = undefined ? add = false : add

    var ref = new ActionReference();
    ref.putIndex(charIDToTypeID("Lyr "), index);
    var desc = new ActionDescriptor();
    desc.putReference(charIDToTypeID("null"), ref);
    if (add) desc.putEnumerated(stringIDToTypeID("selectionModifier"), stringIDToTypeID("selectionModifierType"), stringIDToTypeID("addToSelection"));
    desc.putBoolean(charIDToTypeID("MkVs"), false);
    try {
        executeAction(charIDToTypeID("slct"), desc, DialogModes.NO);
    }
    catch (e) {
        alert(e.message);
    }
};

function getSelectedLayersIdx() {
    var selectedLayers = [];

    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));

    var desc = executeActionGet(ref);

    if (desc.hasKey(stringIDToTypeID('targetLayers'))) {
        desc = desc.getList(stringIDToTypeID('targetLayers'));

        for (var i = 0; i < desc.count; i++) {
            var index = desc.getReference(i).getIndex();
            try {
                activeDocument.backgroundLayer;
                selectedLayers.push(index);
            }
            catch (e) {
                selectedLayers.push(index + 1);
            }
        }
    }
    return selectedLayers;
};

function copyMerge() {
    executeAction(charIDToTypeID("CpyM"), undefined, DialogModes.NO);
}

function pastInPanel() {
    var pastDescriptor = new ActionDescriptor();
    pastDescriptor.putBoolean(stringIDToTypeID("inPlace"), true);
    pastDescriptor.putEnumerated(charIDToTypeID("AntA"), charIDToTypeID("Annt"), charIDToTypeID("Anno"));
    pastDescriptor.putClass(charIDToTypeID("As  "), charIDToTypeID("Pxel"));
    executeAction(charIDToTypeID("past"), pastDescriptor, DialogModes.NO);
}

function selectOpaquePixel(index) {
    var addDesc = new ActionDescriptor();

    var layerTrasparent = new ActionReference();
    layerTrasparent.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Trsp"));
    layerTrasparent.putIndex(charIDToTypeID("Lyr "), index);
    addDesc.putReference(charIDToTypeID("null"), layerTrasparent);

    var select = new ActionReference();
    select.putProperty(charIDToTypeID("Chnl"), charIDToTypeID("fsel"));
    addDesc.putReference(charIDToTypeID("T   "), select);

    executeAction(charIDToTypeID("Add "), addDesc, DialogModes.NO);
}

function startSelectionProcess() {
    var setdDesc = new ActionDescriptor();
    var fselRef = new ActionReference();
    fselRef.putProperty(charIDToTypeID("Chnl"), charIDToTypeID("fsel"));
    setdDesc.putReference(charIDToTypeID("null"), fselRef);
    var trspRef = new ActionReference();
    trspRef.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Trsp"));
    setdDesc.putReference(charIDToTypeID("T   "), trspRef);
    executeAction(charIDToTypeID("setd"), setdDesc, DialogModes.NO);
}

 function createProgressWindow(title, message, hasCancelButton) {
    var win;
    if (title == null) { title = "Work in progress";    }
    if (message == null) { message = "Please wait..."; }
    if (hasCancelButton == null) { hasCancelButton = false; }
    win = new Window("palette", "" + title, undefined);
    win.bar = win.add("progressbar", { x: 20, y: 12, width: 300, height: 20 }, 0, 100);
    win.stMessage = win.add("statictext", { x: 10, y: 36, width: 320, height: 20 }, "" + message);
    win.stMessage.justify = 'center';
    if (hasCancelButton) {
        win.cancelButton = win.add('button', undefined, 'Cancel');
        win.cancelButton.onClick = function () { win.close(); throw new Error('User canceled the pre-processing!'); };
    }
    this.reset = function (message) {
        win.bar.value = 0;
        win.stMessage.text = message;
        return win.update();
    };
    this.updateProgress = function (perc, message) {
        if (perc != null) { win.bar.value = perc; }
        if (message != null) { win.stMessage.text = message; }
        return win.update();
    };
    this.close = function () { return win.close(); };
    win.center(win.parent);
    return win.show();
};