pipeline {

```
agent any

environment {

    FRONTEND_IMAGE = "nirbhay/frontend"
    BACKEND_IMAGE  = "nirbhay/backend"

    BUILD_NUMBER = "${env.BUILD_NUMBER}"

    SONAR_HOST_URL = "http://localhost:9000"
}

stages {

    stage('Checkout') {

        steps {
            git branch: 'main',
            url: 'https://github.com/YOUR_USERNAME/YOUR_REPO.git'
        }
    }

    stage('SonarQube Scan') {

        steps {

            withCredentials([
                string(
                    credentialsId: 'sonar-token',
                    variable: 'SONAR_TOKEN'
                )
            ]) {

                sh '''
                sonar-scanner \
                -Dsonar.projectKey=shopkart \
                -Dsonar.sources=. \
                -Dsonar.host.url=$SONAR_HOST_URL \
                -Dsonar.token=$SONAR_TOKEN
                '''
            }
        }
    }

    stage('OWASP Dependency Check') {

        steps {

            dependencyCheck additionalArguments: '--scan .',
            odcInstallation: 'OWASP-Dependency-Check'
        }
    }

    stage('Trivy FileSystem Scan') {

        steps {

            sh '''
            trivy fs . \
            --severity HIGH,CRITICAL \
            --exit-code 0
            '''
        }
    }

    stage('Build Frontend Image') {

        steps {

            dir('frontend') {

                sh '''
                docker build \
                -t $FRONTEND_IMAGE:$BUILD_NUMBER \
                -t $FRONTEND_IMAGE:latest .
                '''
            }
        }
    }

    stage('Build Backend Image') {

        steps {

            dir('backend') {

                sh '''
                docker build \
                -t $BACKEND_IMAGE:$BUILD_NUMBER \
                -t $BACKEND_IMAGE:latest .
                '''
            }
        }
    }

    stage('Trivy Image Scan') {

        steps {

            sh '''
            trivy image $FRONTEND_IMAGE:latest

            trivy image $BACKEND_IMAGE:latest
            '''
        }
    }

    stage('Push Docker Images') {

        steps {

            withCredentials([
                usernamePassword(
                    credentialsId: 'dockerpassword',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )
            ]) {

                sh '''
                echo $DOCKER_PASS | docker login \
                -u $DOCKER_USER \
                --password-stdin

                docker push $FRONTEND_IMAGE:$BUILD_NUMBER
                docker push $FRONTEND_IMAGE:latest

                docker push $BACKEND_IMAGE:$BUILD_NUMBER
                docker push $BACKEND_IMAGE:latest
                '''
            }
        }
    }

    stage('Update Kubernetes Images') {

        steps {

            sh '''

            kubectl set image deployment/frontend \
            frontend=$FRONTEND_IMAGE:$BUILD_NUMBER \
            -n shopkart

            kubectl set image deployment/backend \
            backend=$BACKEND_IMAGE:$BUILD_NUMBER \
            -n shopkart

            '''
        }
    }

    stage('Verify Rollout') {

        steps {

            sh '''

            kubectl rollout status \
            deployment/frontend \
            -n shopkart

            kubectl rollout status \
            deployment/backend \
            -n shopkart

            '''
        }
    }

    stage('Seed Database') {

        steps {

            sh '''
            kubectl delete job seed-db \
            -n shopkart \
            --ignore-not-found=true

            kubectl apply \
            -f k8s/seed-job.yaml
            '''
        }
    }
}

post {

    success {

        echo "Deployment Successful"
    }

    failure {

        echo "Deployment Failed"
    }
}
```

}
