import { isTimeConflict } from '@/app/utils/timeUtils';
import { NextResponse } from 'next/server';
import { createPrismaClient } from "@/lib/prisma"

const prisma = createPrismaClient()
interface AppointmentRequest {
  patientName: string;
  doctorName: string;
  datetime: string;
}

export async function POST(req: Request) {
  const { patientName, doctorName, datetime } = await req.json() as AppointmentRequest;

  if (!patientName || !doctorName || !datetime) {
    return NextResponse.json(
      { error: 'Missing required fields: patientName, doctorName, and datetime are required' },
      { status: 400 }
    );
  }

  try {
    const dateObj = new Date(datetime);
    
    // Validate datetime is in the future
    if (dateObj <= new Date()) {
      return NextResponse.json(
        { error: 'Appointment datetime must be in the future' },
        { status: 400 }
      );
    }

    // Find or create patient
    let patient = await prisma.voicePatient.findFirst({
      where: { name: patientName },
    });
    
    if (!patient) {
      patient = await prisma.voicePatient.create({
        data: { name: patientName },
      });
    }

    // Find or create doctor
    let doctor = await prisma.voiceDoctor.findFirst({
      where: { name: doctorName },
    });
    
    if (!doctor) {
      doctor = await prisma.voiceDoctor.create({
        data: { name: doctorName },
      });
    }

    // Check doctor availability
    const existingAppointments = await prisma.voiceAppointment.findMany({
      where: { doctorId: doctor.id },
    });

    if (isTimeConflict(dateObj, existingAppointments)) {
      return NextResponse.json(
        { error: `Sorry, ${doctorName} is unavailable at that time. Please choose another time.` },
        { status: 409 } // 409 Conflict status code
      );
    }

    // Schedule appointment
    const appointment = await prisma.voiceAppointment.create({
      data: {
        doctorId: doctor.id,
        patientId: patient.id,
        date: dateObj,
      },
    });

    return NextResponse.json({ 
      message: `Appointment successfully scheduled with ${doctorName} at ${dateObj.toUTCString()}`,
      appointmentId: appointment.id 
    });
  } catch (error) {
    console.error('Appointment error:', error);
    return NextResponse.json(
      { error: 'Failed to schedule appointment' },
      { status: 500 }
    );
  }
}