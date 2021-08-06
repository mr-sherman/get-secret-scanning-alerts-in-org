#!/usr/bin/env node

require('dotenv').config()
const pReduce = require('./lib/p-reduce');
const delay = require('delay');
const {Octokit} = require('@octokit/rest')


var buffer = ""
var base_url = ''

if (args.length > 0)
  base_url = args[1]

  if (base_url.length > 0)
  {
    octokit = new Octokit({
      auth: process.env.GH_AUTH_TOKEN,
      previews: ['dorian-preview'],
      baseUrl: base_url + '/api/v3'
    });
  }
  else
  {
    octokit = new Octokit({
      auth: process.env.GH_AUTH_TOKEN,
      previews: ['dorian-preview']
    });
  }

const [, , ...args] = process.argv
const owner = args[0]
console.log("org,repo,secret_type,secret,state,resolved_at, url")
octokit
  .paginate(octokit.repos.listForOrg, {
      org: owner,
    })
  .then(repositories =>
    pReduce(repositories, (repository) => {
      if (repository.archived) {
        return Promise.resolve();
      }
      const repo = repository.name

      return octokit
        .paginate("GET /repos/:owner/:repo/secret-scanning/alerts?per_page=100", {
          owner: owner,
          repo: repo
        })
        .then(alerts => {
          if (alerts.length > 0) {

            pReduce(alerts, (alert) => {
              console.log(`${owner},${repo},${alert.secret_type},${alert.secret},${alert.state},${alert.resolved_at},${alert.url}`)            }) 
          } 
          delay(300);
        })
        .catch(error => {
         // console.error(`Failed for ${owner}/${repo}\n${error.message}\n${error.documentation_url}`)
        })        
    })
    
  )
  .catch(error => {
    console.error(`Getting repositories for organization ${owner} failed.
    ${error.message} (${error.status})
    ${error.documentation_url}`)
  })
