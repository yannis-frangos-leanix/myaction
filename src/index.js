const core = require('@actions/core');
const exec = require('@actions/exec');
const github = require('@actions/github');

async function run() {
  try {
    // Checkout repository

    // Get the repository information
    const repo = github.context.repo;

    // Clone the repository
    await exec.exec(`git clone https://github.com/${repo.owner}/${repo.repo}.git`);

    // Set up JDK
    await exec.exec('wget -qO - https://adoptopenjdk.jfrog.io/adoptopenjdk/api/gpg/key/public | sudo apt-key add -');
    await exec.exec('echo "deb https://adoptopenjdk.jfrog.io/adoptopenjdk/deb/ $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/adoptopenjdk.list');
    await exec.exec('sudo apt-get update');
    await exec.exec('sudo apt-get install adoptopenjdk-21-hotspot');

    // Setup Gradle
    await exec.exec('wget https://services.gradle.org/distributions/gradle-7.2-bin.zip');
    await exec.exec('sudo mkdir /opt/gradle');
    await exec.exec('sudo unzip -d /opt/gradle gradle-7.2-bin.zip');
    await exec.exec('export PATH=$PATH:/opt/gradle/gradle-7.2/bin');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();