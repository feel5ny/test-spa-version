const prompts = require("prompts");
const gittags = require("git-tags");
const shell = require("shelljs");
const semverDiff = require("semver-diff");
const remoteGitTags = require("remote-git-tags");

let localTag = [];
gittags.get(function (err, tags) {
  if (err) throw err;
  localTag = tags.map((v) => ({ title: v, value: v }));

  (async () => {
    const remoteTag = [
      ...(await remoteGitTags("https://github.com/feel5ny/test-spa-version")),
    ].map(([v]) => ({ title: v, value: v }));
    console.log(remoteTag);
    const response = await prompts([
      {
        type: "toggle",
        name: "value",
        message: "정말로 롤백을 진행하시려합니까?",
        initial: true,
        active: "yes",
        inactive: "no",
      },
      {
        type: "select",
        name: "value",
        message: "태그버전을 선택해주세요",
        choices: remoteTag,
        initial: 1,
      },
    ]);

    const commit = shell.exec(`git rev-parse --verify ${response.value}~1`);
    if (commit.code !== 0) {
      shell.echo("Error: Git commit failed");
      shell.exit(1);
    }
    const reset = shell.exec(`git reset --soft ${commit.stdout}`);
    if (reset.code !== 0) {
      shell.echo("Error: Git reset failed");
      shell.exit(1);
    }
    const remove = remoteTag.reduce(
      (acc, { value }) => (
        !semverDiff(value.slice(1), response.value) && acc.push(value), acc
      ),
      []
    );
    remove.forEach((tag) => {
      shell.exec(`git tag -d ${tag}`);
      shell.exec(`git push origin -d ${tag}`);
    });
    const push = shell.exec(`git push -f origin master`);
    if (push.code !== 0) {
      shell.echo("Error: Git push failed");
      shell.exit(1);
    }
  })();
});
