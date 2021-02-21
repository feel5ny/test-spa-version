const prompts = require("prompts");
const gittags = require("git-tags");
const shell = require("shelljs");
const semverDiff = require("semver-diff");

let tagList = [];
gittags.get(function (err, tags) {
  if (err) throw err;
  tagList = tags.map((v) => ({ title: v, value: v }));
  // ['1.0.1', '1.0.0', '0.1.0-beta']
  //   prompts.override(require("yargs").argv);
  (async () => {
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
        choices: tagList,
        initial: 1,
      },
    ]);
    const remove = tagList.reduce(
      (acc, { value }) => (
        !semverDiff(value.slice(1), response.value) && acc.push(value), acc
      ),
      []
    );
    console.log(remove);
    remove.forEach((tag) => shell.exec(`git tag -d ${tag}`));
    // console.log(reset.stdout);
    // if (reset.code !== 0) {
    //   shell.echo("Error: Git commit failed");
    //   shell.exit(1);
    // }
    // Run external tool synchronously
    // const commit = shell.exec(`git rev-parse --verify ${response.value}~1`);
    // if (commit.code !== 0) {
    //   shell.echo("Error: Git commit failed");
    //   shell.exit(1);
    // }
    // const reset = shell.exec(`git reset --hard ${commit.stdout}`);
    // console.log(reset.stdout);
    // if (reset.code !== 0) {
    //   shell.echo("Error: Git commit failed");
    //   shell.exit(1);
    // }
  })();
});
