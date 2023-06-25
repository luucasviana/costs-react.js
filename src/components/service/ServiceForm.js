import React, { useState } from 'react'

import Input from '../form/Input'
import SubmitButton from '../form/SubmitButton'

import styles from '../project/ProjectForm.module.css'

function ServiceForm({handleSubmit, btnText, projectData}) {

    const [service, setService] = useState([])

    // função para lidar com o evento de submissão do formulário (serve para implementar mais serviços)
    function submit(e) {
        e.preventDefault()
        projectData.service.push(service)
        handleSubmit(projectData)
    }
    // função para lidar com as alterações nos campos de entrada do formulário
    function handleChange(e) {
        setService({ ...service, [e.target.name]: e.target.value})
    }

    return (
        <form onSubmit={submit} className={styles.form}>
            <Input 
                type="text"
                text="Nome do serviço"
                name="name"
                placeholder="Insira o nome do serviço"
                handleOnChange={handleChange}
            />
            <Input 
                type="number"
                text="Custo do serviço"
                name="cost"
                placeholder="Insira o valor do serviço"
                handleOnChange={handleChange}
            />
            <Input 
                type="text"
                text="Descrição do serviço"
                name="description"
                placeholder="Descreva o serviço"
                handleOnChange={handleChange}
            />
            <SubmitButton text={btnText} />
        </form>
    )
}

export default ServiceForm