import { createReadStream, constants } from 'fs';
import { writeFile, access } from 'fs/promises';
import { resolve } from 'path';
import { TUser } from 'routes/users/usersBehavior';

const fileDBPath = resolve(__dirname, 'db.json');

export const testFileDb = async () => {
  try {
    await access(fileDBPath, constants.F_OK);
  } catch (err) {
    await writeFile(fileDBPath, JSON.stringify([]), { flag: 'wx' });
  }
};

export const getStore = async (): Promise<TUser[]> => {
  await testFileDb();

  return new Promise((res, rej) => {
    const readStream = createReadStream(fileDBPath, { encoding: 'utf8' });

    let body = '';
    readStream.on('data', (chunk) => {
      body += chunk;
    });

    readStream.on('end', () => {
      res(JSON.parse(body));
    });

    readStream.on('error', (err) => rej(err));
  });
};

export const setStore = async (users: TUser[]) => {
  await testFileDb();

  await writeFile(fileDBPath, JSON.stringify(users), {});
};

export const clearStore = async () => {
  await testFileDb();

  await writeFile(fileDBPath, JSON.stringify([]), {});
};
