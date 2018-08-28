/***********************************
    Auth: QiFen (QiFen.Pocket@gmail.com)
    LICENSE: MIT
************************************/

var task = "var selectedLayerNames = getSelectedLayerName(); startSelectionProcess(); for (var p = 0; p < selectedLayerNames.length; p++) { selectOpaquePixel(selectedLayerNames[p]); selectOpaquePixel(selectedLayerNames[p]); updateProgress(selectedLayerNames.length, p) } copyMerge(); pastInPanel();";

doForcedProgress("Double creating", task);

function getSelectedLayerName() {
    var theLayers = getSelectedLayersIdx();
    var layerNames = [];
    for (var i = 0; i < theLayers.length; ++i) {
        selectLayerByIndex(theLayers[i]);
        layerNames.push(activeDocument.activeLayer.name);
    }

    return layerNames;
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

function selectOpaquePixel(name)
{
    var addDesc = new ActionDescriptor();

    var layerTrasparent = new ActionReference();
    layerTrasparent.putEnumerated( charIDToTypeID( "Chnl" ), charIDToTypeID( "Chnl" ), charIDToTypeID( "Trsp" ) );
    layerTrasparent.putName(charIDToTypeID("Lyr "), name);
    addDesc.putReference( charIDToTypeID( "null" ), layerTrasparent );

    var select = new ActionReference();
    select.putProperty( charIDToTypeID( "Chnl" ), charIDToTypeID( "fsel" ) );
    addDesc.putReference( charIDToTypeID( "T   " ), select );

    executeAction( charIDToTypeID( "Add " ), addDesc, DialogModes.NO );
}

function startSelectionProcess()
{
    var setdDesc = new ActionDescriptor();
    var fselRef = new ActionReference();
    fselRef.putProperty( charIDToTypeID( "Chnl" ), charIDToTypeID( "fsel" ) );
    setdDesc.putReference( charIDToTypeID( "null" ), fselRef );
    var trspRef = new ActionReference();
    trspRef.putEnumerated( charIDToTypeID( "Chnl" ), charIDToTypeID( "Chnl" ), charIDToTypeID( "Trsp" ) );
    setdDesc.putReference( charIDToTypeID( "T   " ), trspRef );
    executeAction( charIDToTypeID( "setd" ), setdDesc, DialogModes.NO );
}