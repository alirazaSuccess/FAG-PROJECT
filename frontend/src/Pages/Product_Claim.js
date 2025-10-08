// frontend/src/Pages/Product_Claim.js
import * as React from "react";
import {
  Container, Paper, Box, Typography, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Stack, Snackbar, Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Product_Claim() {
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";
  const token = React.useMemo(() => sessionStorage.getItem("token"), []);
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", address: "" });
  const [busy, setBusy] = React.useState(false);
  const [toast, setToast] = React.useState({ open: false, msg: "", sev: "success" });

  // NEW: eligibility + claim status
  const [eligible, setEligible] = React.useState(false);
  const [claimStatus, setClaimStatus] = React.useState("none"); // none|pending|approved|rejected

  const onChange = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const load = React.useCallback(async () => {
    if (!token) return;
    try {
      const [me, mine] = await Promise.all([
        axios.get(`${API_BASE}/api/users/me`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE}/api/users/claims/mine`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const bal = Number(me.data?.balance || 0);
      setEligible(bal >= 50);

      const claims = mine.data?.claims || [];
      if (claims.length) {
        // latest by createdAt
        claims.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setClaimStatus((claims[0].status || "none").toLowerCase());
      } else {
        setClaimStatus("none");
      }
    } catch (e) {
      // ignore -> show default
    }
  }, [API_BASE, token]);

  React.useEffect(() => { load(); }, [load]);

  const disabled =
    !eligible || claimStatus === "pending" || claimStatus === "approved";

  const label =
    claimStatus === "pending" ? "PENDING" :
    claimStatus === "approved" ? "APPROVED" :
    eligible ? "Claim" : "CLAIM (min $50)";

  const submit = async () => {
    if (!form.name || !form.email || !form.phone || !form.address) {
      return setToast({ open: true, msg: "All fields are required", sev: "error" });
    }
    try {
      setBusy(true);
      await axios.post(
        `${API_BASE}/api/users/claims`,
        { ...form, productName: "FAG Perfume Pack" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // success → go back to dashboard where button will show Pending
      setToast({ open: true, msg: "Claim submitted. Redirecting…", sev: "success" });
      setTimeout(() => navigate("/user-dashboard/dashboard", { replace: true }), 600);
    } catch (e) {
      setToast({ open: true, msg: e?.response?.data?.message || "Failed to submit claim", sev: "error" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 700 }}>
          Product
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              FAG Perfume Pack
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
              Premium perfume pack exclusively for eligible users.
            </Typography>
            <Button
              variant="contained"
              disabled={disabled}
              onClick={() => setOpen(true)}
            >
              {label}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Modal form */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Claim Product</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Full Name" value={form.name} onChange={onChange("name")} fullWidth />
            <TextField label="Email" type="email" value={form.email} onChange={onChange("email")} fullWidth />
            <TextField label="Phone Number" value={form.phone} onChange={onChange("phone")} fullWidth />
            <TextField label="Address" value={form.address} onChange={onChange("address")} multiline minRows={3} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={busy}>Cancel</Button>
          <Button variant="contained" onClick={submit} disabled={busy}>
            {busy ? "Submitting…" : "Submit Claim"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={toast.open} autoHideDuration={2500} onClose={() => setToast({ ...toast, open: false })}>
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.sev} sx={{ width: '100%' }}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
