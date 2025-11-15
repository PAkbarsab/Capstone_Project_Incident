import {
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Box,
  Divider,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import axios from "axios";

export default function Home() {
  const { isLogged } = useContext(AuthContext);
  const [incidents, setIncidents] = useState([]);

  const [formData, setFormData] = useState({
    impact: "",
    urgency: "",
    short_description: "",
  });

  const [editing, setEditing] = useState(null);

  
  const [search, setSearch] = useState("");

  const impactOptions = ["1 - High", "2 - Medium", "3 - Low"];
  const urgencyOptions = ["1 - High", "2 - Medium", "3 - Low"];

  useEffect(() => {
    async function fetchData() {
      if (isLogged) {
        try {
          const incidentList = await axios.get(
            "http://localhost:3001/api/incidents",
            { withCredentials: true }
          );
          setIncidents(incidentList.data.result || []);
        } catch (err) {
          console.error("Failed to fetch incidents:", err);
        }
      }
    }
    fetchData();
  }, [isLogged]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(
          `http://localhost:3001/api/incidents/${editing}`,
          {
            impact: parseInt(formData.impact),
            urgency: parseInt(formData.urgency),
            short_description: formData.short_description,
          },
          { withCredentials: true }
        );
        alert("Incident updated successfully!");
      } else {
        await axios.post(
          "http://localhost:3001/api/incidents",
          {
            impact: parseInt(formData.impact),
            urgency: parseInt(formData.urgency),
            short_description: formData.short_description,
          },
          { withCredentials: true }
        );
        alert("Incident inserted successfully!");
      }

      const res = await axios.get("http://localhost:3001/api/incidents", {
        withCredentials: true,
      });
      setIncidents(res.data.result || []);

      setFormData({ impact: "", urgency: "", short_description: "" });
      setEditing(null);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save incident.");
    }
  };

  const handleDelete = async (sys_id) => {
    try {
      await axios.delete(`http://localhost:3001/api/incidents/${sys_id}`, {
        withCredentials: true,
      });

      setIncidents((prev) => prev.filter((i) => i.sys_id !== sys_id));
      setEditing(null);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete incident.");
    }
  };

  const handleEdit = (inc) => {
    setFormData({
      impact: inc.impact || "",
      urgency: inc.urgency || "",
      short_description: inc.short_description || "",
    });
    setEditing(inc.sys_id);
  };

  return (
    <>
      {isLogged && incidents ? (
        <Stack spacing={4}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Incident Dashboard
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: 3,
              background: "background.paper",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
              {editing ? "Edit Incident" : "Create New Incident"}
            </Typography>

            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Impact"
                value={formData.impact}
                onChange={(e) =>
                  setFormData({ ...formData, impact: e.target.value })
                }
                required
                size="small"
                sx={{ width: 150 }}
                SelectProps={{ native: true }}
              >
                <option value=""></option>
                {impactOptions.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </TextField>

              <TextField
                select
                label="Urgency"
                value={formData.urgency}
                onChange={(e) =>
                  setFormData({ ...formData, urgency: e.target.value })
                }
                required
                size="small"
                sx={{ width: 150 }}
                SelectProps={{ native: true }}
              >
                <option value=""></option>
                {urgencyOptions.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </TextField>

      
              <TextField
                label="Short Description"
                value={formData.short_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    short_description: e.target.value,
                  })
                }
                required
                size="small"
                sx={{ width: 350 }}
              />

              <Button
                type="submit"
                variant="contained"
                sx={{ px: 4, borderRadius: 2 }}
              >
                {editing ? "Update" : "Create"}
              </Button>
            </Stack>
          </Box>

          <Divider />

          <TextField
            label="Search Incidents"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 300 }}
          />
      
          <Grid container spacing={4}>
            {incidents
              .filter(
                (inc) =>
                  inc.short_description
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                  inc.number?.toLowerCase().includes(search.toLowerCase())
              )
              .map((inc) => (
                <Grid key={inc.sys_id} item>
                  <Card
                    sx={{
                      width: 330,
                      borderRadius: 3,
                      boxShadow: 4,
                      p: 1,
                      transition: "0.3s",
                      ":hover": { boxShadow: 8, transform: "scale(1.02)" },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        #{inc.number}
                      </Typography>

                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Description:</strong> {inc.short_description}
                      </Typography>

                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Priority:</strong> {inc.priority}
                      </Typography>

                      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleEdit(inc)}
                          sx={{ borderRadius: 2 }}
                        >
                          Edit
                        </Button>

                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(inc.sys_id)}
                          sx={{ borderRadius: 2 }}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Stack>
      ) : (
        <Typography>Please log in</Typography>
      )}
    </>
  );
}
