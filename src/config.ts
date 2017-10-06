const config = {
  id: process.env.UID || "1",
  psk: process.env.PSK || "pre-shared-key",
  port: parseInt(process.env.PORT || "",10) || 80,
  connectionTimeout: parseInt(process.env.TIMEOUT || "", 10) || 3000, // Miliseconds
}

export default config;
