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
        },
        {
            type: 'select',
            name: 'variante',
            message: 'Selecione um padrão',
            choices: [
              { title: 'Padrão', value: 'default' },
              { title: 'MVC', value: 'mvc'}
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

    const install = await prompts([{
        type: 'confirm',
        name: 'dependencies',
        message: 'Deseja instalar as dependencias',
        initial: false
    }]);

    if (install.dependencies) {
        if (!shell.which('npm')) {
            shell.echo('Desculpa, é necessario ter o node instalado para seguir.');
            shell.exit(1);
        }

        const sp = new Spinner('%s instalando...');
        sp.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏');
        sp.start();
        shell.cd(pathDestino);
        shell.exec('npm version', (code, stdout, stderr) => {
            sp.stop();
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            logger.info('✔ Instalação Concluída!');
        });
    } else {
        logger.info('✔ Processo concluído!');
    }

}