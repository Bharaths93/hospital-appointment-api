import { Doctor } from '@prisma/client';
import { prisma } from './lib/prisma';

export interface CreateDoctorInput {
  name: string;
  specialty: string;
  email: string;
  phone?: string;
}

export async function createDoctor(data: CreateDoctorInput): Promise<Doctor> {
  return await prisma.doctor.create({
    data: {
      name: data.name,
      specialty: data.specialty,
      email: data.email,
      phone: data.phone,
    },
  });
}

export async function getDoctor(id: number): Promise<Doctor | null> {
  return await prisma.doctor.findUnique({
    where: { id },
  });
}

export async function listDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
  return await prisma.doctor.findMany({
    where: {
      specialty: {
        equals: specialty,
        mode: 'insensitive',
      },
    },
  });
}

export async function deleteDoctor(id: number): Promise<Doctor> {
  return await prisma.doctor.delete({
    where: { id },
  });
}
