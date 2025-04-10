import client from '../../../config/database';
import { User } from '../interfaces/user-entities.interface';

export const findByEmailUser = async (email: string) => {
  const res = await client.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0];
};

export const createUser = async (user: User) => {
  await client.query(`
    INSERT INTO users (id, email, password_hash, full_name, username, is_active, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
    [user.id, user.email, user.password_hash, user.full_name, user.username, user.is_active]
  );
};