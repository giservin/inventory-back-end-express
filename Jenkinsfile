pipeline {
    agent none
    triggers {
        githubPush()
    }
    environment {
        IMAGE_NAME = "giservintz/be-inventory-express"
        IMAGE_TAG = "1.0.1"
    }
    stages {
        stage("Build Image") {
            agent {
                node {
                    label "agent-one"
                }
            }
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                withCredentials([usernamePassword(
                    credentialsId: "docker_login",
                    usernameVariable: "DOCKER_USER",
                    passwordVariable: "DOCKER_PASSWORD"
                )]){
                    sh 'docker login -u $DOCKER_USER -p $DOCKER_PASSWORD'
                    sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }
    }
    post {
        failure {
            node("agent-one") {
                sh "docker image prune -f"
            }
        }
    }
}