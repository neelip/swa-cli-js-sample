const psList = require('ps-list');
const psnode = require('ps-node');
(async () => {
    const list = await psList();
    const filtered = list.filter((p) => p.cmd.includes('azure-functions-core-tools/bin/workers/node'));
    console.log('cmd: ', filtered[0]?.name ?? 'Not found');
    console.log('pid: ', filtered[0]?.pid ?? 'Not found');

    psnode.lookup({
    }, (error, list) => {
        const node = list.filter((p) => p.command.includes('node'));
        const nodejsWorker = node.find((p) => p.arguments.some((value) => value.includes('nodejsWorker.js')));
        console.log(nodejsWorker);
    })
})();