import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User.entity";
import { CreateCredentials } from "../services/credentialService";
import { UserRegisterDTO } from "../../DOTs/UserDOTs";

export const registerUserController = async (
  req: Request<unknown, unknown, UserRegisterDTO>,
  res: Response
) => {
  try {
    const userData = req.body;
    const userRepository = AppDataSource.getRepository(User);

    const credentialsId = await CreateCredentials(
      userData.username,
      userData.password
    );
    const newUser = userRepository.create({
  name: userData.name,
  email: userData.email,
  nDni: userData.nDni,
  birthdate: new Date(userData.birthdate),
  credential: { id: credentialsId },
});


    await userRepository.save(newUser);

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }
  });

  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res.status(500).json({
      message: "Error en el registro del usuario",
      error: error instanceof Error ? error.message : error
    });
  }
};
