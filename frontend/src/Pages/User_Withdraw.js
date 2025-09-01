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
} from "@mui/material";
const MIN = Number(process.env.REACT_APP_WITHDRAW_MIN || 10);

export default function User_Withdraw() {
  const token = React.useMemo(() => sessionStorage.getItem("token"), []);
  const [amount, setAmount] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState([]);

  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

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
  }, [token]);

  React.useEffect(() => {
    loadMine();
  }, [loadMine]);

  const validate = () => {
    if (!token) return "Not authenticated";
    if (!amount || Number(amount) < MIN) return `Minimum withdrawal is ${MIN} USDT`;
    if (!address) return "Enter your USDT-TRC20 address";
    if (!/^T[a-zA-Z0-9]{25,35}$/.test(address.trim())) {
      return "Enter a valid TRON (TRC20) address starting with T";
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
        { amount: Number(amount), address: address.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Withdraw request submitted");
      setAmount("");
      setAddress("");
      await loadMine();
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
    if (
      (row.chain || "").toUpperCase().includes("TRON") ||
      (row.chain || "").toUpperCase().includes("TRC")
    ) {
      return `https://tronscan.org/#/transaction/${row.txId}`;
    }
    return null;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 400,color: "white",textAlign: "center", }}>
        Withdraw USDT (TRC20)
      </Typography>
      <Typography variant="body2" sx={{ color: "white", mb: 3,textAlign: "center", }}>
        Minimum withdrawal: <b>{MIN} USDT</b>
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Request Withdrawal
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Amount (USDT)"
            type="number"
            inputProps={{ min: MIN, step: 1 }}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
          />

          <TextField
            label="Your USDT (TRC20) Address"
            placeholder="Txxxxxxxxxxxxxxxxxxxxxxxxxxxx"
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
                  <TableCell>{row.chain || "TRC20"}</TableCell>
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