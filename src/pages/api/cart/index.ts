import { NextApiRequest, NextApiResponse } from 'next';
import { ContentClient } from '@uniformdev/canvas';
import { normalizeProduct } from '../../../modules/fake-cart/normalizeProduct';
import { getContentClient } from '../../../utilities/canvas/canvasClients';

const getMemoizedContentClient = (() => {
  let canvasClient: ContentClient;
  return () => {
    if (!canvasClient) canvasClient = getContentClient();
    return canvasClient;
  };
})();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { productKeys, locale = 'en-US' } = req.query;

  const entryIDs = JSON.parse(productKeys as string);

  if (!entryIDs || !entryIDs.length) {
    return res.status(200).json([]);
  }

  const { entries: contentEntries } = await getMemoizedContentClient()?.getEntries({
    entryIDs,
    locale: locale as string,
  });

  const normalizedEntries = contentEntries?.map(entry => normalizeProduct(entry));

  return res.status(200).json(normalizedEntries);
};
