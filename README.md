## GHEC Team as Code Action

>A GitHub Action to update team membership by pull request based on the changed content of a CSV file.

[![Test](https://github.com/ActionsDesk/ghec-report-reinvite-action/workflows/Test/badge.svg)](https://github.com/nicklegan/ghec-team-as-code-action/actions?query=workflow%3ATest) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

### Workflow

```yml

name: Team as Code

on:
  pull_request:
    branches-ignore: [main]
    paths: ['**.csv']
    types: [closed]

jobs:
  team_as_code:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Add or remove team members
        uses: nicklegan/ghec-team-as-code-action@main
        with:
          repo-token: ${{ secrets.TEAM_AS_CODE_TOKEN }}
```

### Secrets

| Name                  | Value                                                      | Required |
| :------------         | :--------------------------------------------------------- | :------- |
| `TEAM_AS_CODE_TOKEN`  | A `admin:org`, `repo` scoped [PAT]                         | `true`   |
| `ACTIONS_STEP_DEBUG`  | `true` [Enables diagnostic logging]                        | `false`  |

### Team

Create a branch with an identical name as the targeted team in the same organization. Place the included workflow file inside`.github/workflows`. To run the Action in the same repository a `0-team-template` branch is included which can be used as a source for creating new branches.

### Members

1. Add a CSV file in the branch which includes the current team members.
2. Use the below CSV layout. Only the Username column is required.
```
Username, Full Name
Octocat, Mona Lisa Octocat
Hubot, Hubot Robot
```
3. Enable [branch protection] and add a [CODEOWNERS] file. 
4. Update team members by opening a pull request. 
5. Edit the CSV file to add and/or remove team members.
6. Merge the pull request to trigger the Action.

### License

- [MIT License](./license)

[pat]: https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token 'Personal Access Token'

[Enables diagnostic logging]: https://docs.github.com/en/actions/managing-workflow-runs/enabling-debug-logging#enabling-runner-diagnostic-logging 'Enabling runner diagnostic logging'

[branch protection]: https://docs.github.com/en/free-pro-team@latest/github/administering-a-repository/configuring-protected-branches 'Configuring protected branches'

[CODEOWNERS]: https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/about-code-owners 'About code owners'