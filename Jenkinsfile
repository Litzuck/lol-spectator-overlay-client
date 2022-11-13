void setBuildStatus(String message, String state) {
  step([
      $class: "GitHubCommitStatusSetter",
      reposSource: [$class: "ManuallyEnteredRepositorySource", url: "https://github.com/Litzuck/lol-spectator-overlay-client"],
      contextSource: [$class: "ManuallyEnteredCommitContextSource", context: "ci/jenkins/build-status"],
      errorHandlers: [[$class: "ChangingBuildStatusErrorHandler", result: "UNSTABLE"]],
      statusResultSource: [ $class: "ConditionalStatusResultSource", results: [[$class: "AnyBuildResult", message: message, state: state]] ]
  ]);
}

pipeline {
    agent {
        docker {
            image 'litzuck/node:wine-zip' 
            args '-p 3000:3000' 
        }
    }
    stages {
        stage("Git checkout"){
            steps{
                git branch: 'main', url: 'https://github.com/Litzuck/lol-spectator-overlay-client.git'
                setBuildStatus("Building ...", "PENDING");
            }
        }
        stage('Build Frontend'){
            steps{
                sh 'cd overlay-react && npm ci && npm run build'
                sh 'cp -r overlay-react/build build/'
                stash includes: 'build/**' , name: 'frontend'
            }
        }
        
        stage('Build APP') { 
            steps {
                unstash 'frontend'
                sh 'npm config set git-tag-version false && tag=$(git describe --tags | cut -d "v" -f 2 | cut -d "-" -f 1) && npm version $tag'
                sh 'npm ci && npm run make -- --platform win32'
            }
        }
        
        stage('Release'){
            when { tag "v*" }
            steps{
                withCredentials([string(credentialsId: 'github_release_token', variable: 'token')]) {
                sh '''
                    echo "Publishing on Github..."
                    # Get the last tag name
                    tag=$(git describe --tags)
                    version=$(echo $tag | cut -d "v" -f 2 | cut -d "-" -f 1)
                    # Get the full message associated with this tag
                    message="$(git for-each-ref refs/tags/$tag --format='%(contents)')"
                    # Get the title and the description as separated variables
                    name=$(echo "$message" | head -n1)
                    description=$(echo "$message" | tail -n +3)
                    description=$(echo "$description" | sed -z 's/\\n/\\n/g') # Escape line breaks to prevent json parsing problems
                    # Create a release
                    # release=$(curl -H \"Authorization:token $token\" --data \"{\\\"tag_name\\\": \\\"$tag\\\", \\\"target_commitish\\\": \\\"main\\\", \\\"name\\\": \\\"$name\\\", \\\"body\\\": \\\"$description\\\", \\\"draft\\\": true, \\\"prerelease\\\": true}\" https://api.github.com/repos/Litzuck/lol-spectator-overlay-client/releases)
                    release=$(curl -H \"Authorization:token $token\" https://api.github.com/repos/Litzuck/lol-spectator-overlay-client/releases/tags/$tag)
                    # Extract the id of the release from the creation response
                    id=$(echo "$release" | sed -n -e 's/"id":\\ \\([0-9]\\+\\),/\\1/p' | head -n 1 | sed 's/[[:blank:]]//g')
                    # Upload the artifact
                    curl -XPOST -H "Authorization:token $token" -H "Content-Type:application/octet-stream" --data-binary @out/make/zip/win32/x64/lol-esports-spectate-client-win32-x64-$version.zip https://uploads.github.com/repos/Litzuck/lol-spectator-overlay-client/releases/$id/assets?name=lol-esports-spectate-client-win32-x64-$version.zip
                '''
                } 
            }
        }
    }
    
    post{
        always{
            archiveArtifacts artifacts: 'out/**/*.zip', fingerprint: true, followSymlinks: false, onlyIfSuccessful: true
        }
        success{
            setBuildStatus("Build complete", "SUCCESS");
        }
        failure{
            setBuildStatus("Build failed", "FAILURE");
        }
    }
}