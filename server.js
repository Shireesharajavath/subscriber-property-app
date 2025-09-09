const express = require("express");
const cors = require("cors");

const subscriberRoutes = require("./routes/subscriberPropertyTypes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/subscriber_property_types", subscriberRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
