/***********************************
    Auth: QiFen (QiFen.Pocket@gmail.com)
    LICENSE: MIT
************************************/

var selectedLayerIndex = getSelectedLayersIdx(); 

startSelectionProcess(); 

for (var p = 0; p < selectedLayerIndex.length; p++) { 
    selectOpaquePixel(selectedLayerIndex[p]); 
    selectOpaquePixel(selectedLayerIndex[p]);
} 

copyMerge(); 
pastInPanel();

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

function selectOpaquePixel(index)
{
    var addDesc = new ActionDescriptor();

    var layerTrasparent = new ActionReference();
    layerTrasparent.putEnumerated( charIDToTypeID( "Chnl" ), charIDToTypeID( "Chnl" ), charIDToTypeID( "Trsp" ) );
    layerTrasparent.putIndex(charIDToTypeID("Lyr "), index);
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