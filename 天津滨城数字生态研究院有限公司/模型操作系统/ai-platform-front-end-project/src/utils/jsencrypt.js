import JSEncrypt from 'jsencrypt/bin/jsencrypt';

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCG9D9i3wtLjV+CPKljlP+CETjynD8YIklaLe5Jum6JNcO0ddaa' +
  '+retH4p9ZmrbWXB0b3W3BMPOmAwpryngb7S0kQyEPRr0vZBSL+8gmD52r/Cj1tw27bjl5HapGfyPC+n0ojupER3l95Zuc0Pw9rN7dtV8wAXdpL2ddnZgDc3bJQIDAQAB';

const privateKey = 'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAIb0P2LfC0uNX4I8qWOU/4IROPKcPxg' +
  'iSVot7km6bok1w7R11pr6t60fin1mattZcHRvdbcEw86YDCmvKeBvtLSRDIQ9GvS9kFIv7yCYPnav8KPW3DbtuOXkdqkZ/I8L' +
  '6fSiO6kRHeX3lm5zQ/D2s3t21XzABd2kvZ12dmANzdslAgMBAAECgYBAYhJDdymKV93y4kHlslXblZ/XjtdDCkh4b2U5Y2o' +
  'Mp8vAMl+5/FbYjy2g+dWM5DSUOACu2eUYkM1srZaK7oAE24cfy8uYl8eB9FcQC2EUZw8HhqUA29kcJ' +
  'iHPvpW0FngO/I+YDAYmY/v+AE4iZiHOlGKNCY/S+47CA5TFB49IgQJBAMMXOCnpKqF3oYeNvD' +
  '+ziTohZA3t5c//hWLSsvF2Ckcf5mn8oTSAr/An2zV96XpTzcltNmBz3GfEyFEzMc0uLNECQQCxFo/D' +
  'pY/ZtXjuyYmpiyzMyP0nuZuaEH7Kh1aGitpH3/h3wzF94SqdN3BG5MbhwOUGf29LiTC3VS2ex4outM4VA' +
  'kByvCIky+NtiNzvytSuphkLnf2pD4N7u2wn/YCN730F7WXmaVQpe5F9bQNHx2BbuBOr5dX4DcvPH3UsBC7C2+gxA' +
  'kA5eJ39m7ycphVyQXvoxx8p8syd2NHT5SiQ5+0/ys5eZySHEZT9Slb/IN/SUirtVyG8wxzGgeaKiR0+G3oQAGOlAkEAqXs' +
  'SqZtKCmWxT1e5jGxePacEhgake2RH2sqn/act4UxmBkK+Itm0yBGfvF4SW+EU5Whv3EKrwF5UIHZpAYijRA==';

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey); // 设置公钥
  return encryptor.encrypt(txt); // 对数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt();
  encryptor.setPrivateKey(privateKey); // 设置私钥
  return encryptor.decrypt(txt); // 对数据进行解密
}
