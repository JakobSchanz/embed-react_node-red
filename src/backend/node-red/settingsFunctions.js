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
    try {
        const res = await fetch(config.domain + config.endPoints.restart, {
            method: config.postMethod,
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (res.status !== 200) {
            throw new Error ("Error when restarting node-red");
        }
    } catch (error) {
        console.error("Error in Function handleRebootNodeRed: ", error.message);
    }
}

export async function handleAddCustomNode ({ value, nodeNameRef, nodeDesRef }) { 
    try {
        if (nodeNameRef.current.value === "" || nodeDesRef.current.value === "" || value === null) {
            alert("all fields must be completed");
            throw new Error("One node Data is empty");
        }

        const payload = {
            table: value,
            name: nodeNameRef.current.value,
            description: nodeDesRef.current.value
        };

        const res = await fetch(config.domain + config.endPoints.createCustomNodes, {
            method: config.postMethod,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.status !== 200) {
            throw new Error("Error when creating new Node");
        }
    } catch (error) {
        console.error("Error in Function handleAddCustomNode: ", error.message);
    }
}

export async function handleAddCategory (newOptionName, newOptionColor, newOptionIcon, setOpenDialog, fetchData, setValue) { 
    try {
        const payload = {
            tableName: newOptionName,
            tableColor: newOptionColor,
            tableIcon: newOptionIcon
        };
        
        console.log(newOptionName);

        const res = await fetch(config.domain + config.endPoints.createNewTable, {
            method: config.postMethod,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        setOpenDialog(false);       

        if (data.status !== 200) {
            throw new Error ("Error when creating new Table");
        }
        await fetchData();
        setValue(newOptionName);
    } catch (error) {
        console.error("Error in Function handleAddCategory: ", error.message);
    }
}

export async function addNewFlow(data) {
    try {
        await fetch(config.domain + config.endPoints.getAllFlows, {
            method: config.postMethod,
            headers: {
            "Content-Type": "application/json",
        },
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error("Error in Function addNewFlow: ", error.message);
    }
}

export async function getTableList() {
    try {
        const res = await fetch(config.domain + config.endPoints.getAllTables, {
            method: config.postMethod,
            headers: {
                "Content-Type": "application/json"
            },
        });
        const data = await res.json();
        if (!data) {
            throw new Error ("Error when fetching the tables");
        }
        return data;
    } catch (error) {
        console.error("Error in Function getTableList: ", error.message);
    }
}

export async function getExistingFlowData() {
    try {
        const res = await fetch(config.domain + config.endPoints.getAllFlows);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error in Function getExistingFlowData");
    } 
}

export async function handleOpenFlow(flowID) {
    window.open(`${config.domain}#flow/${flowID}`, "_blank");
}

export async function handleAddFlow({existingFields, flowNameRef, setFlows, setAnchorEl, setCurrentFlow}) {
    try {
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
    } catch (error) {
        console.error("Error in function handleAddFlow: ", error.message);
    }
}

export async function addFlowFields({forceRefresh = false, existingFields, setFlows, setAnchorEl, setCurrentFlow}) {
    try {
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
    } catch (error) {
        console.error("Error in Function addFlowFields: ", error.message);
    }
}

const handleSettingsClick = ({event, flow, setAnchorEl, setCurrentFlow}) => {
    setAnchorEl(event.currentTarget);
    setCurrentFlow(flow);
};

function generateId(existingIds = []) {
    let id;
    do {
        id = Math.random().toString(16).substr(2, 8);
    } while (existingIds.includes(id));
    return id;
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