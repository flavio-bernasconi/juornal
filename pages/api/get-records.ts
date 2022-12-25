import { NextApiHandler } from "next";
import { authorize } from "../../utils/authorize";
import { getXataClient } from "../../utils/xata";
import moment from "moment";

const fetchAll: NextApiHandler = async (req, res) => {
  const { isAuthenticated, username } = await authorize(req);
  if (!isAuthenticated || !username) {
    res.status(401).end();
    return;
  }

  const { month, year } = req.query;

  const xata = getXataClient();
  const list = await xata.db["Jurnal-entries"]
    .filter("user.username", username)
    // .filter("date", {
    //   $contains: moment()
    //     .set("month", Number(month))
    //     .set("year", Number(year))
    //     .format("YYYY-M-"),
    // })
    .getAll();

  if (!list) {
    res.status(500).end();
    return;
  }

  res.json(list);
};

export default fetchAll;
