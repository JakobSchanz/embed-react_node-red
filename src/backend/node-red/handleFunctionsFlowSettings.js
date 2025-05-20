export function handleSettingsClose(setAnchorEl, setCurrentFlow) {
    setAnchorEl(null);
    setCurrentFlow(null);
}

export async function handleRename({
    renameRef,
    currentFlow,
    setAnchorEl,
    setCurrentFlow,
    getExistingFlowData,
    addNewFlow,
    addFlowFields
}) {
    const newName = renameRef.current.value;

    if (!newName || !currentFlow || !currentFlow.id) return;

    const id = currentFlow.id;
    const data = await getExistingFlowData();

    const updatedData = data.map(flow =>
        flow.id === id ? { ...flow, label: newName } : flow
    );

    handleSettingsClose(setAnchorEl, setCurrentFlow);

    await addNewFlow(updatedData);
    await addFlowFields(true);
}

export async function handleDelete({
    currentFlow,
    setAnchorEl,
    setCurrentFlow,
    getExistingFlowData,
    addNewFlow,
    addFlowFields
}) {
    if (!currentFlow || !currentFlow.id) return;

    const id = currentFlow.id;
    const data = await getExistingFlowData();
    const updatedData = data.filter(flow => flow.id !== id);

    handleSettingsClose(setAnchorEl, setCurrentFlow);
    await addNewFlow(updatedData);
    await addFlowFields(true);
}
