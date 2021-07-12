# Get code scanning alerts in org 
This repo demonstrates how to use the GitHub code scanning API to export all the alerts on an organization to a CSV file. This makes it possible for a security team to quickly audit the known vulnerabilities across their organizations that are using GitHub Advanced Security

### Running the script
1. Clone this repo to your local machine
2. Create a file called .env 
3. Create a [GitHub Token](https://github.com/settings/tokens) which has the `repo` > `security_events` permission. (`repo` permission is needed for private repo)
4. Add the token to your .env file as shown `GH_AUTH_TOKEN= <insert token here>`
55. Run `npm install` to install node dependencies
6. Run `node get-secret-scanning-alerts.js org > output.csv` where `org` is the name of your target organization. Note, if SSO is enabled on your org, you will need to SSO enable your token.
    * Optionally, you can run `node get-secret-scanning-alerts.js 'org' http://enterprise.github.yourcompany.com > output.csv` where the optional second parameter is your github enterprise base URL.  Do not include the trailing '/' in the URL.  

### License
This project is licensed under the MIT License. 
