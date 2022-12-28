import { NextApiHandler } from "next";
import { authorize } from "../../utils/authorize";
import { getXataClient } from "../../utils/xata";
import moment from "moment";
import { getSession } from "next-auth/react";

const handler: NextApiHandler = async (req, res) => {
  try {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).end();
    }

    const { date, id, value, note } = req.body;

    if (value === undefined || value === null) {
      throw new Error("Missing params");
    }

    const xata = getXataClient();
    const user = await xata.db.Users.filter({
      username: session.user?.username,
    }).getFirst();
    if (!user) {
      res.status(500).end();
      return;
    }

    if (!id && (value || value === 0) && date) {
      console.log(moment(date).toISOString(), { date });

      await xata.db["Jurnal-entries"].create({
        date,
        value,
        user: { id: user.id },
        note: note || null,
      });
    } else {
      await xata.db["Jurnal-entries"].update(id, {
        value,
        note,
      });
    }

    res.end();
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
};

export default handler;
