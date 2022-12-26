import { NextApiHandler } from "next";
import { authorize } from "../../utils/authorize";
import { getXataClient } from "../../utils/xata";
import { getSession } from "next-auth/react";

const fetchAll: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });

  if (!session || !session.user?.username) {
    return res.status(401).end();
  }

  const { month, year } = req.query;

  const xata = getXataClient();
  const list = await xata.db["Jurnal-entries"]
    .filter("user.username", session.user?.username)
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
