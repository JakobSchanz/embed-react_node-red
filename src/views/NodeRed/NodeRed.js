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

const config = {
    text: {
        titleArea: {
            title: "Node-Red",
            titleDescription: "Flows for the visualisation of diagrams",
        },
        settingsArea: {
            title: "Settings",
            flowNameLable: "Flow Name",
            addFlowButton: "Add Flow",
            addCategoryOption: "Add",
            categoryLable: "Category",
            dialogField: {
                title: "Add new Category",
                textFieldLable: "new Category",
                cancelButton: "Cancel",
                addButton: "Add",
            },
            nameLable: "Node Name",
            desLable: "Node Description",
            addNodeButton: "Add Node",
            rebootNodeRedButton: "Reboot node-red",
        },
        flowSettings: {
            title: "Settings for:",
            renameLable: "Edit Name",
            saveButton: "Save",
            deleteButton: "Delete",
        },
    },
    design: {
        colors: {
            prim: "primary",
        },
        variants: {
            out: "outlined",
            cont: "contained",
        },
        sizes: {
            med: "medium",
            sma: "small",
        },
        settingsArea:{
            setMargin: "10px",
            setWidth: "150px",
            setHeight: "40px",
        },
        displayFlex: "flex",
    }
}

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
                        <CardHeader plain color={config.design.colors.prim}>
                            <h4 className={classes.cardTitleWhite}>{config.text.titleArea.title}</h4>
                            <p className={classes.cardCategoryWhite}>
                                {config.text.titleArea.titleDescription}
                            </p>
                        </CardHeader>

                        <GridContainer>
                            <GridItem xs={12} sm={12} md={12}>
                                <Card>
                                    <CardHeader
                                        plain
                                        color={config.design.colors.prim}
                                        className={classes.smallCardHeader}
                                    >
                                        <h4 className={classes.cardTitleBlack}>{config.text.settingsArea.title}</h4>
                                    </CardHeader>

                                    <CardBody>
                                        <div
                                            className={classes.basicStyleOne}
                                        >
                                            <div className={classes.basicStyleOne}>
                                                <TextField
                                                    inputRef={flowNameRef}
                                                    label={config.text.settingsArea.flowNameLable}
                                                    variant={config.design.variants.out}
                                                    size={config.design.sizes.sma}
                                                    InputProps={{
                                                        style: {height: config.design.settingsArea.setHeight, flex: 1},
                                                    }}
                                                    style={{ marginRight: config.design.settingsArea.setMargin}}
                                                />

                                                <Button
                                                    variant={config.design.variants.cont}
                                                    color={config.design.colors.prim}
                                                    onClick={() =>
                                                        handleAddFlow({
                                                            existingFields,
                                                            flowNameRef,
                                                            setFlows,
                                                            setAnchorEl,
                                                            setCurrentFlow
                                                        })
                                                    }
                                                    size={config.design.sizes.med}
                                                >
                                                    {config.text.settingsArea.addFlowButton}
                                                </Button>
                                            </div>
                                            
                                            <div className={classes.settingsDiv}>
                                                <Autocomplete
                                                    style={{width: config.design.settingsArea.setWidth}}
                                                    size={config.design.sizes.sma}
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
                                                        <TextField {...params} label={config.text.settingsArea.categoryLable} variant={config.design.variants.out} />
                                                    )}
                                                />      
                                                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                                                    <DialogTitle>{config.text.settingsArea.dialogField.title}</DialogTitle>
                                                    <DialogContent>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            label={config.text.settingsArea.dialogField.textFieldLable}
                                                            fullWidth
                                                            value={newOption}
                                                            onChange={(e) => setNewOption(e.target.value)}
                                                        />
                                                    </DialogContent>

                                                    <DialogActions>
                                                        <Button onClick={() => setOpenDialog(false)} color={config.design.colors.prim}>
                                                            {config.text.settingsArea.dialogField.cancelButton}
                                                        </Button>

                                                        <Button
                                                            onClick={() => handleAddCategory(newOption, setOpenDialog)}
                                                            color={config.design.colors.prim}
                                                        >
                                                            {config.text.settingsArea.dialogField.addButton}
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>
                                                
                                                <TextField
                                                    inputRef={nodeNameRef}
                                                    label={config.text.settingsArea.nameLable}
                                                    variant={config.design.variants.out}
                                                    size={config.design.sizes.sma}
                                                    InputProps={{
                                                        style: {
                                                            height: config.design.settingsArea.setHeight,
                                                            flex: 1,
                                                        },
                                                    }}
                                                    style={{
                                                        width: config.design.settingsArea.setWidth,
                                                        marginLeft: config.design.settingsArea.setMargin,
                                                    }}
                                                />

                                                <TextField
                                                    inputRef={nodeDesRef}
                                                    label={config.text.settingsArea.desLable}
                                                    variant={config.design.variants.out}
                                                    size={config.design.sizes.sma}
                                                    InputProps={{
                                                        style: {
                                                            height: config.design.settingsArea.setHeight,
                                                            flex: 1,
                                                        },
                                                    }}
                                                    style={{
                                                        width: config.design.settingsArea.setWidth,
                                                        marginLeft: config.design.settingsArea.setMargin,
                                                    }}
                                                />
                                                <Button
                                                    variant={config.design.variants.cont}
                                                    color={config.design.colors.prim}
                                                    onClick={() =>
                                                        handleAddCustomNode({
                                                            value,
                                                            nodeNameRef,
                                                            nodeDesRef,
                                                        })
                                                    }
                                                    size={config.design.sizes.med}
                                                    style={{marginLeft: config.design.settingsArea.setMargin,}}
                                                >
                                                    {config.text.settingsArea.addNodeButton}
                                                </Button>

                                                <Button
                                                    variant={config.design.variants.cont}
                                                    color={config.design.colors.prim}
                                                    onClick={handleRebootNodeRed}
                                                    size={config.design.sizes.med}
                                                    style={{marginLeft: config.design.settingsArea.setMargin,}}
                                                >
                                                    {config.text.settingsArea.rebootNodeRedButton}
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
                    <div style={{ display: config.design.displayFlex, justifyContent: "space-between" }}>
                        <p>
                            <strong>{config.text.flowSettings.title}</strong> {currentFlow && currentFlow.label}
                        </p>

                        <Button
                            className={classes.settingsButton}
                            variant={config.design.variants.cont}
                            color={config.design.colors.prim}
                            onClick={() => handleSettingsClose(setAnchorEl, setCurrentFlow)}
                        >
                            <CloseIcon />
                        </Button>
                    </div>
                    
                    <div style={{display: config.design.displayFlex}}>
                        <TextField
                            label={config.text.flowSettings.renameLable}
                            fullWidth
                            defaultValue={currentFlow && currentFlow.label}
                            inputRef={renameRef}
                        />
                        <Button
                            style={{ marginTop: "12px", marginLeft: "7px" }}
                            variant={config.design.variants.cont}
                            color={config.design.colors.prim}
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
                            {config.text.flowSettings.saveButton}
                        </Button>
                    </div>
                    
                    <Button
                        style={{ marginTop: "12px", width: "100%" }}
                        variant={config.design.variants.cont}
                        color={config.design.colors.prim}
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
                        {config.text.flowSettings.deleteButton}
                    </Button>
                </div>
            </Popover>
        </div>
    );
}
