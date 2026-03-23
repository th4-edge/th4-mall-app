/**
 * 日志类,用于扩展日志记录
 * 1、控制日志输出等级
 * 2、控制日志输出渠道
 * @author SoMit
 */
class ILogger implements mall.Logger {
    debug(...args: any[]): void {
        console.debug(args)
    }

    error(...args: any[]): void {
        console.error(args)
    }

    info(...args: any[]): void {
        console.info(args)
    }

    log(...args: any[]): void {
        console.log(args)
    }

    warn(...args: any[]): void {
        console.warn(args)
    }
}

/**
 * 日志实例,便于统一管理日志
 * @author SoMit
 */
export const logger = new ILogger();