import { AppDataSource } from "../config/database";
import { Credential } from "../entities/Credential.entity";
import { User } from "../entities/User.entity";

const credentialRepository = AppDataSource.getRepository(Credential);
const userRepository = AppDataSource.getRepository(User);

const crypPass = async (text: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
};
const checkUserExist = async (username: string): Promise<void> => {
  const credential = await credentialRepository.findOne({ where: { username } });
  if (credential) {
    throw new Error(`El username ${username} ya existe, intente con uno nuevo`);
  }
};

export const CreateCredentials = async (
  username: string,
  password: string
): Promise<number> => {
  await checkUserExist(username);

  const passwordEnc = await crypPass(password);
  const newCredential = credentialRepository.create({
    username,
    password: passwordEnc
  });

  await credentialRepository.save(newCredential);
  return newCredential.id;
};
export const checkCredentials = async (
  username: string,
  password: string
): Promise<number> => {
  const credential = await credentialRepository.findOne({ where: { username } });
  if (!credential) throw new Error("Credenciales incorrectas");

  const passwordEnc = await crypPass(password);
  if (credential.password !== passwordEnc) throw new Error("Credenciales incorrectas");

const user = await userRepository.findOne({
  where: { credential: { id: credential.id } }
});

  if (!user)
    throw new Error(`Usuario con credencial ${credential.id} no fue encontrado.`);

  return user.id;
};
