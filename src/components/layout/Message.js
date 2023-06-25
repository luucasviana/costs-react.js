import React, { useState, useEffect } from "react"

import styles from './Message.module.css'


// esse função cria um componente de mensagem que exibe uma mensagem por um determinado período de tempo e, em seguida, a oculta
function Message({ type, msg }) {

    const [visible, setVisible] = useState(false)

    useEffect(() => {

        if (!msg) {
            setVisible(false)
            return
        }

        setVisible(true)

        const timer = setTimeout(() => {
            setVisible(false)
        }, 3000)

        return () => clearTimeout(timer)

    }, [msg])

    return (
        <>
            {visible && (
                <div className={`${styles.message} ${styles[type]}`}>{msg}</div>
            )}
        </>
    )
}

export default Message