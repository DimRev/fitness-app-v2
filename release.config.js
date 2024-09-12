module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer', // Analyzes commit messages to determine version bump
    '@semantic-release/release-notes-generator', // Generates release notes
    '@semantic-release/changelog', // Updates your changelog file
    '@semantic-release/github', // Publishes release on GitHub
    '@semantic-release/git', // Updates the version in package.json and creates a commit
  ],
}
