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
  DialogActions,
  InputAdornment,
  Tooltip 
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Close as CloseIcon, Info as InfoIcon } from "@material-ui/icons";

// Core Components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

// Styles
import styles from "assets/jss/material-dashboard-react/views/nodeRedStyle.js";

import { handleAddCustomNode, handleAddCategory, handleRebootNodeRed, addNodeFlields, getTableList } from '../../backend/node-red/settingsFunctions';

const useStyles = makeStyles(styles);

const config = { 
    text: {
        titleArea: {
            title: "Node-Red",
            titleDescription: "Flows for the visualisation of diagrams",
        },
        settingsArea: {
            title: "Settings",
            addCategoryOption: "Add",
            categoryLabel: "Category",
            dialogField: {
                title: "Add new Category",
                textFieldLabelNew: "new Category",
                textFieldLabelColor: "Color (Optional)",
                textFieldLabelIcon: "Icon (Optional)",
                infoMessageColor: "Enter a color in hex format, e.g., #ffff",
                infoMessageIcon: "Choose an icon from Font Awesome v4 (e.g., fa-wrench): https://fontawesome.com/v4/icons/",
                cancelButton: "Cancel",
                addButton: "Add",
            },
            nameLabel: "Node Name",
            desLabel: "Node Description",
            addNodeButton: "Add Node",
            rebootNodeRedButton: "Reboot node-red",
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
    const [newOptionName, setNewOptionName] = useState("");
    const [newOptionIcon, setNewOptionIcon] = useState("");
    const [newOptionColor, setNewOptionColor] = useState("");

    const customOptions = [...options, "__add_new__"];

    const open = Boolean(anchorEl);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        const list = await getTableList();
        setOptions(list);
    }

    useEffect(() => {
        const forceRefresh = false;
        addNodeFlields({forceRefresh, existingFields, setFlows });
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
                                                        <TextField {...params} label={config.text.settingsArea.categoryLabel} variant={config.design.variants.out} />
                                                    )}
                                                />      
                                                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                                                    <DialogTitle>{config.text.settingsArea.dialogField.title}</DialogTitle>
                                                    <DialogContent>
                                                        <TextField
                                                            autoFocus
                                                            margin="dense"
                                                            label={config.text.settingsArea.dialogField.textFieldLabelNew}
                                                            fullWidth
                                                            value={newOptionName}
                                                            onChange={(e) => setNewOptionName(e.target.value)}
                                                        />
                                                    </DialogContent>

                                                    <DialogContent>
                                                        <TextField
                                                            margin="dense"
                                                            label={config.text.settingsArea.dialogField.textFieldLabelColor}
                                                            fullWidth
                                                            value={newOptionColor}
                                                            onChange={(e) => setNewOptionColor(e.target.value)}

                                                            InputProps={{
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                    <Tooltip title={config.text.settingsArea.dialogField.infoMessageColor}>
                                                                        <InfoIcon style={{ cursor: "pointer" }} />
                                                                    </Tooltip>
                                                                    </InputAdornment>
                                                                )
                                                            }}
                                                        />
                                                    </DialogContent>

                                                    <DialogContent>
                                                        <TextField
                                                            margin="dense"
                                                            label={config.text.settingsArea.dialogField.textFieldLabelIcon}
                                                            fullWidth
                                                            value={newOptionIcon}
                                                            onChange={(e) => setNewOptionIcon(e.target.value)}

                                                            InputProps={{
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                    <Tooltip title={config.text.settingsArea.dialogField.infoMessageIcon}>
                                                                        <InfoIcon style={{ cursor: "pointer" }} />
                                                                    </Tooltip>
                                                                    </InputAdornment>
                                                                )
                                                            }}
                                                        />
                                                    </DialogContent>

                                                    <DialogActions>
                                                        <Button onClick={() => setOpenDialog(false)} color={config.design.colors.prim}>
                                                            {config.text.settingsArea.dialogField.cancelButton}
                                                        </Button>

                                                        <Button
                                                            onClick={() => handleAddCategory(newOptionName, newOptionColor, newOptionIcon, setOpenDialog, fetchData, setValue)}
                                                            color={config.design.colors.prim}
                                                        >
                                                            {config.text.settingsArea.dialogField.addButton}
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>
                                                
                                                <TextField
                                                    inputRef={nodeNameRef}
                                                    label={config.text.settingsArea.nameLabel}
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
                                                    label={config.text.settingsArea.desLabel}
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
                                                            existingFields, 
                                                            setFlows
                                                        })
                                                    }
                                                    size={config.design.sizes.med}
                                                    style={{marginLeft: config.design.settingsArea.setMargin}}
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
        </div>
    );
}
