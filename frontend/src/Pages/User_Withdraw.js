// frontend/src/Pages/User_Withdraw.js
import * as React from "react";
import axios from "axios";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Stack,
  Button,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";

const MIN = Number(process.env.REACT_APP_WITHDRAW_MIN || 10);

export default function User_Withdraw() {
  const token = React.useMemo(() => sessionStorage.getItem("token"), []);
  const [amount, setAmount] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [source, setSource] = React.useState("commission"); // NEW: default to commission
  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState([]);
  const [me, setMe] = React.useState(null); // NEW: to show eligibility hints

  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  const loadMe = React.useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMe(res.data || null);
    } catch (e) {
      // ignore; backend still validates
    }
  }, [token, API_BASE]);

  const loadMine = React.useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE}/api/users/withdrawals/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setList(res.data.withdrawals || []);
    } catch (e) {
      console.error(e);
    }
  }, [token, API_BASE]);

  React.useEffect(() => {
    loadMe();
    loadMine();
  }, [loadMe, loadMine]);

  // Basic client-side validation (backend still enforces)
  const validate = () => {
    if (!token) return "Not authenticated";
    if (!amount || Number(amount) < MIN) return `Minimum withdrawal is ${MIN} USDT`;
    if (!address) return "Enter your USDT-BEP20 address";
    if (!/^0x[a-fA-F0-9]{40}$/.test(address.trim())) {
      return "Enter a valid BEP20 (BSC) address starting with 0x";
    }
    // Profit eligibility hint (soft check; backend is source of truth)
    if (source === "profit" && me) {
      if ((Number(me.dailyProfit) || 0) < 50) return "Profit withdrawal requires at least $50 daily profit";
      if ((Number(me.level) || 0) < 2) return "Profit withdrawal requires Level 2 or above";
    }
    return null;
  };

  const submit = async () => {
    const err = validate();
    if (err) return alert(err);

    try {
      setLoading(true);
      await axios.post(
        `${API_BASE}/api/users/withdrawals/request`,
        { amount: Number(amount), address: address.trim(), source }, // NEW: send source
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Withdraw request submitted");
      setAmount("");
      setAddress("");
      await loadMine();
      await loadMe();
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  const statusChipColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return "warning";
      case "approved":
        return "info";
      case "paid":
        return "success";
      case "rejected":
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const txLink = (row) => {
    if (!row?.txId) return null;
    const chain = (row.chain || "").toUpperCase();
    if (chain.includes("BEP")) return `https://bscscan.com/tx/${row.txId}`;
    if (chain.includes("TRC")) return `https://tronscan.org/#/transaction/${row.txId}`;
    if (chain.includes("ERC")) return `https://etherscan.io/tx/${row.txId}`;
    return null;
  };

  const profitEligible =
    me && Number(me.dailyProfit || 0) >= 50 && Number(me.level || 0) >= 2;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: 400, color: "white", textAlign: "center" }}
      >
        Withdraw USDT (BEP-20)
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "white", mb: 3, textAlign: "center" }}
      >
        Minimum withdrawal: <b>{MIN} USDT</b> (BNB Smart Chain)
      </Typography>

      {/* Eligibility heads-up */}
      <Box sx={{ mb: 2, }}>
        <Alert severity="info" variant="outlined" sx={{color: "white",}}>
          <b>Commission</b> can be withdrawn anytime.{" "}
          <b>Profit</b> withdrawals require <b>Level 2+</b> and{" "}
          <b>$50 daily profit</b>.
        </Alert>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Request Withdrawal
        </Typography>

        <Stack spacing={2}>
          {/* NEW: Source selector */}
          <FormControl fullWidth>
            <InputLabel id="wd-src-label">Withdraw From</InputLabel>
            <Select
              labelId="wd-src-label"
              label="Withdraw From"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              <MenuItem value="commission">Commission</MenuItem>
              <MenuItem value="profit">Profit</MenuItem>
            </Select>
          </FormControl>

          {/* Optional tiny hint when Profit selected */}
          {source === "profit" && (
            <Chip
              variant="outlined"
              color={profitEligible ? "success" : "warning"}
              label={
                profitEligible
                  ? "You meet the Profit withdrawal requirements."
                  : "Requires Level 2 and $50 daily profit."
              }
            />
          )}

          <TextField
            label="Amount (USDT)"
            type="number"
            inputProps={{ min: MIN, step: 1 }}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
          />

          <TextField
            label="Your USDT (BEP-20) Address"
            placeholder="0x0000... (BSC)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={submit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} /> : null}
            >
              {loading ? "Submitting…" : "Request Withdraw"}
            </Button>
          </Stack>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Your request will be reviewed by admin. After approval, funds are sent to your address.
        </Typography>
      </Paper>

      <Paper elevation={1} sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Your Requests
        </Typography>
        {list.length === 0 ? (
          <Box sx={{ p: 2, color: "text.secondary" }}>No requests yet.</Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>From</TableCell>{/* NEW: source */}
                <TableCell>Chain</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Tx</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <b>
                      {row.amount} {row.currency || "USDT"}
                    </b>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={(row.source || "profit").toUpperCase()}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{row.chain || "BEP20"}</TableCell>
                  <TableCell sx={{ maxWidth: 220, wordBreak: "break-all" }}>
                    {row.address}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      color={statusChipColor(row.status)}
                      label={(row.status || "").toUpperCase()}
                    />
                  </TableCell>
                  <TableCell>
                    {row.txId ? (
                      txLink(row) ? (
                        <Button
                          href={txLink(row)}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                        >
                          View
                        </Button>
                      ) : (
                        row.txId
                      )
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Container>
  );
}
