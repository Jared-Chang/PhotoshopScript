/***********************************
    Auth: QiFen (QiFen.Pocket@gmail.com)
    LICENSE: MIT
************************************/

var lastMeshPath = "C:\\Users\\[Your User Name]\\AppData\\Roaming\\Adobe\\Adobe Photoshop CC 2018\\Adobe Photoshop CC 2018 Settings\\Liquify Last Mesh.psp";

var theLayers = getSelectedLayersIdx();

multiLayersLiquifyWithSelectedArea();

var task = "for (var p = 0; p < theLayers.length; p++) { selectLayerByIndex(theLayers[p], false); doLastLiquify(); updateProgress(theLayers.length, p); } deleteLayer(theLayers[theLayers.length-1] + 1); "

doForcedProgress("Applying liquify to all selected layer", task);

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

function doLastLiquify() {
    try {
        var liquifyMDDescriptor = new ActionDescriptor();
        liquifyMDDescriptor.putString( charIDToTypeID("LqMD"), lastMeshPath);
        executeAction(charIDToTypeID("LqFy"), liquifyMDDescriptor, DialogModes.NO);
    }
    catch (e) { }
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

function multiLayersLiquifyWithSelectedArea() {
    copyMerge();
    pastInPanel();
    reselect();
    openLiquifyDialog();
}

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

function reselect() {
    var reselectDescriptor = new ActionDescriptor();
    var reselectReference = new ActionReference();
    reselectReference.putProperty(charIDToTypeID("Chnl"), charIDToTypeID("fsel"));
    reselectDescriptor.putReference(charIDToTypeID("null"), reselectReference);
    reselectDescriptor.putEnumerated(charIDToTypeID("T   "), charIDToTypeID("Ordn"), charIDToTypeID("Prvs"));
    executeAction(charIDToTypeID("setd"), reselectDescriptor, DialogModes.NO);
}

function openLiquifyDialog() {
    var liquifyDescriptor = new ActionDescriptor();
    liquifyDescriptor.putString(charIDToTypeID("LqMD"), "");
    liquifyDescriptor.putData(charIDToTypeID("LqMe"), String.fromCharCode(0));
    executeAction(charIDToTypeID("LqFy"), liquifyDescriptor, DialogModes.ALL);
}