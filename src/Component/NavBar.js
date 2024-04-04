import React, { useEffect, useRef, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BlockPicker } from "react-color";
import { FaShare } from "react-icons/fa6";
import {
  Button,
  IconButton,
  Typography,
  MenuItem,
  Box,
  TextField,
  ButtonGroup,
  Select,
} from "@mui/material";
import { IoMdColorFill } from "react-icons/io";
import SaveIcon from "@mui/icons-material/Save";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { LuFileSpreadsheet } from "react-icons/lu";
import { styled } from "@mui/material/styles";
import ExcelJS from "exceljs";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const theme = createTheme({
  palette: {
    secondary: {
      main: "#000",
    },
  },
});

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#A0AAB4",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#B2BAC2",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#E0E3E7",
    },
    "&:hover fieldset": {
      borderColor: "#B2BAC2",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6F7E8C",
    },
  },
});

const CustomSelect = styled(Select)({
  "& .MuiSelect-root": {
    backgroundColor: "transparent",
  },
  "& .MuiSelect-select:focus": {
    backgroundColor: "transparent",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderWidth: "0px",
  },
  "& .MuiFilledInput-input": {
    paddingTop: "11px",
  },
});

const fontFamilies = [
  "Arial",
  "Times New Roman",
  "Verdana",
  "Courier New",
  "Georgia",
  "Comic Sans MS",
  "Tahoma",
  "Impact",
];

