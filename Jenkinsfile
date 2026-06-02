pipeline {


agent any

environment {

    FRONTEND_IMAGE = "nirbhaisingh/frontend"
    BACKEND_IMAGE  = "nirbhaisingh/backend"

    IMAGE_TAG = "${BUILD_NUMBER}"

    SONAR_HOST_URL = "http://localhost:9000"
}

stages {

    stage('Checkout') {
        steps {
            git branch: 'main',
            url: 'https://github.com/singhnirbhai/shopkart-3-tier-webapp.git'
        }
    }

    stage('SonarQube Scan') {
        steps {

            script {
          def scannerHome = tool 'sonar-scanner'

            echo "Scanner Path: ${scannerHome}"

            withCredentials([
                string(
                    credentialsId: 'sonar-scanner',
                    variable: 'SONAR_TOKEN'
                )
            ]) {

                sh """
                ${scannerHome}/bin/sonar-scanner \
                -Dsonar.projectKey=shopkart \
                -Dsonar.sources=. \
                -Dsonar.host.url=http://localhost:9000 \
                -Dsonar.token=${SONAR_TOKEN}
                """
            }
          }
        }
    }

   /* stage('OWASP Dependency Check') {
        steps {
            dependencyCheck(
                additionalArguments: '--scan .',
                odcInstallation: 'OWASP-Dependency-Check'
            )
        }
    }
*/
    stage('Trivy Filesystem Scan') {
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

            dir('Frontend') {

                sh '''
                docker build \
                -t $FRONTEND_IMAGE:$IMAGE_TAG \
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
                -t $BACKEND_IMAGE:$IMAGE_TAG \
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

    stage('DockerHub Login') {

        steps {

            withCredentials([
                usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )
            ]) {

                sh '''
                echo $DOCKER_PASS | docker login \
                -u $DOCKER_USER \
                --password-stdin
                '''
            }
        }
    }

    stage('Push Frontend Image') {
        steps {

            sh '''
            docker push $FRONTEND_IMAGE:$IMAGE_TAG
            docker push $FRONTEND_IMAGE:latest
            '''
        }
    }

    stage('Push Backend Image') {
        steps {

            sh '''
            docker push $BACKEND_IMAGE:$IMAGE_TAG
            docker push $BACKEND_IMAGE:latest
            '''
        }
    }

    stage('Deploy Kubernetes Resources') {

        steps {

            sh '''

            kubectl apply -f k8s/namespace.yaml 

            kubectl apply -f k8s/mongodb-pvc.yaml

            kubectl apply -f k8s/mongodb-deployment.yaml
            kubectl apply -f k8s/mongodb-service.yaml

            sleep 20

            kubectl apply -f k8s/backend-deployment.yaml
            kubectl apply -f k8s/backend-service.yaml

            kubectl apply -f k8s/frontend-deployment.yaml
            kubectl apply -f k8s/frontend-service.yaml

            kubectl apply -f k8s/ingress.yaml

            '''
        }
    }

    stage('Run Seed Job') {

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

    stage('Update Images') {

        steps {

            sh '''

            kubectl set image deployment/frontend \
            frontend=$FRONTEND_IMAGE:$IMAGE_TAG \
            -n shopkart

            kubectl set image deployment/backend \
            backend=$BACKEND_IMAGE:$IMAGE_TAG \
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
}

post {

    success {

        echo "Pipeline Completed Successfully"
    }

    failure {

        echo "Pipeline Failed"
    }

    always {

        sh 'docker image prune -f || true'
    }
}


}
