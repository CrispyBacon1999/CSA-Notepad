import React from "react";

import WifiOffIcon from "@material-ui/icons/WifiOff";
import CodeIcon from "@material-ui/icons/Code";
import LaptopIcon from "@material-ui/icons/Laptop";
import VideocamIcon from "@material-ui/icons/Videocam";
import BatteryAlertIcon from "@material-ui/icons/BatteryAlert";
import GestureIcon from "@material-ui/icons/Gesture";

const types = {
  networking: <WifiOffIcon />,
  code: <CodeIcon />,
  driverstation: <LaptopIcon />,
  camera: <VideocamIcon />,
  battery: <BatteryAlertIcon />,
  wiring: <GestureIcon />
};

export const getProblemIcon = type => {
  return types[type.toLowerCase()];
};
