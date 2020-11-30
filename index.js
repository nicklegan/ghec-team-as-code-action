const core = require('@actions/core')
const github = require('@actions/github')

const EXCLUDE_BRANCHES = []

;(async () => {
  try {
    const token = core.getInput('repo-token', {required: true})
    const octokit = new github.getOctokit(token)

    const {owner, repo} = github.context.repo
    const org = owner

    const {
      pull_request: {
        base: {ref: team_slug}
      },
      pull_request: {number: pull_number}
    } = github.context.payload

    if (EXCLUDE_BRANCHES.includes(team_slug)) {
      core.setFailed('not merging into default branch')
      process.exit(0)
    }

    const {data: diff} = await octokit.pulls.get({
      owner,
      repo,
      pull_number,
      mediaType: {
        format: 'diff'
      }
    })

    const addMembers = diff
      .split('\n')
      .filter(function (s) {
        return s.match(/^[+](?![+])/)
      })
      .map(item => item.slice(1, item.indexOf(',')))

    for (const username of addMembers) {
      core.debug(`add member @${username} to @${org}/${team_slug}`)

      await octokit.teams.addOrUpdateMembershipForUserInOrg({
        org,
        team_slug,
        username
      })
    }

    const removeMembers = diff
      .split('\n')
      .filter(function (s) {
        return s.match(/^[-](?![-])/)
      })
      .map(item => item.slice(1, item.indexOf(',')))

    for (const username of removeMembers) {
      core.debug(`remove member @${username} from @${org}/${team_slug}`)

      await octokit.teams.removeMembershipForUserInOrg({
        org,
        team_slug,
        username
      })
    }
  } catch (err) {
    core.setFailed(err.message)
  }
})()
