import { Native } from 'sentry-expo';
import type { SeverityLevel, Extras as SentryExtras } from '@sentry/types';

type Extras = SentryExtras | Error;

class Logger {
  constructor() {}

  /**
   * Central logging method.
   * @param logLevel
   * @param message
   * @param extra
   */
  public message(
    logLevel: SeverityLevel,
    message: string,
    _extra?: Extras,
  ): void {
    const extra = _extra instanceof Error ? { error: _extra } : _extra; // Allow passing Error to logger.error

    if (logLevel != 'debug') {
      Native.captureMessage(message, { level: logLevel, extra });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[logger]', message, extra);
    }
  }

  public debug(message: string, extra?: Extras) {
    this.message('debug', message, extra);
  }
  public log(message: string, extra?: Extras) {
    this.message('info', message, extra);
  }
  public warn(message: string, extra?: Extras) {
    this.message('warning', message, extra);
  }
  public error(message: string, extra?: Extras) {
    this.message('error', message, extra);
  }
}

export const logger = new Logger();
