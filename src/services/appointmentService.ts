import { AppDataSource } from "../config/database"
import { Appointment, Status } from "../entities/Appointment.entity"
import { ScheduleAppointmentDTO } from "../../DOTs/appointmentDTO"
import { getUserByIdService } from "./userService"
import { Request, Response } from "express"

const appointmentRepository = AppDataSource.getRepository(Appointment)

export const getAppointmentsService = async (): Promise<Appointment[]> => {
  return await appointmentRepository.find()
}

export const getAppointmentByIdService = async (id: number): Promise<Appointment> => {
  const appointment = await appointmentRepository.findOne({ where: { id } })
  if (!appointment) throw new Error(`La cita con id: ${id} no fue encontrada.`)
  return appointment
}

export const getAppointmentsByUserIdService = async (userId: number): Promise<Appointment[]> => {

  await getUserByIdService(userId)
  
  return await appointmentRepository.find({ 
    where: { userId },
    order: { date: "ASC", time: "ASC" }
  })
}

export const scheduleAppointmentService = async (
  appointmentData: ScheduleAppointmentDTO
): Promise<Appointment> => {

  let fecha: Date;

  if (typeof appointmentData.date === "string") {
    const [year, month, day] = appointmentData.date.split("-");
    fecha = new Date(Number(year), Number(month) - 1, Number(day));
  } else if ((appointmentData.date as any) instanceof Date) {
    fecha = appointmentData.date as Date; 
  } else {
    throw new Error("Formato de fecha inválido");
  }
  const diaSemana = fecha.getDay();
  if (diaSemana === 0 || diaSemana === 6) {
    throw new Error("No se pueden agendar turnos los fines de semana.");
  }

  if (typeof appointmentData.time !== "string") {
    throw new Error("Formato de hora inválido");
  }

  const [hora, minutos] = appointmentData.time.split(":").map(Number);
  const horaEnDecimal = hora + minutos / 60;

  if (horaEnDecimal < 10 || horaEnDecimal >= 20) {
    throw new Error("Los turnos solo pueden reservarse entre las 10:00 y las 20:00 horas.");
  }

  const userFound = await getUserByIdService(appointmentData.userId);
  if (!userFound) {
    throw new Error("Usuario no encontrado.");
  }

  const newAppointment = appointmentRepository.create({
    date: appointmentData.date,
    time: appointmentData.time,
    status: Status.active,
    userId: userFound.id
  });

  await appointmentRepository.save(newAppointment);

  return newAppointment;
};

export const cancelAppointmentService = async (id: number) => {
  const appointment = await appointmentRepository.findOne({ where: { id } });
  if (!appointment) throw new Error(`Turno con id ${id} no encontrado.`);

  appointment.status = Status.cancelled;
  await appointmentRepository.save(appointment);

  return appointment;
};

export const deleteAppointmentService = async (id: number): Promise<void> => {
  const appointment = await appointmentRepository.findOne({ where: { id } })
  if (!appointment) {
    throw new Error(`El turno con id ${id} no fue encontrado.`)
  }

  await appointmentRepository.remove(appointment)
}
export const deleteAppointmentController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const existing = await appointmentRepository.findOne({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Turno no encontrado" });
    }

    await appointmentRepository.delete(id);

    return res.json({ message: "Turno eliminado correctamente" });
  } catch (error) {
    console.error(" Error eliminando turno:", error);
    return res.status(500).json({ error: "Error del servidor" });
  }
};