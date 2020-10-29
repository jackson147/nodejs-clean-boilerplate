node {
    def app
    def props = readJSON file: 'package.json'
    def version = props['version']

    def remote = [:]
    remote.name = "dev-server"
    remote.host = "newlinkedlist.xyz"
    remote.allowAnyHosts = true


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

            docker.build("jackson147/nodejs-clean-boilerplate")
        }
    }
}