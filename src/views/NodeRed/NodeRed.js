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
  const flowName = flowNameRef.current.value;
  if (flowName === "") {
    alert("No name defined");
    return;
  }

  const id = await hashFlowNameForIDs(flowName + Date.now());
  console.log("Generated ID:", id);

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


  function hashFlowNameForIDs(str, salt) {
    let hash = 0;
    const input = str + salt;
    for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash |= 0;
    }
    return hash >>> 0;
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
