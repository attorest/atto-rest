import { Client, Pool } from 'pg';
import config from 'config';

export const pool = new Pool(config.get('db'));
export const client = new Client(config.get('db'));
