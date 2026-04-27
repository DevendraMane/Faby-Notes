import Stream from "../models/stream-model.js";

// ****** STREAM CONTROLLER ****** //
const streams = async (req, res) => {
  try {
    const streamsData = await Stream.find({}, { name: 1, slug: 1 }).lean();
    // console.log("Streams fetched:", streamsData);

    res.set("Cache-Control", "public, max-age=600, stale-while-revalidate=60");

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
