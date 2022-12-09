import { program } from 'commander';
import { Setting } from '../config/setting';
import * as fs from 'fs';
import * as path from 'path';

export const commandParser = () => {
    initCommandParaser();

    if (!fs.existsSync(program.opts().scan)) {
        console.log("错误: 扫描目录不存在");
    } else {
        program.opts().Scan = path.resolve(program.opts().scan);
        program.opts().scan = path.resolve(program.opts().scan);
    }
}

/**
 * 初始化参数解析器
 */
const initCommandParaser = () => {
    const settings: Setting = Setting.instance();
    program.command('proxy')
        .description("Set proxy.")
        .option('-h, --host <char>', 'Set host of proxy.', '127.0.0.1')
        .option('-p, --port <char>', 'Set port of proxy.', '7890')
        .action((str, options) => {
            const settings: Setting = Setting.instance();
            settings.proxy = {
                host: str.host,
                port: str.port
            }
            settings.isProxy = true;
            process.exit(-1);
        });

    program.command('account')
        .description("Set pica account.")
        .requiredOption('-e, --email <char>', 'Set email of pica.')
        .requiredOption('-p, --pwd <char>', 'Set password of pica.')
        .action((str, options) => {
            settings.account = {
                email: str.email,
                password: str.pwd
            }
            process.exit(-1);
        });
    program.command('compress')
        .description("Set compress info.")
        .requiredOption('-l, --level <number>', 'Set compression level.', '0')
        .action((str, options) => {
            if (str.level != undefined)
                if (isNaN(Number(str.level))) {
                    console.log("错误: 请输入正确的压缩等级。[0-9]");
                } else if (Number(str.level) < 0 || Number(str.level) > 9) {
                    console.log("错误: 请输入正确的压缩等级。[0-9]");
                } else {
                    settings.compressionLevel = Number(str.level);
                }
                process.exit(-1);
        });

    program.option('-o, --out <char>', 'Set dir of output.', settings.outputPath)
        .action((str, options) => {
            if (!fs.existsSync(str.out)) {
                console.log("错误: 输出目录不存在");
                process.exit(-1);
            } else {
                settings.outputPath = path.resolve(str.out);
            }
        });

    program.option('-s, --scan <char>', 'Set dir of scan.', process.cwd());
    program.parse();
}