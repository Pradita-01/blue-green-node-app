pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "YOUR_DOCKERHUB_USERNAME/blue-green-node-app"
        BLUE_CONTAINER = "node-blue"
        GREEN_CONTAINER = "node-green"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %DOCKER_IMAGE%:%BUILD_NUMBER% .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    bat 'docker login -u %DOCKER_USER% -p %DOCKER_PASSWORD%'
                    bat 'docker push %DOCKER_IMAGE%:%BUILD_NUMBER%'
                }
            }
        }

        stage('Deploy Blue') {
            steps {
                bat '''
                docker rm -f %BLUE_CONTAINER% 2>NUL || exit 0
                docker run -d --name %BLUE_CONTAINER% -p 3001:3000 -e VERSION=BLUE_%BUILD_NUMBER% %DOCKER_IMAGE%:%BUILD_NUMBER%
                '''
            }
        }

        stage('Test Blue') {
            steps {
                bat '''
                powershell -Command "$response = Invoke-WebRequest -UseBasicParsing http://localhost:3001/health; if ($response.StatusCode -ne 200) { exit 1 }"
                '''
            }
        }

        stage('Deploy Green') {
            steps {
                bat '''
                docker rm -f %GREEN_CONTAINER% 2>NUL || exit 0
                docker run -d --name %GREEN_CONTAINER% -p 3002:3000 -e VERSION=GREEN_%BUILD_NUMBER% %DOCKER_IMAGE%:%BUILD_NUMBER%
                '''
            }
        }

        stage('Test Green') {
            steps {
                bat '''
                powershell -Command "$response = Invoke-WebRequest -UseBasicParsing http://localhost:3002/health; if ($response.StatusCode -ne 200) { exit 1 }"
                '''
            }
        }

        stage('Switch Traffic to Green') {
            steps {
                bat '''
                docker stop %BLUE_CONTAINER% 2>NUL || exit 0
                docker rm %BLUE_CONTAINER% 2>NUL || exit 0
                '''
            }
        }
    }

    post {
        always {
            bat 'docker ps'
        }
    }
}