import type { NextApiRequest, NextApiResponse } from "next";
import Arweave from "arweave";
import formidable, { File } from "formidable";
import fs from "fs";
import { CreateTransactionInterface } from "arweave/node/common";

const key = JSON.parse(
  fs.readFileSync("arweave-key.json").toString().trim()
);

type Data = {
  id: string;
};
export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
  });
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    var rawData: any = fs.readFileSync(
      (files.image as unknown as File).filepath,
      { encoding: "base64" }
    );
    var rawObj: Partial<CreateTransactionInterface> = {
      data: rawData,
    };
    let transactionA = await arweave.createTransaction(rawObj, key);
    await arweave.transactions.sign(transactionA, key);
		let uploader = await arweave.transactions.getUploader(transactionA);
		while (!uploader.isComplete) {
			await uploader.uploadChunk();
		}
    console.log(`transactionA.id`, transactionA.id)
    res.json({id: transactionA.id});
  });

}
