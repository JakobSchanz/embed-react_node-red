import React from "react";

import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import { Settings as SettingsIcon } from "@material-ui/icons";
import { Button } from "@material-ui/core";

export async function handleRebootNodeRed () { 
    const res = await fetch("http://localhost:8000/restart-node-red", {
        method: "POST",
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

    const res = await fetch("http://localhost:8000/db-api/crate-custom-node", {
        method: "POST",
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

    const res = await fetch("http://localhost:8000/db-api/crate-new-table", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    setOpenDialog(false);        
    console.log(data);
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
    const tabs = data.filter((flow) => flow.type === "tab");
    if (forceRefresh) {
        existingFields.current = [];
        setFlows([]);
    }
    for (const flow of tabs) {
        if (!existingFields.current.includes(flow.id)) {
            const newFlow = (
                <GridItem
                    xs="auto"
                    sm="auto"
                    md="auto"
                    lg="auto"
                    key={flow.id}
                    style={{ height: "105px" }}
                >
                    <Card>
                        <CardBody>
                            <div>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{ marginRight: "5px" }}
                                    onClick={() => handleOpenFlow(flow.id)}
                                >
                                    {flow.label}
                                </Button>

                                <Button
                                    variant="contained"
                                    color="secondary"
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

export async function getTabelList() {
    const res = await fetch("http://localhost:8000/db-api/table-list", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
    });
    const data = await res.json();
    return data;
}

function generateId() {
    return Math.random().toString(16).substr(2, 8);
}

export async function getExistingFlowData() { 
    const res = await fetch("http://localhost:8000/flows");
    const data = await res.json();
    return data;
}

async function createNewFlow(data, id, flowName) {
    const newFlow = {
        id: id,
        type: "tab",
        label: flowName,
        disabled: false,
        info: "",
        env: [],
    };
    data.push(newFlow);
    await addNewFlow(data);
}

export async function addNewFlow(data) {
    const update = await fetch("http://localhost:8000/flows", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
    },
        body: JSON.stringify(data),
    });

    if (!update.ok) {
        console.error("Error when creating:", update.status);
    }
}

export async function handleOpenFlow(flowID) {
    window.open(`http://localhost:8000/#flow/${flowID}`, "_blank");
}