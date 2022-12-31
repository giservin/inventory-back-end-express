@Library("belajar-jenkins-shared-library@main") _

k8sPipeline([
    type: "backend",
    image_name: "giservintz/be-inventory-express",
    image_tag: "1.0.1",
    doBuild: false,
    dockerCredentials: "docker_login",
    deployment: "backend-express"
])