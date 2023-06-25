import React from "react"
import { useNavigate } from 'react-router-dom'

import styles from './NewProject.module.css'
import ProjectForm from "../project/ProjectForm"

function NewProject() {

    const history = useNavigate()

    // essa função representa um componente de criação de projetos. 
    // Ao preencher e enviar o formulário no componente ProjectForm, a função createPost é chamada. 
    // Essa função faz uma solicitação de POST para criar um projeto 
    // no servidor em http://localhost:5000/projects. Após a conclusão da solicitação, 
    // é exibida uma mensagem de sucesso e o usuário é redirecionado para a rota /projects usando a função history().
    function createPost(project) {

        // inicializar cost e serviços
        project.cost = 0
        project.service = []

        fetch('http://localhost:5000/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
            .then((resp) => resp.json())
                .then((data) => {
                    console.log(data)
                    //redirect
                    history('/projects', {state: {message: 'Projeto criado com sucesso'}})
                })
            .catch(err => console.log(err))
    }


    return (
        <div className={styles.newproject_container}>
            <h1>Criar Projeto</h1>
            <p>Crie seu projeto para depois adicionar os serviços</p>
            <ProjectForm handleSubmit={createPost} btnText="Criar Projeto" />
        </div>
    )
}

export default NewProject