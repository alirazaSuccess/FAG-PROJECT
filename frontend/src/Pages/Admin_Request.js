// frontend/src/Pages/Admin_Request.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Box,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Checkbox,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Tooltip,
  Divider,
  LinearProgress,
  TableContainer,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import BlockIcon from "@mui/icons-material/Block";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export default function Admin_Request() {
  const navigate = useNavigate();

  // Read either token key
  const token = useMemo(
    () =>
      sessionStorage.getItem("adminToken") || sessionStorage.getItem("token"),
    []
  );

  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

  useEffect(() => {
    if (!token) {
      alert("Please log in as Admin first.");
      navigate("/admin-login", { replace: true });
    }
  }, [token, navigate]);

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowBusy, setRowBusy] = useState(null); // id while approving/rejecting a single row
  const [search, setSearch] = useState("");

  // selection
  const [selected, setSelected] = useState(() => new Set());

  const authHeader = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  const handleAuthError = useCallback(
    (e) => {
      if (e?.response?.status === 401) {
        alert("Your admin session expired. Please log in again.");
        navigate("/admin-login", { replace: true });
      } else if (e?.response?.status === 403) {
        alert("Forbidden. You must be logged in as an admin.");
        navigate("/admin-login", { replace: true });
      } else {
        alert(e?.response?.data?.message || "Request failed");
      }
    },
    [navigate]
  );

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/api/admin/withdrawals?status=pending`,
        { headers: authHeader }
      );
      setList(res.data.withdrawals || []);
      setSelected(new Set()); // clear selection on refresh
    } catch (e) {
      handleAuthError(e);
    } finally {
      setLoading(false);
    }
  }, [token, authHeader, handleAuthError]);

  useEffect(() => {
    load();
  }, [load]);

  // Filtering (client side by email/address)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((w) => {
      const email = (w.user?.email || "").toLowerCase();
      const addr = (w.address || "").toLowerCase();
      const username = (w.user?.username || "").toLowerCase();
      return email.includes(q) || addr.includes(q) || username.includes(q);
    });
  }, [list, search]);

  // Totals
  const totalPending = useMemo(
    () => filtered.reduce((sum, w) => sum + Number(w.amount || 0), 0),
    [filtered]
  );
  const totalSelected = useMemo(
    () =>
      filtered
        .filter((w) => selected.has(w._id))
        .reduce((sum, w) => sum + Number(w.amount || 0), 0),
    [filtered, selected]
  );

  // Selection helpers
  const toggleOne = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allOnPageSelected =
    filtered.length > 0 && filtered.every((w) => selected.has(w._id));
  const toggleAll = () => {
    setSelected((prev) => {
      if (allOnPageSelected) return new Set(); // unselect all
      const next = new Set(prev);
      filtered.forEach((w) => next.add(w._id));
      return next;
    });
  };

  // Row actions
  const approveOne = async (id) => {
    if (!window.confirm("Approve & send via Binance now?")) return;
    try {
      setRowBusy(id);
      await axios.post(
        `${API_BASE}/api/admin/withdrawals/${id}/approve`,
        {},
        { headers: authHeader }
      );
      await load();
    } catch (e) {
      handleAuthError(e);
    } finally {
      setRowBusy(null);
    }
  };

  const rejectOne = async (id) => {
    const reason = prompt("Reason for rejection?");
    if (reason === null) return; // cancelled
    try {
      setRowBusy(id);
      await axios.post(
        `${API_BASE}/api/admin/withdrawals/${id}/reject`,
        { reason },
        { headers: authHeader }
      );
      await load();
    } catch (e) {
      handleAuthError(e);
    } finally {
      setRowBusy(null);
    }
  };

  // Bulk actions
  const bulkApprove = async () => {
    const ids = [...selected];
    if (ids.length === 0) return;
    if (
      !window.confirm(
        `Approve & send via Binance for ${ids.length} request(s)? Total: ${totalSelected} USDT`
      )
    )
      return;

    try {
      setLoading(true);
      await Promise.allSettled(
        ids.map((id) =>
          axios.post(
            `${API_BASE}/api/admin/withdrawals/${id}/approve`,
            {},
            { headers: authHeader }
          )
        )
      );
      await load();
    } catch (e) {
      handleAuthError(e);
    } finally {
      setLoading(false);
    }
  };

  const bulkReject = async () => {
    const ids = [...selected];
    if (ids.length === 0) return;
    const reason = prompt(
      `Reason for rejecting ${ids.length} request(s)? (one reason for all)`
    );
    if (reason === null) return;

    try {
      setLoading(true);
      await Promise.allSettled(
        ids.map((id) =>
          axios.post(
            `${API_BASE}/api/admin/withdrawals/${id}/reject`,
            { reason },
            { headers: authHeader }
          )
        )
      );
      await load();
    } catch (e) {
      handleAuthError(e);
    } finally {
      setLoading(false);
    }
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text || "");
  };

  // ---------- Responsive switch ----------
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md")); // md and up = table, below md = cards

  // Card for mobile/tablet
  const MobileCard = ({ w }) => {
    const busy = rowBusy === w._id;
    const checked = selected.has(w._id);
    return (
      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          mb: 1.5,
          borderRadius: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Checkbox
            size="small"
            checked={checked}
            onChange={() => toggleOne(w._id)}
          />
          <Stack spacing={0.2} flex={1}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {w.user?.email || "—"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {w.user?.username || "user"}
            </Typography>
          </Stack>
          <Chip
            size="small"
            color="success"
            label={`${w.amount} ${w.currency || "USDT"}`}
          />
        </Stack>

        <Divider sx={{ my: 1 }} />

        <Stack spacing={0.75}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 72 }}>
              Chain:
            </Typography>
            <Chip size="small" variant="outlined" label={w.chain || "TRC20"} />
          </Stack>

          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              Address
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography
                variant="body2"
                sx={{ wordBreak: "break-all", flex: 1 }}
              >
                {w.address}
              </Typography>
              <Tooltip title="Copy">
                <IconButton size="small" onClick={() => copy(w.address)}>
                  <ContentCopyIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 72 }}>
              Requested:
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(w.createdAt).toLocaleString()}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 1.25 }}>
          <Button
            fullWidth
            size="small"
            variant="contained"
            startIcon={<CheckCircleIcon />}
            disabled={busy || loading}
            onClick={() => approveOne(w._id)}
          >
            Approve
          </Button>
          <Button
            fullWidth
            size="small"
            color="error"
            variant="outlined"
            startIcon={<CancelIcon />}
            disabled={busy || loading}
            onClick={() => rejectOne(w._id)}
          >
            Reject
          </Button>
        </Stack>
      </Paper>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header bar */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
        spacing={1.25}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: "white", textTransform: "uppercase", }}>
          Pending Withdrawals
        </Typography>

        <Stack direction="row" spacing={1} sx={{ width: { xs: "100%", sm: "auto" } }}>
          <TextField
            size="small"
            placeholder="Search by email, username or address"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{color: "white",}} >
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: { xs: "100%", sm: 280 },

              // input text color
              "& .MuiInputBase-input": {
                color: "#fff",
              },

              // placeholder color
              "& .MuiInputBase-input::placeholder": {
                color: "#fff",
                opacity: 1,
                fontSize: "10px",
              },

              // outlined border color
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#fff",
                },
                "&:hover fieldset": {
                  borderColor: "#fff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#fff",
                },
              },
            }}
          />
          <Tooltip title="Refresh">
            <IconButton onClick={load}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Summary + bulk actions */}
      <Paper elevation={2} sx={{ overflow: "hidden" }}>
        {loading && <LinearProgress sx={{
          "& .css-1umw9bq-MuiSvgIcon-root":{
            color:"#fff"
          }
        }} />}

        <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            sx={{ mb: 1.5 }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Typography variant="body2">
                Showing <b>{filtered.length}</b> of <b>{list.length}</b> pending request(s)
              </Typography>
              <Chip label={`Total Pending: ${totalPending} USDT`} color="info" />
              <Chip
                label={`Selected: ${selected.size} • ${totalSelected} USDT`}
                color="primary"
                variant={selected.size ? "filled" : "outlined"}
              />
            </Stack>

            <Stack direction="row" spacing={1} sx={{ width: { xs: "100%", md: "auto" } }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<DoneAllIcon />}
                disabled={selected.size === 0 || loading}
                onClick={bulkApprove}
              >
                Approve Selected
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<BlockIcon />}
                disabled={selected.size === 0 || loading}
                onClick={bulkReject}
              >
                Reject Selected
              </Button>
            </Stack>
          </Stack>

          <Divider sx={{ mb: 1.5 }} />

          {/* Responsive content */}
          {filtered.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
              No pending requests{list.length ? " (try clearing search)" : ""}.
            </Box>
          ) : isDesktop ? (
            // ---------- Desktop Table ----------
            <TableContainer sx={{ maxHeight: "70vh" }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={allOnPageSelected}
                        indeterminate={selected.size > 0 && !allOnPageSelected}
                        onChange={toggleAll}
                      />
                    </TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Chain</TableCell>
                    <TableCell sx={{ width: "40%" }}>Address</TableCell>
                    <TableCell>Requested</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filtered.map((w) => {
                    const checked = selected.has(w._id);
                    const busy = rowBusy === w._id;
                    return (
                      <TableRow key={w._id} hover selected={checked}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={checked}
                            onChange={() => toggleOne(w._id)}
                          />
                        </TableCell>

                        <TableCell>
                          <Stack spacing={0.3}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              {w.user?.email || "—"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {w.user?.username || "user"}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Chip
                            size="small"
                            color="success"
                            label={`${w.amount} ${w.currency || "USDT"}`}
                          />
                        </TableCell>

                        <TableCell>
                          <Chip
                            size="small"
                            variant="outlined"
                            label={w.chain || "TRC20"}
                          />
                        </TableCell>

                        <TableCell sx={{ maxWidth: 450 }}>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Typography
                              variant="body2"
                              sx={{ wordBreak: "break-all" }}
                            >
                              {w.address}
                            </Typography>
                            <Tooltip title="Copy">
                              <IconButton
                                size="small"
                                onClick={() => copy(w.address)}
                              >
                                <ContentCopyIcon fontSize="inherit" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(w.createdAt).toLocaleString()}
                          </Typography>
                        </TableCell>

                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<CheckCircleIcon />}
                              disabled={busy || loading}
                              onClick={() => approveOne(w._id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              startIcon={<CancelIcon />}
                              disabled={busy || loading}
                              onClick={() => rejectOne(w._id)}
                            >
                              Reject
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            // ---------- Mobile/Tablet Cards ----------
            <Box>
              {/* Select all on mobile */}
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Checkbox
                  checked={allOnPageSelected}
                  indeterminate={selected.size > 0 && !allOnPageSelected}
                  onChange={toggleAll}
                />
                <Typography variant="body2">Select all on page</Typography>
              </Stack>

              {filtered.map((w) => (
                <MobileCard key={w._id} w={w} />
              ))}
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}