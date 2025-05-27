import React from "react";

import { Box } from "@material-ui/core";

const config = {
    style: {
        box: {
            displayFlex: "flex",
            direktion: "column",
            heightConf: "80vh",
            oferflowHid: "hidden",
        },
        iFrame: {
            size: "100%",
            borderN: "none",
        },
    },
    address: "http://localhost:8000",
    title: "Node-RED",
}

export default function NodeRedView() {
  return (
        <Box display={config.style.box.displayFlex} flexDirection={config.style.box.direktion} height={config.style.box.heightConf}>
            <Box flex={1} overflow={config.style.box.oferflowHid}>
                <iframe
                    src={config.address}
                    title={config.title}
                    style={{
                        width: config.style.iFrame.size,
                        height: config.style.iFrame.size,
                        border: config.style.iFrame.borderN,
                    }}
                />
            </Box>
        </Box>
    );
} 