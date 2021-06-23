pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                sh 'npm install'
                sh 'node-sass --omit-source-map-url sass/styles.scss public/stylesheets/styles.css'
                sh 'mkdir models/db'
                sh 'mkdir public/images/'
                sh 'mkdir public/images/covers'
                sh 'mkdir public/images/ratings'
            }
        }
        stage('Test') {
            steps {
                echo 'To be implemented'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
                sh 'npm start'
            }
        }
    }
}