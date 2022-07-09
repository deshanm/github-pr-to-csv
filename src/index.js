#!/usr/bin/env node

import yargs from 'yargs/yargs'
import { getPullRequests } from './github-api.js'
import { createObjectCsvWriter } from 'csv-writer'

import { hideBin } from 'yargs/helpers'

const getCsvWriter = (filePath) => {
    return createObjectCsvWriter({
        path: filePath,
        header: [
            { id: 'number', title: 'number' },
            { id: 'url', title: 'url' },
            { id: 'title', title: 'title' },
            { id: 'merged_at', title: 'merged_at' },
            { id: 'labels', title: 'labels' },
        ],
    })
}

const printToCsvFile = (fileName, items) => {
    const filePath = `./out_put/${fileName}.csv`
    const csvWriter = getCsvWriter(filePath)

    csvWriter
        .writeRecords(
            items.map((item) => ({
                number: item.number,
                title: item.title,
                url: item.pull_request.html_url,
                merged_at: item.pull_request.merged_at.substring(0, 10),
                labels: item.labels.map((label) => label.name),
            }))
        )
        .then(() =>
            console.log(`The CSV file was written successfully - ${filePath}`)
        )
}

const start = async (data) => {
    const [res1, res2, res3] = await Promise.all([
        getPullRequests({ ...data, per_page: 100, page: 1 }),
        getPullRequests({ ...data, per_page: 100, page: 2 }),
        getPullRequests({ ...data, per_page: 100, page: 3 }),
    ])
    const items = [...res1.items, ...res2.items, ...res3.items]
    console.log('item length', items.length)
    printToCsvFile(data.repo, items)
}

const cli = () => {
    const argv = yargs(hideBin(process.argv)).argv

    if (argv.p === 1) {
        start({ owner: 'chartjs', repo: 'Chart.js', labels: ['type: bug'] })
    } else if (argv.p === 2) {
        start({ owner: 'expressjs', repo: 'express', labels: ['bug'] })
    } else if (argv.p === 3) {
        start({
            owner: 'facebook',
            repo: 'create-react-app',
            labels: ['issue: bug', 'tag: bug fix', 'issue: bug report'],
        })
    } else if (argv.p === 4) {
        start({ owner: 'lodash', repo: 'lodash', labels: ['bug'] })
    } else if (argv.p === 5) {
        start({ owner: 'mrdoob', repo: 'three.js', labels: ['Bug'] })
    } else {
        console.log(`
            You need to type following command to run specific project
            chartjs          ==>  npm run start1
            expressjs        ==>  npm run start2
            create-react-app ==>  npm run start3
            lodash           ==>  npm run start4
            three.js         ==>  npm run start5
        `)
    }
}
cli()
