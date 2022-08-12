import "./App.css";
import Card from "./Modules/Card/Card";
import About from "./Modules/About/";
import Bridge from "./Modules/Bridge";
import Swap from "./Modules/Swap";
import Pool from "./Modules/Pool";
import Transaction from "./Modules/Bridge/Transaction";
import Market from "./Modules/Market";
import History from "./Modules/History";
import PoolDetail from "./Modules/PoolDetail";
import AddLiquidity from "./Modules/AddLiquidity";
import BridgeConfirm from "./Modules/Bridge/BridgeConfirm";
import { SolanaWalletProvider } from "./contexts/SolanaWalletContext.tsx";
import { EthereumProviderProvider } from "./contexts/EthereumProviderContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Switch,
} from "react-router-dom";
import HistoryDetails from "./Modules/HistoryDetails";
import ErrorBoundary from "./ErrorBoundary";
import { theme } from "./muiTheme";
import { store } from "./store";
import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import { Provider } from "react-redux";

function App() {
  return (
    <div className="App">
      
  <ErrorBoundary>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
      <SolanaWalletProvider>
        <EthereumProviderProvider>
          <Router>
            {/* <Tile__homepage /> */}
            {/* <Switch> */}
            <Routes>
              <Route path="/" element={<About />} />
              <Route path="/card" element={<Card />} />
              <Route path="/about" element={<About />} />
              <Route path="/bridge" element={<BridgeConfirm />} />
              <Route path="/swap" element={<Swap />} />
              <Route path="/pool" element={<Pool />} />
              <Route path="/market" element={<Market />} />
              <Route path="/transaction" element={<Transaction />} />
              <Route path="/about" element={<About />} />
              <Route path="/history" element={<History />} />
              <Route path="/pool-detail" element={<PoolDetail />} />
              <Route path="/add-liquidity" element={<AddLiquidity />} />
              <Route
                path="/bridge-confirm-transaction"
                element={<BridgeConfirm />}
              />
              <Route path="/HistoryDetails" element={<HistoryDetails />} />
            </Routes>
          </Router>
        </EthereumProviderProvider>
      </SolanaWalletProvider>
      </ErrorBoundary></ThemeProvider></Provider></ErrorBoundary>
    </div>
  );
}

export default App;
