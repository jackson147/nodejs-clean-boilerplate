node {
    def app
    def props
    def version

    def remote = [:]
    remote.name = "dev-server"
    remote.host = "newlinkedlist.xyz"
    remote.allowAnyHosts = true


    stage('Clone repository') {
        /* Let's make sure we have the repository cloned to our workspace */

        checkout scm
        props = readJSON file: 'package.json'
        version = props['version']
    }

    stage('Install dependencies') {
        sh 'npm install'
    }
     
    stage('Test') {
        sh 'npm test'
    } 

    stage('Build image') {
        /* This builds the actual image; synonymous to
        * docker build on the command line */

        app = docker.build("jackson147/nodejs-clean-boilerplate")
    }
}