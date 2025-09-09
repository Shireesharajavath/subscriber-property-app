const express = require("express");
const router = express.Router();
const {
  getSubscriberPropertyTypes,
  updateSubscriberPropertyTypes
} = require("../rpc_implementation");


router.get("/", async (req, res) => {
  try {
    const {
      accountId,
      apiKey,
      keyword = "",
      page = 1, 
      per_page = 10,
      sort_by,
      order,
      format_as_single_object = "false",
    } = req.query;

    const pageNumber = Number(page);
    const pageSize = Number(per_page);

    const offset = (pageNumber - 1) * pageSize;

    const result = await getSubscriberPropertyTypes(accountId, apiKey, {
      keyword,
      limit: pageSize,
      offset,
      sort_by,
      order,
      format_as_single_object,
    });

    let response = {
      subscriber_property_types: result.subscriber_property_types,
      total: result.total || result.subscriber_property_types.length,
      page: pageNumber,
      per_page: pageSize,
    };

    if (format_as_single_object === "true") {
      response = {
        subscriber_property_types: result.subscriber_property_types[0] || null,
      };
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in /subscriber_property_types:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch subscriber property types" });
  }
});




router.put("/properties/batch", async (req, res) => {
  try {
    const { accountId, apiKey } = req.query;
    const updates = req.body.updates;

    if (!accountId || !apiKey) {
      return res.status(400).json({ error: "Missing accountId or apiKey" });
    }

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: "Updates must be a non-empty array" });
    }

    const promises = updates.map((u) => {
      const {
        propertyId,
        propertyName,
        propertyType,
        propertyDescription,
        propertyDisplayName
      } = u;

      if (!propertyId || !propertyName || !propertyType) {
        return Promise.resolve({
          status: "failed",
          error: "Missing propertyId/propertyName/propertyType",
          input: u
        });
      }

      return updateSubscriberPropertyTypes({
        accountId,
        apiKey,
        propertyId,
        propertyName,
        propertyType,
        propertyDescription,
        propertyDisplayName
      }).then(data => ({ status: "ok", data }))
        .catch(err => ({ status: "failed", error: err.message, details: err.remote || null }));
    });

    const results = await Promise.all(promises);
    res.status(200).json({ message: "Batch update finished", results });

  } catch (error) {
    console.error("Batch PUT error:", error);
    res.status(500).json({ error: "Failed to perform batch update", detail: error.message });
  }
});


module.exports = router;
