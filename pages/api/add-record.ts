import { NextApiHandler } from "next";
import { authorize } from "../../utils/authorize";
import { getXataClient } from "../../utils/xata";
import moment from "moment";
import { getSession } from "next-auth/react";

const handler: NextApiHandler = async (req, res) => {
  // const session = await getSession({ req });
  // if (!session) {
  //   return res.status(401).end();
  // }
  // const { date, value, note } = req.body;
  // const xata = getXataClient();
  // const user = await xata.db.Users.filter({
  //   username: session.user?.username,
  // }).getFirst();
  // if (!user) {
  //   res.status(500).end();
  //   return;
  // }
  // await xata.db["Jurnal-entries"].create({
  //   date: moment(date).toISOString(),
  //   value,
  //   user: { id: user.id },
  //   note,
  // });
  // res.end();
};

export default handler;
