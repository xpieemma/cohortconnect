import express from "express";
import { authMiddleware } from "../utils/auth.js";
import { Octokit } from "@octokit/rest";

const router = express.Router();

// verify logged in user's token
router.use(authMiddleware);

function getOctokit(token) {
  return new Octokit({
    auth: token,
  });
}
console.log("a");
router.get("/following/:username", async (req, res) => {
  const { username } = req.params;
  console.log("m", req.user.githubAccessToken);

  const token = req.user.githubAccessToken;
  if (!token)
    return res.status(400).json({ message: "Missing GitHub access token" });

  const octokit = getOctokit(token);

  try {

    await octokit.request("GET /user/following/{username}", {
      username
    })

    return res.json({ following: true });
  } catch (err) {
    if (err.status === 404) {
      return res.json({ following: false });
    }
    console.log("GitHub API error details:", err.message, err.response?.data);
    return res
      .status(500)
      .json({ message: "GitHub API error "+err.message});
  }
});

router.put("/follow/:username", async (req, res) => {
  const { username } = req.params;
  const token = req.user.githubAccessToken || req.user.accessToken;
  if (!token)
    return res.status(400).json({ message: "Missing GitHub access token" });

  const octokit = getOctokit(token);

  try {
    
    await octokit.request("PUT /user/following/{username}", {
      username
    })

    return res.json({ following: true });
  } catch (err) {
    console.log(
      "GitHub follow error details:",
      err.message,
      err.response?.data,
    );
    return res
      .status(500)
      .json({ message: "Failed to follow user "+err.message });
  }
});

router.delete("/unfollow/:username", async (req, res) => {
  const { username } = req.params;
  const token = req.user.githubAccessToken || req.user.accessToken;
  if (!token)
    return res.status(400).json({ message: "Missing GitHub access token" });

  const octokit = getOctokit(token);

  try {
    await octokit.request("DELETE /user/following/{username}", {
      username
    })

    return res.json({ following: false });
  } catch (err) {
    console.log(
      "GitHub unfollow error details:",
      err.message,
      err.response?.data,
    );
    return res
      .status(500)
      .json({ message: "Failed to unfollow user "+err.message });
  }
});

export default router;
