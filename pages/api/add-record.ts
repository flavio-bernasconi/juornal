import { NextApiHandler } from "next";
import { authorize } from "../../utils/authorize";
import { getXataClient } from "../../utils/xata";
import moment from "moment";

const handler: NextApiHandler = async (req, res) => {
  const { isAuthenticated, username } = await authorize(req);
  if (!isAuthenticated) {
    res.status(401).end();
    return;
  }

  const { date, value, note } = req.body;
  const xata = getXataClient();
  const user = await xata.db.Users.filter({ username }).getFirst();
  if (!user) {
    res.status(500).end();
    return;
  }

  await xata.db["Jurnal-entries"].create({
    date: moment(date).toISOString(),
    value,
    user: { id: user.id },
    note,
  });
  res.end();
};

export default handler;
