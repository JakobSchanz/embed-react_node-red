import React, { useState, useRef, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, Popover } from "@material-ui/core"; // <- Popover importiert

import SettingsIcon from "@material-ui/icons/Settings";
import CloseIcon from "@material-ui/icons/Close";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-react/views/nodeRedStyle.js";

const useStyles = makeStyles(styles);

export default function NodeRed() {
    const existingFields = useRef([]);

    useEffect(() => {
        addFlowFields();
    }, []);

    const flowNameRef = useRef();
    const classes = useStyles();

    const [flows, setFlows] = useState([]);

    const [anchorEl, setAnchorEl] = useState(null);
    const [currentFlow, setCurrentFlow] = useState(null);

    const handleSettingsClick = (event, flow) => {
        setAnchorEl(event.currentTarget);
        setCurrentFlow(flow);
    };

    const handleSettingsClose = () => {
        setAnchorEl(null);
        setCurrentFlow(null);
    };

    const open = Boolean(anchorEl);
    const popoverId = open ? "settings-popover" : undefined;

    async function handleAddFlow() {
        const data = await getExistingFlowData();
        const flowName = flowNameRef.current.value;
        const id = await generateId();

        if (flowName === "") {
            alert("Name incorect");
            return;
        }

        createNewFlow(data, id, flowName);
        addFlowFields();
    }

    async function addFlowFields() {
        const data = await getExistingFlowData();
        const tabs = data.filter((flow) => flow.type === "tab");

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
                                        onClick={(e) => handleSettingsClick(e, flow)} 
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

    function generateId() {
        return Math.random().toString(16).substr(2, 8);
    }

    async function getExistingFlowData() {
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
        addNewFlow(data);
    }

    async function addNewFlow(data) {
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

    async function handleOpenFlow(flowID) {
        window.open(`http://localhost:8000/#flow/${flowID}`, "_blank");
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
                                    <CardHeader
                                        plain
                                        color="primary"
                                        className={classes.smallCardHeader}
                                    >
                                        <h4 className={classes.cardTitleBlack}>Settings</h4>
                                    </CardHeader>

                                    <CardBody>
                                        <div
                                            id="node-red-settings"
                                            style={{ display: "flex", alignItems: "center" }}
                                        >
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

            <Popover
                id={popoverId}
                open={open}
                anchorEl={anchorEl}
                onClose={handleSettingsClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <div style={{ padding: "16px", minWidth: "200px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p>
                            <strong>Settings for:</strong> {currentFlow && currentFlow.label}
                        </p>

                        <Button
                            style={{ 
                                width: "24px",
                                height: "24px",
                                padding: "6px" 
                            }}
                            variant="contained"
                            color="primary"
                            onClick={handleSettingsClose}
                        >
                            <CloseIcon />
                        </Button>
                    </div>
                    
                    <div style={{display: "flex"}}>
                        <TextField
                            label="Edit Name"
                            fullWidth
                            defaultValue={currentFlow && currentFlow.label}
                        />
                        <Button
                            style={{ marginTop: "12px", marginLeft: "7px" }}
                            variant="contained"
                            color="primary"
                            onClick={handleSettingsClose}
                        >
                            Save
                        </Button>
                    </div>
                    
                    <Button
                        style={{ marginTop: "12px", width: "100%" }}
                        variant="contained"
                        color="primary"
                        onClick={handleSettingsClose}
                    >
                        Delete
                    </Button>
                </div>
            </Popover>
        </div>
    );
}
