import Branch from "../models/branch-model.js";

const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find({});
    // console.log("All branches:", branches.length);

    res.status(200).json({
      message: "Branches fetched successfully",
      branches,
    });
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const getBranchBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    console.log("Fetching branch with slug:", slug);

    const branch = await Branch.findOne({ slug });

    if (!branch) {
      console.log(`Branch with slug ${slug} not found`);
      return res.status(404).json({ msg: "Branch not found" });
    }

    console.log(`Found branch: ${branch}`);
    res.status(200).json({
      message: "Branch fetched successfully",
      branch,
    });
  } catch (error) {
    console.error("Error fetching branch by slug:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const getBranchesByStreamName = async (req, res) => {
  try {
    const { streamName } = req.params;
    console.log("Fetching branches for streamName:", streamName);

    const branches = await Branch.find({ streamName });

    console.log(
      `Found ${branches.length} branches for streamName ${streamName}`
    );

    res.status(200).json({
      message: "Branches fetched successfully",
      branches,
    });
  } catch (error) {
    console.error("Error fetching branches by streamName:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export default {
  getAllBranches,
  getBranchBySlug,
  getBranchesByStreamName,
};
