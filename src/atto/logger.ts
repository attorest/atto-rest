// import { transports, format, createLogger } from 'winston';
// const LOGS_DIR = process.env.LOGS_DIR || './logs';

// export default createLogger({
//   level: 'info',
//   format: format.json(),
//   transports: [
//     new transports.File({ filename: `${LOGS_DIR}/error.log`, level: 'error' }),
//     process.env.NODE_ENV === 'production' 
//       ? new transports.File({ filename: `${LOGS_DIR}/combined.log` })
//       : new transports.Console({ format: format.simple() })
//   ]
// });
