import React from "react";

import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { Settings as SettingsIcon } from "@material-ui/icons";
import { Button } from "@material-ui/core";

const config = {
    domain: "http://localhost:8000/",
    postMethod: "POST",
    flowType: "tab",
    endPoints: {
        restart: "restart-node-red",
        createCustomNodes: "db-api/crate-custom-node",
        createNewTable: "db-api/crate-new-table",
        getAllFlows: "flows",
        getAllTables: "db-api/table-list",
    },
    flowFieldDesign: {
        sizeAuto: "auto",
        variantContained: "contained",
        colors: {
            prim: "primary",
            sec: "secondary",
        },
    }
}

export async function handleRebootNodeRed () { 
    const res = await fetch(config.domain + config.endPoints.restart, {
        method: config.postMethod,
        headers: {
            "Content-Type": "application/json"
        },
    });
}

export async function handleAddCustomNode ({ value, nodeNameRef, nodeDesRef }) { 
    const category = value;
    const description = nodeDesRef.current.value;
    const name = nodeNameRef.current.value; 
    // Fehlerbehandlung noch nicht richitg muss vor der inizialisirung sien und kp ob null oder ""
    if (name === null || description === "" || category === "") {
        alert("Transition message all fields must be filled in");
        return; 
    }

    const payload = {
        table: category,
        name: name,
        description: description
    };

    const res = await fetch(config.domain + config.endPoints.createCustomNodes, {
        method: config.postMethod,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    const data = await res.json();

    console.log(data);
}

export async function handleAddCategory (newOption, setOpenDialog) { 
    const payload = {
        table: newOption
    };

    const res = await fetch(config.domain + config.endPoints.createNewTable, {
        method: config.postMethod,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    setOpenDialog(false);        
    console.log(data);
}

export async function addNewFlow(data) {
    const update = await fetch(config.domain + config.endPoints.getAllFlows, {
        method: config.postMethod,
        headers: {
        "Content-Type": "application/json",
    },
        body: JSON.stringify(data),
    });

    if (!update.ok) {
        console.error("Error when creating:", update.status);
    }
}

export async function getTabelList() {
    const res = await fetch(config.domain + config.endPoints.getAllTables, {
        method: config.postMethod,
        headers: {
        "Content-Type": "application/json"
        },
    });
    const data = await res.json();
    return data;
}

export async function getExistingFlowData() { 
    const res = await fetch(config.domain + config.endPoints.getAllFlows);
    const data = await res.json();
    return data;
}

export async function handleOpenFlow(flowID) {
    window.open(`${config.domain}#flow/${flowID}`, "_blank");
}

export async function handleAddFlow({existingFields, flowNameRef, setFlows, setAnchorEl, setCurrentFlow}) {
    const data = await getExistingFlowData();
    const flowName = flowNameRef.current.value;
    const id = await generateId();

    if (flowName === "") {
        alert("Name incorect");
        return;
    }
    await createNewFlow(data, id, flowName);
    const forceRefresh = true;
    await addFlowFields({forceRefresh, existingFields, setFlows, setAnchorEl, setCurrentFlow});
}

export async function addFlowFields({forceRefresh = false, existingFields, setFlows, setAnchorEl, setCurrentFlow}) {
    const data = await getExistingFlowData();
    const tabs = data.filter((flow) => flow.type === config.flowType);
    if (forceRefresh) {
        existingFields.current = [];
        setFlows([]);
    }
    for (const flow of tabs) {
        if (!existingFields.current.includes(flow.id)) {
            const newFlow = (
                <GridItem
                    xs={config.flowFieldDesign.sizeAuto}
                    sm={config.flowFieldDesign.sizeAuto}
                    md={config.flowFieldDesign.sizeAuto}
                    lg={config.flowFieldDesign.sizeAuto}
                    key={flow.id}
                    style={{ height: "105px" }}
                >
                    <Card>
                        <CardBody>
                            <div>
                                <Button
                                    variant={config.flowFieldDesign.variantContained}
                                    color={config.flowFieldDesign.colors.prim}
                                    style={{ marginRight: "5px" }}
                                    onClick={() => handleOpenFlow(flow.id)}
                                >
                                    {flow.label}
                                </Button>

                                <Button
                                    variant={config.flowFieldDesign.variantContained}
                                    color={config.flowFieldDesign.colors.sec}
                                    onClick={(e) => handleSettingsClick({event: e, flow, setAnchorEl, setCurrentFlow})} 
                                >
                                    <SettingsIcon />
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </GridItem>
            );
            existingFields.current.push(flow.id);
            setFlows((prev) => [...prev, newFlow]);
        }
    }
}

const handleSettingsClick = ({event, flow, setAnchorEl, setCurrentFlow}) => {
    setAnchorEl(event.currentTarget);
    setCurrentFlow(flow);
};

function generateId() {
    return Math.random().toString(16).substr(2, 8);
}

async function createNewFlow(data, id, flowName) {
    const newFlow = {
        id: id,
        type: config.flowType,
        label: flowName,
        disabled: false,
        info: "",
        env: [],
    };
    data.push(newFlow);
    await addNewFlow(data);
}