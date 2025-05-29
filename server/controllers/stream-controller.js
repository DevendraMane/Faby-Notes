import Stream from "../models/stream-model.js";

// ****** STREAM CONTROLLER ****** //
const streams = async (req, res) => {
  try {
    // Fetch all streams from the database
    const streamsData = await Stream.find({});
    // console.log("Streams fetched:", streamsData);

    // Return the streams data
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
