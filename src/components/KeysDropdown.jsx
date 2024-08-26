import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState, useEffect } from "react";

export default function KeysDropdown(props) {
  const [key, setKey] = useState("");
  const handleChange = (event) => {
    setKey(event.target.value);
    props.setSelectedKey(event.target.value);
  };

  useEffect(() => {
    console.log("keys added");
  }, [props.keys]);

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120, width: "500px" }}>
        <InputLabel id="demo-simple-select-helper-label">Keys</InputLabel>
        <Select
          style={{ backgroundColor: "white" }}
          value={key}
          onChange={handleChange}
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {props.keys.map((key, index) => (
            <MenuItem key={index} value={key}>
              {key}
            </MenuItem>
          ))}
          {/* <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem> */}
        </Select>
      </FormControl>
    </div>
  );
}
