import React from "react";

import { Box } from "@material-ui/core";

export default function NodeRedView() {
  return (
        <Box display="flex" flexDirection="column" height="80vh">
            <Box flex={1} overflow="hidden">
                <iframe
                    src="http://localhost:8000"
                    title="Node-RED"
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                    }}
                />
            </Box>
        </Box>
    );
}
