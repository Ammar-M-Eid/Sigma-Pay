pipeline {
  agent any
  tools { nodejs 'Node 22' }
  options { timestamps(); timeout(time: 30, unit: 'MINUTES') }
  stages {
    stage('Install') {
      steps {
        dir('backend-server') { bat 'npm ci' }
        dir('frontend-client') { bat 'npm ci' }
      }
    }
    stage('Test and coverage') {
      steps {
        dir('backend-server') { bat 'npm test' }
      }
      post { always { archiveArtifacts artifacts: 'backend-server/coverage/lcov.info', allowEmptyArchive: true } }
    }
    stage('Build') {
      steps {
        dir('frontend-client') { bat 'npm run build' }
        bat 'docker compose build'
      }
    }
    stage('SonarQube quality gate') {
      when { environment name: 'SONAR_ENABLED', value: 'true' }
      steps {
        withSonarQubeEnv('SigmaPay SonarQube') {
          bat 'sonar-scanner'
        }
        timeout(time: 5, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }
    stage('Publish images to GHCR') {
      when {
        allOf {
          branch 'main'
          anyOf {
            environment name: 'SONAR_ENABLED', value: 'false'
            not { environment name: 'SONAR_ENABLED', value: 'true' }
          }
        }
      }
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: 'ghcr', usernameVariable: 'GHCR_USER', passwordVariable: 'GHCR_TOKEN')]) {
            env.GHCR_NAMESPACE = env.GHCR_USER.toLowerCase()
            def imageTag = (env.GIT_COMMIT ?: "build-${env.BUILD_NUMBER}").take(12)
            bat """
              echo %GHCR_TOKEN% | docker login ghcr.io -u %GHCR_USER% --password-stdin
              docker build --target runtime -t ghcr.io/%GHCR_NAMESPACE%/sigmapay-backend:latest -t ghcr.io/%GHCR_NAMESPACE%/sigmapay-backend:sha-${imageTag} backend-server
              docker build --build-arg REACT_APP_API_URL=http://localhost:3001 -t ghcr.io/%GHCR_NAMESPACE%/sigmapay-frontend:latest -t ghcr.io/%GHCR_NAMESPACE%/sigmapay-frontend:sha-${imageTag} frontend-client
              docker push ghcr.io/%GHCR_NAMESPACE%/sigmapay-backend:latest
              docker push ghcr.io/%GHCR_NAMESPACE%/sigmapay-backend:sha-${imageTag}
              docker push ghcr.io/%GHCR_NAMESPACE%/sigmapay-frontend:latest
              docker push ghcr.io/%GHCR_NAMESPACE%/sigmapay-frontend:sha-${imageTag}
              docker logout ghcr.io
            """
          }
        }
      }
    }
  }
  post {
    always { cleanWs() }
    success { echo 'Build, tests, coverage, and SonarQube analysis completed.' }
  }
}
