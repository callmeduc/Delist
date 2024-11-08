import asyncHandler from "express-async-handler";

const home = asyncHandler(async (req, res) => {
  try {
    res.send("Service is running and analyzing ... in deist project.");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

const test = asyncHandler(async (req, res) => {
  try {
    console.log("This is a test... in delist project.");
    res.send("This is a test... in delist project.");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

export { home, test };
