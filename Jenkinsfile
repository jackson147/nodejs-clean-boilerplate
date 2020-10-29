def app
def props
def version

def remote = [:]
remote.name = "dev-server"
remote.host = "newlinkedlist.xyz"
remote.allowAnyHosts = true

pipeline {

    agent any

    tools {nodejs "node"}

    stages {    


        stage('Clone repository') {
            steps {
                /* Let's make sure we have the repository cloned to our workspace */

                checkout scm
                // props = readJSON file: 'package.json'
                // version = props['version']
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        } 

        stage('Build image') {
            steps {
                /* This builds the actual image; synonymous to
                * docker build on the command line */

                script {
                    docker.build("jackson147/nodejs-clean-boilerplate")
                }
            }
        }

        stage('Push image') {
            steps {
            /* Finally, we'll push the image with two tags:
            * First, the incremental build number from Jenkins
            * Second, the 'latest' tag.
            * Pushing multiple tags is cheap, as all the layers are reused. */
                script{
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                        app.push(version)
                        app.push("latest")
                    }
                }
            }
        }
    }
}