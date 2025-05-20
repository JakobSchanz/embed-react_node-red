import React, { useState, useRef, useEffect } from "react";

// Material UI
import {
  makeStyles,
  TextField,
  Button,
  Popover,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Close as CloseIcon } from "@material-ui/icons";

// Core Components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

// Styles
import styles from "assets/jss/material-dashboard-react/views/nodeRedStyle.js";

import { handleSettingsClose,  handleRename, handleDelete } from '../../backend/node-red/handleFunctionsFlowSettings'
import { handleAddCustomNode, handleAddCategory, handleRebootNodeRed, handleAddFlow, addFlowFields, getTabelList, getExistingFlowData, addNewFlow } from '../../backend/node-red/settingsFunctions';

const useStyles = makeStyles(styles);

export default function NodeRed() {
    const flowNameRef = useRef();
    const renameRef = useRef();
    const nodeNameRef = useRef();
    const nodeDesRef = useRef();

    const classes = useStyles();

    const existingFields = useRef([]);
    const [flows, setFlows] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentFlow, setCurrentFlow] = useState(null);
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [newOption, setNewOption] = useState("");
    const customOptions = [...options, "__add_new__"];

    const open = Boolean(anchorEl);
    const popoverId = open ? "settings-popover" : undefined;

    useEffect(() => {
        async function fetchData() {
            const list = await getTabelList();
            setOptions(list);
        }
        fetchData();
    }, []);

    useEffect(() => {
        const forceRefresh = false;
        addFlowFields({forceRefresh, existingFields, setFlows, setAnchorEl, setCurrentFlow});
    }, []);

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
                                            className={classes.basicStyleOne}
                                        >
                                            <div className={classes.basicStyleOne}>
                                                <TextField
                                                    inputRef={flowNameRef}
                                                    label="Flow Name"
                                                    variant="outlined"
                                                    size="small"
                                                    InputProps={{
                                                        style: {height: "40px", flex: 1},
                                                    }}
                                                    style={{ marginRight: "10px"}}
                                                />

                                                <Button
                                                    id="add-new-flow"
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() =>
                                                        handleAddFlow({
                                                            existingFields,
                                                            flowNameRef,
                                                            setFlows,
                                                            setAnchorEl,
                                                            setCurrentFlow
                                                        })
                                                    }
                                                    size="medium"
                                                >
                                                    Add Flow
                                                </Button>
                                            </div>
                                            
                                            <div className={classes.settingsDiv}>
                                                <Autocomplete
                                                    style={{width: "150px"}}
                                                    size="small"
                                                    value={value}
                                                    onChange={(event, newValue) => {
                                                        if (newValue === "__add_new__") {
                                                            setOpenDialog(true);
                                                        } else {
                                                            setValue(newValue);
                                                        }
                                                    }}
                                                    options={customOptions}
                                                    getOptionLabel={(option) =>
                                                        option === "__add_new__" ? "Add" : option
                                                    }
                                                    renderInput={(params) => (
                                                        <TextField {...params} label="Category" variant="outlined" />
                                                    )}
                                                />      
                                                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                                                    <DialogTitle>Add new Category</DialogTitle>
                                                    <DialogContent>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            label="new Category"
                                                            fullWidth
                                                            value={newOption}
                                                            onChange={(e) => setNewOption(e.target.value)}
                                                        />
                                                    </DialogContent>

                                                    <DialogActions>
                                                        <Button onClick={() => setOpenDialog(false)} color="primary">
                                                            Cancel
                                                        </Button>

                                                        <Button
                                                            onClick={() => handleAddCategory(newOption, setOpenDialog)}
                                                            color="primary"
                                                        >
                                                            Add
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>
                                                
                                                <TextField
                                                    inputRef={nodeNameRef}
                                                    label="Node Name"
                                                    variant="outlined"
                                                    size="small"
                                                    InputProps={{
                                                        style: {
                                                            height: "40px",
                                                            flex: 1,
                                                        },
                                                    }}
                                                    style={{
                                                        width: "150px",
                                                        marginLeft: "10px",
                                                    }}
                                                />

                                                <TextField
                                                    inputRef={nodeDesRef}
                                                    label="Node Description"
                                                    variant="outlined"
                                                    size="small"
                                                    InputProps={{
                                                        style: {
                                                            height: "40px",
                                                            flex: 1,
                                                        },
                                                    }}
                                                    style={{
                                                        width: "150px",
                                                        marginLeft: "10px",
                                                    }}
                                                />
                                                <Button
                                                    id="add-new-node"
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() =>
                                                        handleAddCustomNode({
                                                            value,
                                                            nodeNameRef,
                                                            nodeDesRef,
                                                        })
                                                    }
                                                    size="medium"
                                                    style={{marginLeft: "10px",}}
                                                >
                                                    Add Node
                                                </Button>

                                                <Button
                                                    id="reboot-node-red"
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleRebootNodeRed}
                                                    size="medium"
                                                    style={{marginLeft: "10px",}}
                                                >
                                                    Reboot node-red
                                                </Button>
                                            </div>
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
                            className={classes.settingsButton}
                            variant="contained"
                            color="primary"
                            onClick={() => handleSettingsClose(setAnchorEl, setCurrentFlow)}
                        >
                            <CloseIcon />
                        </Button>
                    </div>
                    
                    <div style={{display: "flex"}}>
                        <TextField
                            label="Edit Name"
                            fullWidth
                            defaultValue={currentFlow && currentFlow.label}
                            inputRef={renameRef}
                        />
                        <Button
                            style={{ marginTop: "12px", marginLeft: "7px" }}
                            variant="contained"
                            color="primary"
                            onClick={() =>
                                handleRename({
                                    renameRef,
                                    currentFlow,
                                    setAnchorEl,
                                    setCurrentFlow,
                                    getExistingFlowData,
                                    addNewFlow,
                                    addFlowFields,
                                    existingFields, 
                                    setFlows
                                })
                            } 
                        >
                            Save
                        </Button>
                    </div>
                    
                    <Button
                        style={{ marginTop: "12px", width: "100%" }}
                        variant="contained"
                        color="primary"
                        onClick={() =>
                            handleDelete({
                                currentFlow,
                                setAnchorEl,
                                setCurrentFlow,
                                getExistingFlowData,
                                addNewFlow,
                                addFlowFields,
                                existingFields,
                                setFlows
                            })
                        }
                    >
                        Delete
                    </Button>
                </div>
            </Popover>
        </div>
    );
}
