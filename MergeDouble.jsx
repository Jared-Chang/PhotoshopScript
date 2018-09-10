/***********************************
    Auth: QiFen (QiFen.Pocket@gmail.com)
    LICENSE: MIT
************************************/

createProgressWindow();
try {
    mergeDouble(updateProgress);
}
catch(e)
{
    alert(e.message);
}
close();

function mergeDouble(updateProgress)
{
    var selectedLayerIdx = getSelectedLayersIdx(); 

    var doActionTimes = selectedLayerIdx.length - 1; 
    
    selectLayerByIndex(selectedLayerIdx[selectedLayerIdx.length - 1]); 
    
    for (var p = 0; p < doActionTimes; p++) { 
        if (skipNextWhenNotNormalLayer()) { continue; }
        mergeDoubleProcess(selectedLayerIdx[doActionTimes - p - 1]); 

        var percentage = p / doActionTimes * 100;
        updateProgress(percentage, percentage + "%");
    } 
    
    deleteLayer(selectedLayerIdx[0]);
}

function skipNextWhenNotNormalLayer()
{
    selectDown();

    if (!activeLayerIsNormalLayer())
    {
        selectUp();
        moveDown();
        return true;
    }

    selectUp();
    return false;
}

function deleteLayer(index) {
    var ref = new ActionReference();
    ref.putIndex(charIDToTypeID("Lyr "), index);
    var desc = new ActionDescriptor();
    desc.putReference(charIDToTypeID("null"), ref);
    try {
        executeAction(charIDToTypeID("Dlt "), desc, DialogModes.NO);
    }
    catch (e) {
        alert(e.message);
    }
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

function activeLayerIsNormalLayer()
{
    var activeLayer = activeDocument.activeLayer;
    return activeLayer.kind === LayerKind.NORMAL && !activeLayer.grouped;
}

function mergeDoubleProcess(layerIndex) {
    selectDown();
    startSelectionProcess();
    selectOpaquePixel(layerIndex);
    selectUp();
    layerViaCopy();
    moveDown();
    mergeDown();
    selectUp();
    moveDown();
}

function selectDown() {
    var selectDesc = new ActionDescriptor();
    var selectRef = new ActionReference();
    selectRef.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Bckw"));
    selectDesc.putReference(charIDToTypeID("null"), selectRef);
    executeAction(charIDToTypeID("slct"), selectDesc, DialogModes.NO);
}

function selectOpaquePixel(layerIndex) {
    var addDesc = new ActionDescriptor();

    var layerTrasparent = new ActionReference();
    layerTrasparent.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Trsp"));
    layerTrasparent.putIndex(charIDToTypeID("Lyr "), layerIndex);
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

function selectUp() {
    var selectDesc = new ActionDescriptor();
    var selectRef = new ActionReference();
    selectRef.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Frwr"));
    selectDesc.putReference(charIDToTypeID("null"), selectRef);
    executeAction(charIDToTypeID("slct"), selectDesc, DialogModes.NO);
}

function layerViaCopy() {
    executeAction(charIDToTypeID("CpTL"), undefined, DialogModes.NO);
}

function moveDown() {
    var moveDesc = new ActionDescriptor();
    var moveRef = new ActionReference();
    moveRef.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    moveDesc.putReference(charIDToTypeID("null"), moveRef);
    var prevRef = new ActionReference();
    prevRef.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Prvs"));
    moveDesc.putReference(charIDToTypeID("T   "), prevRef);
    executeAction(charIDToTypeID("move"), moveDesc, DialogModes.NO);
}

function mergeDown() {
    executeAction(charIDToTypeID("Mrg2"), undefined, DialogModes.NO);
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