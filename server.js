const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const licenseMiddleware = require("./middleware/license");

const unitRoutes = require('./routes/unitRoutes');
const pegawaiRoutes = require('./routes/pegawaiRoutes');
const kompetensiRoutes = require('./routes/kompetensiRoutes');
const logbookRoutes = require('./routes/logbookRoutes');
const logbookDetailRoutes = require('./routes/logbookDetailRoutes');
const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(licenseMiddleware);


// Register routes
app.use('/api/unit', unitRoutes);
app.use('/api/pegawai', pegawaiRoutes);
app.use('/api/kompetensi', kompetensiRoutes);
app.use('/api/logbook', logbookRoutes);
app.use('/api/logbook-detail', logbookDetailRoutes);
app.use("/api/user", userRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);


require('dotenv').config();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
