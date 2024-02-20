import { Button } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LeftOutlined } from '@ant-design/icons'
import styles from './index.module.scss'

interface PropInterface {
  title: string
}

export function BackBartment(props: PropInterface) {
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  return (
    <div className={styles['back-bar-box']}>
      <Button
        style={{ paddingLeft: 0 }}
        icon={<LeftOutlined />}
        type="link"
        onClick={() => navigate(-1)}
      >
        返回
      </Button>
      <div className={styles.line}></div>
      <div className={styles.name}>{props.title}</div>
    </div>
  )
}
