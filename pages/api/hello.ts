import { NextApiRequest, NextApiResponse } from "next";

// TO DO: Turn this into a bio or resume.
export default (_: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ text: "Hello" });
};
