import {
  createPatient,
  getPatient,
  searchPatients,
  updatePatientPhone,
  deletePatient,
} from './patients';
import {
  createDoctor,
  getDoctor,
  listDoctorsBySpecialty,
  deleteDoctor,
} from './doctors';
import {
  bookAppointment,
  getAppointmentFull,
  getDoctorUpcomingAppointments,
  setAppointmentStatus,
  cancelAllPatientAppointments,
  deleteAppointment,
} from './appointments';
import { prisma } from './lib/prisma';

async function runTests() {
  console.log('=== STARTING HOSPITAL APPOINTMENT API CRUD TESTS ===\n');

  // --- 1. PATIENTS CRUD TESTS ---
  console.log('--- Testing Patients CRUD ---');

  // 1.1 createPatient
  const newPatient = await createPatient({
    name: 'Emily Watson',
    email: 'emily.watson@example.com',
    phone: '555-0999',
    dateOfBirth: new Date('1995-03-25'),
  });
  console.log('1. createPatient:', newPatient);

  // 1.2 getPatient
  const fetchedPatient = await getPatient(newPatient.id);
  console.log('2. getPatient:', fetchedPatient);

  // 1.3 searchPatients
  const searchResults = await searchPatients('Watson');
  console.log('3. searchPatients ("Watson"):', searchResults);

  // 1.4 updatePatientPhone
  const updatedPatient = await updatePatientPhone(newPatient.id, '555-8888');
  console.log('4. updatePatientPhone:', updatedPatient);

  // --- 2. DOCTORS CRUD TESTS ---
  console.log('\n--- Testing Doctors CRUD ---');

  // 2.1 createDoctor
  const newDoctor = await createDoctor({
    name: 'Dr. David Miller',
    specialty: 'Neurology',
    email: 'david.miller@hospital.com',
    phone: '555-0777',
  });
  console.log('5. createDoctor:', newDoctor);

  // 2.2 getDoctor
  const fetchedDoctor = await getDoctor(newDoctor.id);
  console.log('6. getDoctor:', fetchedDoctor);

  // 2.3 listDoctorsBySpecialty
  const neurologyDoctors = await listDoctorsBySpecialty('Neurology');
  console.log('7. listDoctorsBySpecialty ("Neurology"):', neurologyDoctors);

  // --- 3. APPOINTMENTS CRUD TESTS ---
  console.log('\n--- Testing Appointments CRUD ---');

  // 3.1 bookAppointment
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);
  const newAppointment = await bookAppointment({
    patientId: newPatient.id,
    doctorId: newDoctor.id,
    appointmentDate: futureDate,
    reason: 'Neurological Evaluation',
  });
  console.log('8. bookAppointment (with connect & include):', newAppointment);

  // 3.2 getAppointmentFull
  const fullAppointment = await getAppointmentFull(newAppointment.id);
  console.log('9. getAppointmentFull:', fullAppointment);

  // 3.3 getDoctorUpcomingAppointments
  const upcomingApps = await getDoctorUpcomingAppointments(newDoctor.id);
  console.log('10. getDoctorUpcomingAppointments:', upcomingApps);

  // 3.4 setAppointmentStatus
  const statusUpdated = await setAppointmentStatus(newAppointment.id, 'CONFIRMED');
  console.log('11. setAppointmentStatus ("CONFIRMED"):', statusUpdated);

  // 3.5 cancelAllPatientAppointments
  const batchCancelled = await cancelAllPatientAppointments(newPatient.id);
  console.log('12. cancelAllPatientAppointments:', batchCancelled);

  // 3.6 deleteAppointment
  const deletedApp = await deleteAppointment(newAppointment.id);
  console.log('13. deleteAppointment:', deletedApp);

  // --- 4. CLEANUP DELETES ---
  console.log('\n--- Testing Delete Patients & Doctors ---');

  // 4.1 deleteDoctor
  const deletedDoctor = await deleteDoctor(newDoctor.id);
  console.log('14. deleteDoctor:', deletedDoctor);

  // 4.2 deletePatient
  const deletedPatient = await deletePatient(newPatient.id);
  console.log('15. deletePatient:', deletedPatient);

  console.log('\n=== ALL CRUD TESTS COMPLETED SUCCESSFULLY ===');
}

runTests()
  .catch((e) => {
    console.error('Test execution error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
