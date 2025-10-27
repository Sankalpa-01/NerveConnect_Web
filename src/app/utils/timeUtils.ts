import { VoiceAppointment } from "@prisma/client";

export function isTimeConflict(
  newDate: Date,
  appointments: VoiceAppointment[]
) {
  const newTime = newDate.getTime();

  return appointments.some((appointment) => {
    const existingTime = new Date(appointment.date).getTime();
    return Math.abs(existingTime - newTime) < 30 * 60 * 1000; // 30 mins buffer
  });
}
