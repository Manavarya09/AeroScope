export const formatAltitude = (altitude: string): string => {
  const alt = parseInt(altitude);
  if (isNaN(alt)) return altitude;
  return `${alt.toLocaleString()} ft`;
};

export const formatSpeed = (speed: string): string => {
  const spd = parseInt(speed);
  if (isNaN(spd)) return speed;
  return `${spd} kts`;
};

export const formatTime = (time: string): string => {
  // Simple time formatting, could be enhanced
  return time;
};

export const formatFlightNumber = (flightNumber: string): string => {
  return flightNumber;
};
