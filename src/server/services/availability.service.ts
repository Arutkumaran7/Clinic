import { prisma } from '../db';

// Helper: Parse time string ("09:00 AM", "02:30 PM", or "09:00") to minutes since midnight
function parseTimeToMinutes(timeStr: string): number {
  const ampmMatch = timeStr.match(/([0-9]+):([0-9]+)\s*(AM|PM)?/i);
  if (!ampmMatch) return 0;
  
  let hours = parseInt(ampmMatch[1]);
  const minutes = parseInt(ampmMatch[2]);
  const ampm = ampmMatch[3];
  
  if (ampm) {
    const isPM = ampm.toUpperCase() === 'PM';
    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
  }
  
  return hours * 60 + minutes;
}

// Helper: Format minutes since midnight to "HH:MM AM/PM"
function formatMinutesTo12h(totalMinutes: number): string {
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  if (hours === 0) hours = 12;
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)} ${ampm}`;
}

export class AvailabilityService {
  /**
   * Calculates available appointment slots (12-hour AM/PM format) for a doctor on a specific date.
   */
  public async getAvailableSlots(doctorId: string, dateString: string): Promise<string[]> {
    // 1. Determine day of the week
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD.');
    }
    const dayOfWeek = dateObj.getDay(); // 0 (Sun) to 6 (Sat)

    // 2. Fetch Doctor's Schedule for this weekday
    const schedule = await prisma.doctorSchedule.findUnique({
      where: {
        doctorId_dayOfWeek: {
          doctorId,
          dayOfWeek
        }
      }
    });

    if (!schedule) {
      return []; // Doctor is not scheduled to work on this day
    }

    // 3. Fetch Doctor's Leaves/Holidays on this date
    const leaves = await prisma.doctorLeave.findMany({
      where: {
        doctorId,
        leaveDate: dateString
      }
    });

    // Check for full-day leaves
    const hasFullDayLeave = leaves.some(l => l.startTime === null);
    if (hasFullDayLeave) {
      return []; // Doctor is on leave the entire day
    }

    // 4. Generate all raw slots based on shift hours and slot duration
    const shiftStartMins = parseTimeToMinutes(schedule.shiftStart);
    const shiftEndMins = parseTimeToMinutes(schedule.shiftEnd);
    const duration = schedule.slotDurationMinutes;

    const rawSlots: { start: number; end: number }[] = [];
    let currentStart = shiftStartMins;

    while (currentStart < shiftEndMins) {
      const currentEnd = currentStart + duration;
      if (currentEnd > shiftEndMins) break;

      rawSlots.push({ start: currentStart, end: currentEnd });
      currentStart = currentEnd;
    }

    // 5. Fetch already booked appointments for this doctor on this date
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        date: dateString,
        status: { in: ['CONFIRMED', 'PENDING', 'URGENT'] } // Ignore cancelled appointments
      }
    });

    const bookedRanges = appointments.map(apt => {
      const startMins = parseTimeToMinutes(apt.time);
      // Retrieve duration of the slot for the doctor
      return {
        start: startMins,
        end: startMins + duration
      };
    });

    const leaveRanges = leaves
      .filter(l => l.startTime !== null && l.endTime !== null)
      .map(l => ({
        start: parseTimeToMinutes(l.startTime!),
        end: parseTimeToMinutes(l.endTime!)
      }));

    // 6. Filter out overlapping slots
    const availableSlots = rawSlots.filter(slot => {
      // Overlap with partial leaves
      const isOverlapLeave = leaveRanges.some(leave => 
        slot.start < leave.end && leave.start < slot.end
      );
      if (isOverlapLeave) return false;

      // Overlap with booked appointments
      const isOverlapBooking = bookedRanges.some(booking => 
        slot.start < booking.end && booking.start < slot.end
      );
      if (isOverlapBooking) return false;

      // Filter out past slots if dateString is today
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      if (dateString === todayStr) {
        // Get current time in minutes since midnight
        const currentMins = today.getHours() * 60 + today.getMinutes();
        if (slot.start <= currentMins) return false; // Filter out past times
      }

      return true;
    });

    // 7. Format minutes back to 12-hour AM/PM strings
    return availableSlots.map(slot => formatMinutesTo12h(slot.start));
  }
}
