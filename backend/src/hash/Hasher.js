import crypto from 'crypto';
import bcrypt from 'bcrypt';
import util from 'util';

// adds random brute-force salt to bcrypt algorithm
// (results in average ~1.8x work for incorrect passwords)

const BRUTE_SALTS = '01234567'.split('');

const randomBytes = util.promisify(crypto.randomBytes);

async function pickBruteSalt() {
  const buf = await randomBytes(1);
  const index = buf[0] % BRUTE_SALTS.length;
  return BRUTE_SALTS[index];
}

function shuffle(list) {
  // randomisation is just to vary response
  // times to reduce average server load;
  // cryptographic randomness is not required here

  // Thanks, https://stackoverflow.com/a/6274381/1180785
  const result = list.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = result[i];
    result[i] = result[j];
    result[j] = t;
  }
  return result;
}

function preprocess(password, secretPepper, bruteSalt) {
  // use SHA to ensure no max length
  // (which would make it possible to brute-force the secretPepper)
  const hash = crypto.createHash('sha512');
  hash.update(`${password}${bruteSalt}${secretPepper}`);
  return hash.digest('base64');
}

export default class Hasher {
  constructor(secretPepper = '', rounds = 10) {
    this.secretPepper = secretPepper;
    this.rounds = rounds;
  }

  async hash(data) {
    const bruteSalt = await pickBruteSalt();
    return bcrypt.hash(
      preprocess(data, this.secretPepper, bruteSalt),
      this.rounds,
    );
  }

  async compare(data, hash) {
    const salts = shuffle(BRUTE_SALTS);
    for (let i = 0; i < salts.length; i += 1) {
      /* eslint-disable-next-line no-await-in-loop */ // intentionally serial
      const match = await bcrypt.compare(
        preprocess(data, this.secretPepper, salts[i]),
        hash,
      );
      if (match) {
        return true;
      }
    }
    return false;
  }

  needsRegenerate(hash) {
    return bcrypt.getRounds(hash) < this.rounds;
  }
}
