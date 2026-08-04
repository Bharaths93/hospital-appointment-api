import { prisma } from './lib/prisma';

async function main() {
  console.log('--- Seeding Database ---');

  // Clean existing tables
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();

  // Create Doctors
  const doctor1 = await prisma.doctor.create({
    data: {
      name: 'Dr. Alice Smith',
      specialty: 'Cardiology',
      email: 'alice.smith@hospital.com',
      phone: '555-0101',
    },
  });

  const doctor2 = await prisma.doctor.create({
    data: {
      name: 'Dr. Bob Jones',
      specialty: 'Pediatrics',
      email: 'bob.jones@hospital.com',
      phone: '555-0102',
    },
  });

  const doctor3 = await prisma.doctor.create({
    data: {
      name: 'Dr. Carol White',
      specialty: 'Dermatology',
      email: 'carol.white@hospital.com',
      phone: '555-0103',
    },
  });

  console.log('Seeded doctors:', [doctor1.name, doctor2.name, doctor3.name]);

  // Create Patients
  const patient1 = await prisma.patient.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '555-0201',
      dateOfBirth: new Date('1990-05-15'),
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      name: 'Jane Miller',
      email: 'jane.miller@example.com',
      phone: '555-0202',
      dateOfBirth: new Date('1985-11-20'),
    },
  });

  const patient3 = await prisma.patient.create({
    data: {
      name: 'Robert Johnson',
      email: 'robert.j@example.com',
      phone: '555-0203',
      dateOfBirth: new Date('2000-01-10'),
    },
  });

  console.log('Seeded patients:', [patient1.name, patient2.name, patient3.name]);

  // Create Appointments
  const futureDate1 = new Date();
  futureDate1.setDate(futureDate1.getDate() + 5);

  const futureDate2 = new Date();
  futureDate2.setDate(futureDate2.getDate() + 10);

  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 2);

  const appointment1 = await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor1.id,
      appointmentDate: futureDate1,
      reason: 'Routine Cardiac Checkup',
      status: 'SCHEDULED',
    },
  });

  const appointment2 = await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      doctorId: doctor2.id,
      appointmentDate: futureDate2,
      reason: 'Child Health Exam',
      status: 'SCHEDULED',
    },
  });

  const appointment3 = await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor3.id,
      appointmentDate: pastDate,
      reason: 'Skin Allergy Followup',
      status: 'COMPLETED',
    },
  });

  console.log('Seeded appointments count:', 3);
  console.log('--- Seeding Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
