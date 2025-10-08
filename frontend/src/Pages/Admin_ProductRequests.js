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
  ButtonGroup,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import BlockIcon from "@mui/icons-material/Block";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export default function Admin_ProductRequests() {
  const navigate = useNavigate();

  const token = useMemo(
    () => sessionStorage.getItem("adminToken") || sessionStorage.getItem("token"),
    []
  );
  const authHeader = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
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
  const [rowBusy, setRowBusy] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all"); // all | pending | approved | rejected
  const [selected, setSelected] = useState(() => new Set());

  const handleAuthError = useCallback(
    (e) => {
      if (e?.response?.status === 401) {
        alert("Your admin session expired. Please log in again.");
        navigate("/admin-login", { replace: true });
      } else if (e?.response?.status === 403) {
        alert("Forbidden. You must be logged in as an admin.");
        navigate("/admin-login", { replace: true });
      } else {
        const m = e?.response?.data?.message || e?.message || "Request failed";
        alert(m);
      }
    },
    [navigate]
  );

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const qs = status === "all" ? "" : `?status=${encodeURIComponent(status)}`;
      const res = await axios.get(`${API_BASE}/api/admin/claims${qs}`, {
        headers: authHeader,
      });
      setList(res.data.claims || []);
      setSelected(new Set());
    } catch (e) {
      handleAuthError(e);
    } finally {
      setLoading(false);
    }
  }, [token, status, API_BASE, authHeader, handleAuthError]);

  useEffect(() => {
    load();
  }, [load]);

  // search filter
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((c) => {
      const email = (c.email || c.user?.email || "").toLowerCase();
      const name = (c.name || c.user?.username || "").toLowerCase();
      const phone = (c.phone || "").toLowerCase();
      const addr = (c.address || "").toLowerCase();
      const prod = (c.productName || "").toLowerCase();
      return (
        email.includes(q) ||
        name.includes(q) ||
        phone.includes(q) ||
        addr.includes(q) ||
        prod.includes(q)
      );
    });
  }, [list, search]);

  // selection helpers
  const toggleOne = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const allOnPageSelected =
    filtered.length > 0 && filtered.every((c) => selected.has(c._id));
  const toggleAll = () => {
    setSelected((prev) => {
      if (allOnPageSelected) return new Set();
      const next = new Set(prev);
      filtered.forEach((c) => next.add(c._id));
      return next;
    });
  };

  // actions
  const approveOne = async (id) => {
    if (!window.confirm("Approve this claim?")) return;
    try {
      setRowBusy(id);
      await axios.post(`${API_BASE}/api/admin/claims/${id}/approve`, {}, { headers: authHeader });
      await load();
    } catch (e) {
      handleAuthError(e);
    } finally {
      setRowBusy(null);
    }
  };

  const rejectOne = async (id) => {
    const reason = prompt("Reason for rejection?");
    if (reason === null) return;
    try {
      setRowBusy(id);
      await axios.post(
        `${API_BASE}/api/admin/claims/${id}/reject`,
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

  // bulk actions (only makes sense for pending)
  const ids = [...selected];
  const bulkApprove = async () => {
    if (ids.length === 0) return;
    if (!window.confirm(`Approve ${ids.length} claim(s)?`)) return;
    try {
      setLoading(true);
      await Promise.allSettled(
        ids.map((id) =>
          axios.post(`${API_BASE}/api/admin/claims/${id}/approve`, {}, { headers: authHeader })
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
    if (ids.length === 0) return;
    const reason = prompt(`Reason for rejecting ${ids.length} claim(s)? (one reason for all)`);
    if (reason === null) return;
    try {
      setLoading(true);
      await Promise.allSettled(
        ids.map((id) =>
          axios.post(`${API_BASE}/api/admin/claims/${id}/reject`, { reason }, { headers: authHeader })
        )
      );
      await load();
    } catch (e) {
      handleAuthError(e);
    } finally {
      setLoading(false);
    }
  };

  const copy = (text) => navigator.clipboard.writeText(text || "");

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const StatusChip = ({ s }) => {
    const key = (s || "").toLowerCase();
    const color =
      key === "pending" ? "warning" : key === "approved" ? "success" : key === "rejected" ? "error" : "default";
    return <Chip size="small" color={color} label={(s || "").toUpperCase()} />;
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
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "white", textTransform: "uppercase" }}
        >
          Product Claims
        </Typography>

        <Stack direction="row" spacing={1} sx={{ width: { xs: "100%", sm: "auto" } }}>
          <TextField
            size="small"
            placeholder="Search by name, email, phone, address"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ color: "white" }}>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: { xs: "100%", sm: 320 },
              "& .MuiInputBase-input": { color: "#fff" },
              "& .MuiInputBase-input::placeholder": { color: "#fff", opacity: 1, fontSize: "10px" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#fff" },
                "&:hover fieldset": { borderColor: "#fff" },
                "&.Mui-focused fieldset": { borderColor: "#fff" },
              },
            }}
          />
          <Tooltip title="Refresh">
            <IconButton onClick={load}>
              <RefreshIcon style={{color: "white",}} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Filters + bulk actions */}
      <Paper elevation={2} sx={{ overflow: "hidden" }}>
        {loading && <LinearProgress />}

        <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            sx={{ mb: 1.5 }}
          >
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }}>
              <Typography variant="body2">
                Showing <b>{filtered.length}</b> of <b>{list.length}</b> request(s)
              </Typography>

              {/* Status filter */}
              <ButtonGroup size="small" variant="outlined">
                {["all", "pending", "approved", "rejected"].map((s) => (
                  <Button
                    key={s}
                    variant={status === s ? "contained" : "outlined"}
                    onClick={() => setStatus(s)}
                  >
                    {s.toUpperCase()}
                  </Button>
                ))}
              </ButtonGroup>

              <Chip
                label={`Selected: ${selected.size}`}
                color={selected.size ? "primary" : "default"}
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

          {filtered.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
              No requests{list.length ? " (try clearing search / change status filter)" : ""}.
            </Box>
          ) : (
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
                    <TableCell>Product</TableCell>
                    <TableCell>Name / Email / Phone</TableCell>
                    <TableCell sx={{ width: "35%" }}>Address</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Requested</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filtered.map((c) => {
                    const checked = selected.has(c._id);
                    const busy = rowBusy === c._id;
                    return (
                      <TableRow key={c._id} hover selected={checked}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={checked} onChange={() => toggleOne(c._id)} />
                        </TableCell>

                        <TableCell>
                          <Stack spacing={0.3}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              {c.user?.email || "—"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {c.user?.username || "user"}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Chip size="small" color="info" label={c.productName || "FAG Perfume Pack"} />
                        </TableCell>

                        <TableCell>
                          <Stack spacing={0.3}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{c.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{c.email}</Typography>
                            <Typography variant="caption" color="text.secondary">{c.phone}</Typography>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={0.5} width={400}>
                            <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                              {c.address}
                            </Typography>
                            <Tooltip title="Copy address">
                              <IconButton size="small" onClick={() => copy(c.address)}>
                                <ContentCopyIcon fontSize="inherit" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <StatusChip s={c.status} />
                        </TableCell>

                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(c.createdAt).toLocaleString()}
                          </Typography>
                        </TableCell>

                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<CheckCircleIcon />}
                              disabled={busy || loading || (c.status !== "pending")}
                              onClick={() => approveOne(c._id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              startIcon={<CancelIcon />}
                              disabled={busy || loading || (c.status !== "pending")}
                              onClick={() => rejectOne(c._id)}
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
          )}
        </Box>
      </Paper>
    </Container>
  );
}
