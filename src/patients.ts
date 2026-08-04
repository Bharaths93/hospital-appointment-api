import { Patient } from '@prisma/client';
import { prisma } from './lib/prisma';

export interface CreatePatientInput {
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
}

export async function createPatient(data: CreatePatientInput): Promise<Patient> {
  return await prisma.patient.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
    },
  });
}

export async function getPatient(id: number): Promise<Patient | null> {
  return await prisma.patient.findUnique({
    where: { id },
  });
}

export async function searchPatients(query: string): Promise<Patient[]> {
  return await prisma.patient.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    },
  });
}

export async function updatePatientPhone(id: number, phone: string): Promise<Patient> {
  return await prisma.patient.update({
    where: { id },
    data: { phone },
  });
}

export async function deletePatient(id: number): Promise<Patient> {
  return await prisma.patient.delete({
    where: { id },
  });
}
