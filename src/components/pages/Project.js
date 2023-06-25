import React, { useState, useEffect } from "react"
import { v4 as uuidv4} from 'uuid'

import { useParams } from "react-router-dom"

import Loading from "../layout/Loading"
import styles from "./Project.module.css"
import Container from "../layout/Container"
import Message from "../layout/Message"
import ProjectForm from "../project/ProjectForm"
import ServiceForm from "../service/ServiceForm"
import ServiceCard from "../service/ServiceCard"

function Project() {

    const { id } = useParams()

    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message, setMessage] = useState()
    const [type, setType] = useState()

    // código aabaixo realiza uma solicitação assíncrona para
    // obter os detalhes de um projeto com base no id fornecido.
    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then((resp) => resp.json())
                .then((data) => {
                    setProject(data)
                    setServices(data.service)
                })
                .catch(err => console.log(err))
        }, 300)
    }, [id])

    // função para atualização de projetos no banco de dados
    function editPost(project) {
        setMessage('')
        // budget validação
        if (project.budget < project.cost) {
            setMessage('O orçamento não pode ser menor que o custo do progeto!')
            setType('error')
            return false
        }

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
            .then(resp => resp.json())
            .then((data) => {
                setProject(data)
                setShowProjectForm(false)
                setMessage('Projeto atualizado!')
                setType('success')
            })
            .catch(err => console.log(err))
    }
    // função para receber os serviços e adicionar aos projeto
    function createService(project) {
        setMessage('')

        // last service
        const lastService = project.service[project.service.length - 1]

        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost

        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        // if pra verificar se passa do valor maximo de orçamento do projeto
        if(newCost > parseFloat(project.budget)) {
            setMessage('Orçamento ultrapassado, verifique o valor do serviço!')
            setType('error')
            project.service.pop()
            return false
        }

        // Adicionar valor do serviço ao total do projeto
        project.cost = newCost

        // Atualizar cost do projeto
        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
        .then((resp) => resp.json())
        .then((data) => {
            setShowServiceForm(false)
        })
        .catch(err => console.log(err))
    }

    // A função abaixo remove um serviço específico de um projeto. 
    // Ela filtra o serviço a ser removido do array de serviços do projeto,
    // atualiza o custo total do projeto e envia uma solicitação PATCH para 
    // atualizar o projeto no servidor. 
    function removeService(id, cost) {
        const serviceUpdated = project.service.filter(
            (service) => service.id !== id
        )

        const projectUpdated = project

        projectUpdated.service = serviceUpdated
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

        fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectUpdated)
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProject(projectUpdated)
            setServices(serviceUpdated)
            setMessage('Serviço removido com sucesso!')
        })
        .catch(err => console.log(err))

    }


    // Essas funções são utilizadas para controlar a visibilidade 
    // dos formulários de edição de projeto e adição de serviço
    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
    }

    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm)
    }

    return (
        <>
            {project.name ? (
                <div className={styles.project_details}>
                    <Container customClass="column">
                        {message && <Message type={type} msg={message} />}
                        <div className={styles.details_container}>
                            <h1>Projeto: {project.name}</h1>
                            <button className={styles.btn} onClick={toggleProjectForm}>
                                {!showProjectForm ? 'Editar projeto' : 'Fechar'}
                            </button>
                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p>
                                        <span>Categoria:</span> {project.category.name}
                                    </p>
                                    <p>
                                        <span>Total do Orçamento:</span> R${project.budget}
                                    </p>
                                    <p>
                                        <span>Total do Utilizado:</span> R${project.cost}
                                    </p>
                                </div>
                            ) : (
                                <div className={styles.project_info}>
                                    <ProjectForm
                                        handleSubmit={editPost}
                                        btnText="Concluir Edição"
                                        projectData={project}
                                    />
                                </div>
                            )}
                        </div>
                        <div className={styles.service_form_container}>
                            <h2>Adicione um serviço:</h2>
                            <button className={styles.btn} onClick={toggleServiceForm}>
                                {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
                            </button>
                            <div className={styles.project_info}>
                                {
                                    showServiceForm && (
                                        <ServiceForm 
                                            handleSubmit={createService}
                                            btnText="Adicionar Serviço"
                                            projectData={project}
                                        />
                                    )
                                }
                            </div>
                        </div>
                        <h2>Serviços</h2>
                        <Container customClass="start">
                            {services.length > 0 &&
                                services.map((service) => (
                                    <ServiceCard 
                                        id={service.id}
                                        name={service.name}
                                        cost={service.cost}
                                        description={service.description}
                                        key={service.id}
                                        handleRemove={removeService}
                                    />
                                ))
                            }
                            {services.length === 0 && <p>Não há serviços cadastrados</p>}
                        </Container>
                    </Container>
                </div>
            ) : (
                <Loading />
            )}
        </>
    )
}

export default Project