pipeline {
    agent none

    stages {
        stage('Build') {
            steps {
                echo 'Building...'
                sh 'npm install'
                sh 'npx node-sass --omit-source-map-url sass/styles.scss public/stylesheets/styles.css'
                sh 'mkdir models/db'
                sh 'mkdir public/images/ratings'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing...'
                sh 'jest -i'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying...'
                sh 'shutdown -r now'
            }
        }
    }
}