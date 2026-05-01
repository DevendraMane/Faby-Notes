import Stream from "../models/stream-model.js";

// ****** STREAM CONTROLLER ****** //
const streams = async (req, res) => {
  try {
    const streamsData = await Stream.find({}, { name: 1, slug: 1 }).lean();

    // console.log("Streams fetched from DB:", streamsData);

    // Define custom sort order
    const streamOrder = { Engineering: 1, Diploma: 2, Pharmacy: 3 };

    // Sort streams by custom order
    streamsData.sort((a, b) => {
      const orderA = streamOrder[a.name] || 999;
      const orderB = streamOrder[b.name] || 999;
      return orderA - orderB;
    });

    // console.log("Streams after sort:", streamsData);

    // Disable cache for now to test
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");

    res.status(200).json({
      message: "Streams fetched successfully",
      streams: streamsData,
    });
  } catch (error) {
    console.error("Error fetching streams:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
// ------ STREAM CONTROLLER ------ //

export default { streams };
