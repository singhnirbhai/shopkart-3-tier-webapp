pipeline {
agent any

stages {

    stage('Checkout') {
        steps {
            git branch: 'main',
            url: 'https://github.com/singhnirbhai/shopkart-3-tier-webapp.git'
        }
    }

    stage('Build Frontend') {
        steps {
            dir('Frontend') {
                sh 'docker build -t frontend:test .'
            }
        }
    }

    stage('Build Backend') {
        steps {
            dir('backend') {
                sh 'docker build -t backend:test .'
            }
        }
    }

    stage('Verify') {
        steps {
            sh 'docker images'
        }
    }
}

}
