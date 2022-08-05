import React from "react";
import { Box } from "@mui/material";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";


import "./Market.css";


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
const row = [
  {
    "id": 1,
    "Pool": "/images/Tether.png",
    "PoolTo": "/images/XDC.svg",
    "Composition": "SOL-USDC",
    "CompositionTo": "",
    "PoolValue": "$442,298",
    "Volume": "$89,745",
    "TokensTo": "42,120",
    "APR": "0.5%",

  },
  {
    "id": 2,
    "Pool": "/images/Tether.png",
    "PoolTo": "/images/XDC.svg",
    "Composition": "SOL-USDC",
    "CompositionTo": "",
    "PoolValue": "$442,298",
    "Volume": "$89,745",
    "TokensTo": "42,120",
    "APR": "0.5%",
  },
  {
    "id": 3,
    "Pool": "/images/Tether.png",
    "PoolTo": "/images/XDC.svg",
    "Composition": "SOL-USDC",
    "CompositionTo": "",
    "PoolValue": "$442,298",
    "Volume": "$89,745",
    "TokensTo": "42,120",
    "APR": "0.5%",
  }
]


const rows = [
  {
    "id": 1,
    "Img": "/images/XDC.svg",
    "Name": "SOL-USDC",
    "Price": "$89,745",
    "PriceChange": "",
    "Volume": "$89,745",
    "TVL": "42,120",

  },
  {
    "id": 2,
    "Img": "/images/XDC.svg",
    "Name": "SOL-USDC",
    "Price": "$89,745",
    "PriceChange": "",
    "Volume": "$89,745",
    "TVL": "42,120",
  },
  {
    "id": 3,
    "Img": "/images/XDC.svg",
    "Name": "SOL-USDC",
    "Price": "$89,745",
    "PriceChange": "",
    "Volume": "$89,745",
    "TVL": "42,120",
  }
]

function MarketCard() {
  const classes = useStyles();
  return (
    <Box className="pool-box">
      <p className="header-market mb-4">Market</p>
      <br />
      <br />
      <div className="top-token">
        <p>Top Tokens</p>
      </div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Price Change</TableCell>
              <TableCell>Volume&nbsp;(24H)</TableCell>
              <TableCell>TVL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell><img src={row.Img} />&nbsp;{row.Name}</TableCell>
                <TableCell>{row.Price}</TableCell>
                <TableCell>{row.PriceChange}</TableCell>
                <TableCell>{row.Volume}</TableCell>
                <TableCell>{row.TVL}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <br />
      <div className="top-token">
        <p>Top Pairs</p>
      </div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">#</TableCell>
              <TableCell>Pool</TableCell>
              <TableCell>Composition</TableCell>
              <TableCell>Pool Value</TableCell>
              <TableCell>Volume&nbsp;(24h)</TableCell>
              <TableCell>Volume&nbsp;(7D)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {row.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell><img src={row.Pool} /><img src={row.PoolTo} /></TableCell>
                <TableCell>{row.Composition}&nbsp;{row.CompositionTo}</TableCell>
                <TableCell>{row.PoolValue}</TableCell>
                <TableCell>{row.Volume}</TableCell>
                <TableCell>{row.APR}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </Box>
  );
}

export default MarketCard;
