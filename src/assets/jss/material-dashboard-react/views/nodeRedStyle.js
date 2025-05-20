import {
  successColor,
  whiteColor,
  grayColor,
  hexToRgb
} from "assets/jss/material-dashboard-react.js";

const dashboardStyle = {
  cardCategoryWhite: {
    color: "rgba(" + hexToRgb(whiteColor) + ",.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: whiteColor,
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  smallCardHeader: {
  padding: "3px 6px !important",
    minHeight: "10px",
    maxHeight: "35px", 
    overflow: "hidden", 
    "& h4": {
      fontSize: "14px",
      margin: "5px 0",
      whiteSpace: "nowrap",      
      overflow: "hidden",         
      textOverflow: "ellipsis",   
    },
  },

};

export default dashboardStyle;