const Navbar = ({ cells, handleCellPropertyChange, currCell, setCells }) => {
  const [fileName, setFileName] = useState("Untitled Spreadsheet");
  const [fontSize, setFontSize] = useState(cells[currCell].fontSize);
  const [fontFamily, setFontFamily] = useState(cells[currCell].fontFamily);
  const [color, setColor] = useState(cells[currCell].fontColor);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState(cells[currCell].fontColor);
  const [cellcolor, setcellColor] = useState(
    cells[currCell].cellColor ? cells[currCell].cellColor : "#FFFFFF"
  );
  const [showcellColorPicker, setShowcellColorPicker] = useState(false);
  const [selectedcellColor, setSelectedcellColor] = useState(
    cells[currCell].cellColor
  );

  useEffect(() => {
    setColor(cells[currCell].fontColor);
    setSelectedColor(cells[currCell].fontColor);
    setcellColor(cells[currCell].cellColor);
    setSelectedcellColor(cells[currCell].cellColor);
    setFontSize(cells[currCell].fontSize);
    setShowColorPicker(false);
    setShowcellColorPicker(false);
    setFontFamily(cells[currCell].fontFamily);
  }, [currCell, cells]);

  const toggleBold = () => {
    handleCellPropertyChange(currCell, "bold", !cells[currCell].bold);
  };

  const toggleItalic = () => {
    handleCellPropertyChange(currCell, "italic", !cells[currCell].italic);
  };

  const toggleLinethrough = () => {
    handleCellPropertyChange(
      currCell,
      "linethrough",
      !cells[currCell].linethrough
    );
  };

  const handleColorChange = (newColor) => {
    setSelectedColor(newColor.hex);
  };

  const applyColor = () => {
    setColor(selectedColor);
    handleCellPropertyChange(currCell, "fontColor", selectedColor);
    setShowColorPicker(false);
  };

  const handlecellColorChange = (newColor) => {
    setSelectedcellColor(newColor.hex);
  };

  const applycellColor = () => {
    setcellColor(selectedcellColor);
    handleCellPropertyChange(currCell, "cellColor", selectedcellColor);
    setShowcellColorPicker(false);
  };

  const handleFontFamilyChange = (event) => {
    const newFontFamily = event.target.value;
    setFontFamily(newFontFamily);
    handleCellPropertyChange(currCell, "fontFamily", newFontFamily);
  };

  useEffect(() => {
    changeFontSize();
  }, [fontSize]);

  const changeFontSize = () => {
    // console.log(fontSize);
    handleCellPropertyChange(currCell, "fontSize", fontSize);
  };

  const increaseFontSize = () => {
    setFontSize((prevSize) => prevSize + 1);
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => Math.max(prevSize - 1, 1));
  };

  const convertHexToARGB = (hex) => {
    hex = hex.replace("#", "");

    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    let a = 255;

    if (hex.length === 8) {
      a = parseInt(hex.substring(6, 8), 16);
    }

    const pad = (component) => {
      return ("0" + component.toString(16)).slice(-2);
    };

    return pad(a) + pad(r) + pad(g) + pad(b);
  };

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Add cell data
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 26; j++) {
        const cellId = `${String.fromCharCode(65 + j)}${i + 1}`;
        const cell = cells[cellId];
        const excelCell = worksheet.getCell(cellId);
        excelCell.value = cell.value;

        const font = {
          bold: cell.bold || false,
          italic: cell.italic || false,
          strikethrough: cell.linethrough || false,
          name: cell.fontFamily || "Arial",
          size: cell.fontSize || 16,
          color: { argb: convertHexToARGB(cell.fontColor) },
        };
        if (cellId === "F1") console.log(cell.fontColor, cell.cellColor);
        excelCell.font = font;

        // Apply cell background color
        if (cell.cellColor) {
          excelCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: convertHexToARGB(cell.cellColor) },
          };
        }
      }
    }

    // Save the workbook
    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const fName = `${fileName}.xlsx`;
        if (window.navigator.msSaveOrOpenBlob) {
          // For IE
          window.navigator.msSaveOrOpenBlob(blob, fName);
        } else {
          // For other browsers
          const a = document.createElement("a");
          document.body.appendChild(a);
          const url = window.URL.createObjectURL(blob);
          a.href = url;
          a.download = fName;
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
      })
      .catch((error) => {
        console.error("Error exporting to Excel:", error);
      });
  };

  const fileInputRef = useRef(null);

  const openFileInput = () => {
    fileInputRef.current.click();
  };

  const importFromExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = new ExcelJS.Workbook();
      workbook.xlsx.load(data).then(() => {
        const worksheet = workbook.getWorksheet(1);

        worksheet.eachRow((row, rowIndex) => {
          row.eachCell((cell, colIndex) => {
            const cellId = `${String.fromCharCode(64 + colIndex)}${rowIndex}`;
            const cellValue = cell.value;

            handleCellPropertyChange(cellId, "value", cellValue);
          });
        });
      });
    };
    reader.readAsArrayBuffer(file);
  };

  const defaultCellProperties = {
    bold: false,
    italic: false,
    linethrough: false,
    fontFamily: "Arial",
    fontSize: 14,
    halign: "left",
    value: "",
    children: [],
    formula: "",
    fontColor: "#000000",
    cellColor: "",
  };

  const newPage = () => {
    // console.log("derf");
    const resetCells = {};
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < 26; j++) {
        const cellId = `${String.fromCharCode(65 + j)}${i + 1}`;
        resetCells[cellId] = { ...defaultCellProperties };
      }
    }
    setCells(resetCells);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          width: "100%",
          right: 0,
          left: "auto",
          zIndex: 1000,
          backgroundColor: "#f9fbfd",
        }}
      >
        <Box px={2} paddingTop={2}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <LuFileSpreadsheet size={30} color="green" />
                  <CssTextField
                    value={fileName}
                    variant="outlined"
                    size="small"
                    onChange={(e) => setFileName(e.target.value)}
                    // sx={{
                    //   width:100,
                    // }}
                  />
                </Box>
                <Box
                  sx={{
                    mx: 6,
                  }}
                >
                  <ButtonGroup variant="text" aria-label="Basic button group">
                    <Button
                      size="small"
                      color="secondary"
                      endIcon={<AddIcon />}
                      onClick={newPage}
                    >
                      New
                    </Button>
                    <Button
                      size="small"
                      color="secondary"
                      endIcon={<OpenInNewIcon />}
                      onClick={openFileInput}
                    >
                      Open
                    </Button>
                    <Button
                      size="small"
                      color="secondary"
                      endIcon={<SaveIcon />}
                      onClick={exportToExcel}
                    >
                      Save
                    </Button>
                  </ButtonGroup>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Box>
                  <Button
                    variant="filled"
                    size="small"
                    endIcon={<FaShare />}
                  >
                    Share
                  </Button>
                </Box>
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    const credentialResponseDecoded = jwtDecode(
                      credentialResponse.credential
                    );
                    console.log(credentialResponseDecoded);
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                  useOneTap
                  auto_select
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                height: 40,
                marginY: 1,
                px: 2,
                py: 0.5,
                gap: 3,
                backgroundColor: "#ecf1fa",
                borderRadius: 5,
              }}
            >
              <ButtonGroup variant="text" aria-label="Basic button group">
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => toggleBold()}
                  sx={{
                    backgroundColor: cells[currCell].bold
                      ? "#d3e3fd"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: cells[currCell].bold
                        ? "#d3e3fd"
                        : "#e3e8f0",
                    },
                  }}
                >
                  <Typography fontWeight="bold">B</Typography>
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => toggleItalic()}
                  sx={{
                    backgroundColor: cells[currCell].italic
                      ? "#d3e3fd"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: cells[currCell].italic
                        ? "#d3e3fd"
                        : "#e3e8f0",
                    },
                  }}
                >
                  <Typography fontStyle="italic">I</Typography>
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => toggleLinethrough()}
                  sx={{
                    backgroundColor: cells[currCell].linethrough
                      ? "#d3e3fd"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: cells[currCell].linethrough
                        ? "#d3e3fd"
                        : "#e3e8f0",
                    },
                  }}
                >
                  <Typography style={{ textDecoration: "line-through" }}>
                    S
                  </Typography>
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                >
                  <Box
                    sx={{
                      borderBottom: `4px solid ${color}`,
                      width: "90%",
                      height: "75%",
                    }}
                  >
                    <Typography>A</Typography>
                  </Box>
                </Button>
              </ButtonGroup>
              <span
                style={{
                  borderRight: "1px solid gray",
                  height: "24px",
                  marginRight: "5px",
                }}
              ></span>
              <ButtonGroup
                variant="text"
                aria-label="Basic button group"
                sx={{
                  alignItems: "center",
                }}
              >
                <IconButton
                  size="small"
                  color="secondary"
                  onClick={increaseFontSize}
                >
                  <AddIcon />
                </IconButton>

                <TextField
                  size="small"
                  value={fontSize}
                  sx={{
                    width: 46,
                  }}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                />

                <IconButton
                  size="small"
                  color="secondary"
                  onClick={decreaseFontSize}
                >
                  <RemoveIcon />
                </IconButton>
              </ButtonGroup>
              <span
                style={{
                  borderRight: "1px solid gray",
                  height: "24px",
                  marginRight: "5px",
                }}
              ></span>
              <CustomSelect
                value={fontFamily}
                onChange={handleFontFamilyChange}
                variant="filled"
                disableUnderline
                sx={{
                  height: 30,
                  backgroundColor: "transparent",
                }}
              >
                {fontFamilies.map((font) => (
                  <MenuItem key={font} value={font}>
                    <Typography style={{ fontFamily: font }}>{font}</Typography>
                  </MenuItem>
                ))}
              </CustomSelect>

              <span
                style={{
                  borderRight: "1px solid gray",
                  height: "24px",
                  marginRight: "5px",
                }}
              ></span>
              <ButtonGroup variant="text" aria-label="Basic button group">
                <Button
                  color="secondary"
                  onClick={() => setShowcellColorPicker(!showcellColorPicker)}
                >
                  <Box
                    sx={{
                      borderBottom: `4px solid ${cellcolor}`,
                      width: "100%",
                      height: "69%",
                    }}
                  >
                    <IoMdColorFill height="18px" width="25px" />
                  </Box>
                </Button>
              </ButtonGroup>
              {showColorPicker && (
                <Box
                  sx={{
                    position: "absolute",
                    zIndex: 1000,
                    top: "110px",
                    left: "79px",
                    padding: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <BlockPicker
                    color={selectedColor}
                    onChange={handleColorChange}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={applyColor}
                  >
                    Done
                  </Button>
                </Box>
              )}

              {showcellColorPicker && (
                <Box
                  sx={{
                    position: "absolute",
                    zIndex: 1000,
                    top: "110px",
                    left: "471px",
                    padding: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <BlockPicker
                    color={selectedcellColor}
                    onChange={handlecellColorChange}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={applycellColor}
                  >
                    Done
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls"
        style={{ display: "none" }}
        onChange={(e) => importFromExcel(e.target.files[0])}
      />
    </ThemeProvider>
  );
};

export default Navbar;
