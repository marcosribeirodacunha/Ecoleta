import { Request, Response } from 'express';
import knex from '../database/connection';

class ItemsContoller {
  async index(req: Request, res: Response) {
    const items = await knex('items').select('*');

    const serializedItems = items.map(item => {
      return {
        id: item.id,
        title: item.title,
        /* --- WEB URL ---  */
        // image_url: `http://localhost:3333/uploads/${item.image}`,
        /* --- MOBILE URL: use LAN url ---  */
        image_url: `http://192.168.0.4:3333/uploads/${item.image}`,
      };
    });

    return res.json(serializedItems);
  }
}

export default ItemsContoller;
