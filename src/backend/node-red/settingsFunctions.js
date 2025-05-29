import React from "react";

import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";

const config = {
    domain: "http://localhost:8000/",
    postMethod: "POST",
    endPoints: {
        restart: "restart-node-red",
        createCustomNodes: "db-api/crate-custom-node",
        createNewTable: "db-api/crate-new-table",
        getAllFlows: "flows",
        getAllTables: "db-api/table-list",
        getAllNodes: "db-api/get-all-nodes",
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

export async function handleAddCustomNode ({ value, nodeNameRef, nodeDesRef, existingFields, setFlows }) { 
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

        const forceRefresh = false
        addNodeFlields({ forceRefresh, existingFields, setFlows });
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

export async function getExistingNodesData() {
    try {
        const res = await fetch(config.domain + config.endPoints.getAllNodes, {
            method: config.postMethod,
            headers: {
                "Content-Type": "application/json"
            },
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error in Function getExistingNodesData");
    } 
}


export async function addNodeFlields({forceRefresh = false, existingFields, setFlows }) {
    try {
        const data = await getExistingNodesData();
        if (forceRefresh) {
            existingFields.current = [];
            setFlows([]);
        }
        for (const flow of data) {
            if (!existingFields.current.includes(flow.name)) {
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
                                    <span style={{ marginRight: "5px" }}>
                                        {flow.name}
                                    </span>
                                </div>
                            </CardBody>
                        </Card>
                    </GridItem>
                );
                existingFields.current.push(flow.name);
                setFlows((prev) => [...prev, newFlow]);
            }
        }
    } catch (error) {
        console.error("Error in Function addNodeFlields: ", error.message);
    }
}