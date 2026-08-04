import { Appointment, Prisma } from '@prisma/client';
import { prisma } from './lib/prisma';

export interface BookAppointmentInput {
  patientId: number;
  doctorId: number;
  appointmentDate: Date;
  reason?: string;
  status?: string;
}

export type FullAppointment = Prisma.AppointmentGetPayload<{
  include: { patient: true; doctor: true };
}>;

export async function bookAppointment(data: BookAppointmentInput): Promise<FullAppointment> {
  return await prisma.appointment.create({
    data: {
      appointmentDate: data.appointmentDate,
      reason: data.reason,
      status: data.status ?? 'SCHEDULED',
      patient: {
        connect: { id: data.patientId },
      },
      doctor: {
        connect: { id: data.doctorId },
      },
    },
    include: {
      patient: true,
      doctor: true,
    },
  });
}

export async function getAppointmentFull(id: number): Promise<FullAppointment | null> {
  return await prisma.appointment.findUnique({
    where: { id },
    include: {
      patient: true,
      doctor: true,
    },
  });
}

export async function getDoctorUpcomingAppointments(doctorId: number): Promise<FullAppointment[]> {
  return await prisma.appointment.findMany({
    where: {
      doctorId,
      appointmentDate: {
        gte: new Date(),
      },
    },
    include: {
      patient: true,
      doctor: true,
    },
    orderBy: {
      appointmentDate: 'asc',
    },
  });
}

export async function setAppointmentStatus(id: number, status: string): Promise<Appointment> {
  return await prisma.appointment.update({
    where: { id },
    data: { status },
  });
}

export async function cancelAllPatientAppointments(patientId: number): Promise<Prisma.BatchPayload> {
  return await prisma.appointment.updateMany({
    where: { patientId },
    data: { status: 'CANCELLED' },
  });
}

export async function deleteAppointment(id: number): Promise<Appointment> {
  return await prisma.appointment.delete({
    where: { id },
  });
}
