node {
    def app
    def props = readJSON file: 'package.json'
    def version = props['version']

    def remote = [:]
    remote.name = "dev-server"
    remote.host = "newlinkedlist.xyz"
    remote.allowAnyHosts = true


    stage('Clone repository') {
        checkout scm
    }

    stage('Install dependencies') {
        sh 'npm install'
    }
    
    stage('Test') {
        sh 'npm test'
    } 

    stage('Build image') {
        docker.build("jackson147/nodejs-clean-boilerplate")
    }
}