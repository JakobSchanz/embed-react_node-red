import React, { useState, useRef } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";

import SettingsIcon from '@material-ui/icons/Settings';

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-react/views/nodeRedStyle.js";

const useStyles = makeStyles(styles);

export default function NodeRed() {
    const flowNameRef = useRef();
    const classes = useStyles();

    const [flows, setFlows] = useState([]);



    async function handleAddFlow() {
        const data = await getExistingFlowData();
        const flowName = flowNameRef.current.value;
        const id = await generateId();

        if (flowName === "") {
            alert("Name incorect");
            return;
        }

        createNewFlow(data, id, flowName);
        const newFlow = (
            <GridItem xs="auto" sm="auto" md="auto" lg="auto" key={id}>
                <Card>
                    <CardBody>
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginRight: "5px" }}
                                onClick={() => alert("Open Flow")}
                            >
                                {flowName}
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => alert("Settings")}
                            >
                                <SettingsIcon />
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </GridItem>
        );
        setFlows((prev) => [...prev, newFlow]);
    }

    function generateId() {
        return Math.random().toString(16).substr(2, 8);
    }

    async function getExistingFlowData (){
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
            env: []        
        }
        data.push(newFlow);
        addNewFlow(data);
    }

    async function addNewFlow(data) {
        const update = await fetch("http://localhost:8000/flows", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (update.ok) {
            console.log("Neuer Flow erstellt!");
        } else {
            console.error("Fehler beim Erstellen:", update.status);
        }
    }

    return (
        <div>
            <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                    <Card plain>
                        <CardHeader plain color="primary">
                            <h4 className={classes.cardTitleWhite}>Node-Red</h4>
                            <p className={classes.cardCategoryWhite}>
                                Flows for the visualisation of diagrams
                            </p>
                        </CardHeader>

                        <GridContainer>
                            <GridItem xs={12} sm={12} md={12}>
                                <Card>
                                    <CardHeader plain color="primary" className={classes.smallCardHeader}>
                                        <h4 className={classes.cardTitleBlack}>Settings</h4>
                                    </CardHeader>

                                    <CardBody>
                                        <div id="node-red-settings" style={{ display: "flex", alignItems: "center" }}>
                                            <TextField
                                                inputRef={flowNameRef}
                                                label="Flow Name"
                                                variant="outlined"
                                                size="small"
                                                margin="normal"
                                                InputProps={{
                                                    style: {
                                                    height: "40px", 
                                                    flex: 1, 
                                                },
                                                }}
                                                style={{
                                                    marginRight: "10px", 
                                                }}
                                            />

                                            <Button
                                                id="add-new-flow"
                                                variant="contained"
                                                color="primary"
                                                onClick={handleAddFlow}
                                                style={{
                                                    height: "40px",
                                                }}
                                            >
                                                Add Flow
                                            </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </GridItem>
                        </GridContainer>

                        <GridContainer spacing={3} style={{ flexWrap: "wrap" }}>
                            {flows.map((flow) => flow)}
                        </GridContainer>
                    </Card>
                </GridItem>
            </GridContainer>
        </div>
    );
}
