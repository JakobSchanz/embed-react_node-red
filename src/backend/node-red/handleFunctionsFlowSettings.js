export function handleSettingsClose(setAnchorEl, setCurrentFlow) {
    try {
        setAnchorEl(null);
        setCurrentFlow(null);
    } catch (error) {
        console.error("Error in Function handleSettingsClose: ", error.message);
    }
}

export async function handleRename({
    renameRef,
    currentFlow,
    setAnchorEl,
    setCurrentFlow,
    getExistingFlowData,
    addNewFlow,
    addFlowFields,
    existingFields, 
    setFlows
}) {
    try {
        const newName = renameRef.current.value;

        if (!newName || !currentFlow || !currentFlow.id) return;

        const id = currentFlow.id;
        const data = await getExistingFlowData();

        const updatedData = data.map(flow =>
            flow.id === id ? { ...flow, label: newName } : flow
        );

        handleSettingsClose(setAnchorEl, setCurrentFlow);

        await addNewFlow(updatedData);
        const forceRefresh = true;
        await addFlowFields({forceRefresh, existingFields, setFlows, setAnchorEl, setCurrentFlow});
    } catch (error) {
        console.error("Error in Function handleRename", error.message);
    }
}

export async function handleDelete({
    currentFlow,
    setAnchorEl,
    setCurrentFlow,
    getExistingFlowData,
    addNewFlow,
    addFlowFields,
    existingFields,
    setFlows
}) {
    try {
        if (!currentFlow || !currentFlow.id) return;

        const id = currentFlow.id;
        const data = await getExistingFlowData();
        const updatedData = data.filter(flow => flow.id !== id);

        handleSettingsClose(setAnchorEl, setCurrentFlow);
        await addNewFlow(updatedData);
        const forceRefresh = true;
        await addFlowFields({forceRefresh, existingFields, setFlows, setAnchorEl, setCurrentFlow});
    } catch (error) {
        console.error("Error in Function handleDelete: ", error.message);
    }
}
