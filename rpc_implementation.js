const axios = require("axios");
require('dotenv').config();


async function getApiKeyForAccount(accountId) {
  try {
    const response = await axios.get(
      "https://phoenix.api.zetaglobal.net/v1/site_configs",
      {
        params: { account_id: accountId },
        headers: { Accept: "application/json" },
        auth: { username: "api", password: process.env.ADMIN_API_KEY }
      }
    );
    return response.data;
  } catch (error) {
    console.log("pocess env", process.env.ADMIN_API_KEY);
    console.error("Error fetching API key:", error.response?.data || error.message);
    throw new Error("Failed to fetch API key");
  }
}


async function getSubscriberPropertyTypes(
  accountId,
  apiKey,
  {
    keyword = "",
    page = 1,
    per_page = 10,
    sort_by = "created_at",
    order = "desc",
    format_as_single_object = false
  } = {}
) {
  try {
    const auth = Buffer.from(`api:${apiKey}`).toString("base64");
    const url = "https://phoenix.api.zetaglobal.net/v1/subscriber_property_types";

    console.log("Fetching subscriber property types with params:", {
      accountId, keyword, page, per_page, sort_by, order, format_as_single_object
    });

    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${auth}`
      },
      params: {
        page,
        per_page,
        sort_by,
        order,
        format_as_single_object,
        keyword
      }
    });

    //console.log("Raw API response:", JSON.stringify(response.data, null, 2));


    let rawData = [];

    if (Array.isArray(response.data)) {
      rawData = response.data;
    } else if (Array.isArray(response.data.data)) {
      rawData = response.data.data;
    } else if (Array.isArray(response.data.subscriber_property_types)) {
      rawData = response.data.subscriber_property_types;
    } else {
      throw new Error("Unexpected API response format, no array found");
    }


    const filtered = rawData.filter(
      (item) =>
        item.prop_name !== "uid" &&
        item.prop_name !== "consent.reidentification"
    );


    if (response.data.data) {
      return {
        ...response.data,
        data: filtered
      };
    }

    if (response.data.subscriber_property_types) {
      return {
        ...response.data,
        subscriber_property_types: filtered
      };
    }

    return filtered;

  } catch (error) {
    console.error(" Error fetching subscriber property types:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw new Error("Failed to fetch subscriber property types");
  }
}


async function updateSubscriberPropertyTypes({
  accountId,
  apiKey,
  property,
  subscriberId
}) {
  try {
    const url = `https://phoenix.api.zetaglobal.net/subscriber_property_types/${subscriberId}`;


    const auth = Buffer.from(`api:${apiKey}`).toString("base64");

    console.log("Updating subscriber property type:", url, property);

    const response = await axios.put(url, property, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
        Accept: "application/json"
      }
    });

    console.log("Update response:", response.data);
    return response.data;

  } catch (err) {
    console.error("Error updating subscriber property type:", err.data || err.message);
    console.log(err);
    throw new Error("Failed to update subscriber property type");
  }
}


module.exports = {
  getApiKeyForAccount,
  getSubscriberPropertyTypes,
  updateSubscriberPropertyTypes

};
