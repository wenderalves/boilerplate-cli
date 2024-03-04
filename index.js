#!/usr/bin/env node

const { program } = require("@caporal/core")
const createCmd = require('./lib/create')

program
    .command("new", "Create boilerplate micro-saas")
    .argument("<nome>", "Nome do projeto")
    .action(createCmd)

program.run()