import { Box, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { TbMathFunction } from "react-icons/tb";


const Spreadsheet = ({
  cells,
  handleCellPropertyChange,
  currCell,
  setCurrcell,
}) => {
  


  const evaluateFormula = (formula) => {
    // Extract cell references from the formula
    if (formula.trim() === "") return "";

    // Replace cell references with their values in the formula
    const replacedFormula = formula.replace(/[A-Za-z]+\d+/g, (match) => {
      const uppercaseMatch = match.toUpperCase(); // Convert lowercase letters to uppercase
      const cell = cells[uppercaseMatch];
      return cell && !isNaN(cell.value) ? cell.value : uppercaseMatch;
    });

    try {
      // Evaluate the replaced formula
      // Note: Using eval here for simplicity, but it's generally not recommended due to security risks.
      return eval(replacedFormula);
    } catch (error) {
      console.error("Error evaluating formula:", error);
      return formula; // Return 0 if there's an error in evaluating the formula
    }
  };

  // Handle cell value change
  const handleCellValueChange = (cellId, value) => {
    // Check if it's a formula
    // console.log(value);
    if (value.startsWith("=")) {
      const formula = value.substring(1);
      const result = evaluateFormula(formula);
      handleCellPropertyChange(cellId, "value", result);
    }
  };

  // Generate columns A-Z
  const columns = [];
  for (let i = 0; i < 26; i++) {
    columns.push(<th key={i}>{String.fromCharCode(65 + i)}</th>);
  }

  // Generate rows
  const rows = [];
  for (let i = 0; i < 100; i++) {
    const cellsInRow = [];
    cellsInRow.push(<td key={`rowNumber${i}`}>{i + 1}</td>); // Row numbering
    for (let j = 0; j < 26; j++) {
      const cellId = `${String.fromCharCode(65 + j)}${i + 1}`;
      cellsInRow.push(
        <td
          key={cellId}
          style={{
            backgroundColor: cells[cellId].cellColor
              ? cells[cellId].cellColor
              : "#FFFFFF",
          }}
        >
          <input
            type="text"
            style={{
              fontWeight: cells[cellId].bold ? "bold" : "normal",
              fontStyle: cells[cellId].italic ? "italic" : "normal",
              fontFamily: cells[cellId].fontFamily,
              fontSize: cells[cellId].fontSize,
              color: cells[cellId].fontColor,
              backgroundColor: cells[cellId].cellColor
                ? cells[cellId].cellColor
                : "#FFFFFF",
              textDecoration: cells[cellId].linethrough
                ? "line-through"
                : "none",
            }}
            value={cells[cellId].value}
            onClick={() => setCurrcell(cellId)}
            onChange={(e) =>
              handleCellPropertyChange(cellId, "value", e.target.value)
            }
            onBlur={(e) => handleCellValueChange(cellId, e.target.value)}
          />
        </td>
      );
    }
    rows.push(<tr key={i}>{cellsInRow}</tr>);
  }

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: "119px",
          width: "100%",
          paddingX: 3,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Box
          sx={{
            width: 100,
          }}
        >
          <Typography>{currCell}</Typography>
        </Box>
        <span
          style={{
            borderRight: "1px solid gray",
            height: "18px",
            marginRight: "5px",
          }}
        ></span>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TbMathFunction />
          <input
            value={cells[currCell].value}
            type="text"
            onChange={(e) =>
              handleCellPropertyChange(currCell, "value", e.target.value)
            }
            onBlur={(e) => handleCellValueChange(currCell, e.target.value)}
            style={{
              border: "none",
              outline: "none",
              marginLeft: "10px",
            }}
          />
        </Box>
      </Box>
      <table className="fixed-row">
        <thead>
          <tr>
            <th></th> {/* Empty cell for row numbering */}
            {columns}
          </tr>
        </thead>
      </table>
      <table className="spreadsheet-table">
        <tbody>{rows}</tbody>
      </table>
    </>
  );
};

export default Spreadsheet;
