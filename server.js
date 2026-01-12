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
// Configure CORS explicitly so preflight (OPTIONS) is handled properly
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || `https://${process.env.LICENSE_DOMAIN || 'app.example.com'}`,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
// respond to preflight requests for all routes
app.options('*', cors(corsOptions));

app.use(bodyParser.json());
app.use(express.json());
// License check after CORS so preflight is not blocked by license calls
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
