const prompts = require('prompts');
const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const Spinner = require('cli-spinner').Spinner;

module.exports = async ({ logger, args }) => {
    const baseDir = path.resolve(__dirname);
    const templatePath = path.join(baseDir, '..', 'templates');
    const localPath = process.cwd();

    questoes = [
        {
            type: 'select',
            name: 'stack',
            message: 'Selecione a stack',
            choices: [
              { title: 'NextJs', value: 'nextjs' },
            ],
            initial: 0
        }
    ];

    const response = await prompts(questoes);

    let pathOrigem = path.join(templatePath, response.stack);
    const pathDestino = path.join(localPath, args.nome);

    if (fs.existsSync(pathOrigem)) {
        pathOrigem = path.join(pathOrigem, '*');
        logger.info('Copiando arquivos…');
        if (!fs.existsSync(pathDestino)) {
            fs.mkdirSync(pathDestino, { recursive: true });
        }
        shell.cp('-R', pathOrigem, pathDestino);
        logger.info('✔ Arquivos copiado!');
    } else {
        logger.error(`O template ${response.stack} não funciona.`)
        process.exit(1);
    }

    if (!shell.which('npm')) {
        shell.echo('Desculpa, é necessario ter o node instalado para seguir.');
        shell.exit(1);
    }

    let sp = new Spinner('%s instalando...');
    sp.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏');

    sp.start();
    shell.cd(pathDestino);
    shell.exec('npm install', (code, stdout, stderr) => {
        sp.stop();
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        logger.info('✔ Instalação Concluída!');

        sp.setSpinnerTitle('%s migrando sqlite...');
        sp.start();
        shell.exec('npx prisma migrate dev --name init', () => {
            sp.stop();
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            logger.info('✔ Migrações Feitas!');

            logger.info('✔ Processo concluído!');
        });
    });
}