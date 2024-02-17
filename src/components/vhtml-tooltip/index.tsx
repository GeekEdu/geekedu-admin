import React, { useEffect, useState } from 'react'
import { Tooltip } from 'antd'
import { color } from 'echarts'
import styles from './index.module.scss'

interface PropInterface {
  label: any
}

export const VhtmlTooltip: React.FC<PropInterface> = ({ label }) => {
  const [title, setTitle] = useState('')

  useEffect(() => {
    if (!label) {
      setTitle('')
      return
    }
    const value = removeHtmlStyle(label)
    if (value.length > 7 && window.innerWidth >= 1700) {
      setTitle(`${value.slice(0, 7)}...`)
      return
    }
    else if (value.length > 6 && window.innerWidth >= 1600) {
      setTitle(`${value.slice(0, 6)}...`)
      return
    }
    else if (value.length > 4 && window.innerWidth < 1600) {
      setTitle(`${value.slice(0, 4)}...`)
      return
    }
    setTitle(value)
    console.log(label)
  }, [label])

  const removeHtmlStyle = (html: any) => {
    const relStyle = /style\s*?=\s*?([‘"])[\s\S]*?\1/g // 去除样式
    const relTag = /<.+?>/g // 去除标签
    const relClass = /class\s*?=\s*?([‘"])[\s\S]*?\1/g // 清除类名
    let newHtml = ''
    if (html) {
      newHtml = html.replace(relStyle, '')
      newHtml = newHtml.replace(relTag, '')
      newHtml = newHtml.replace(relClass, '')
    }
    return newHtml
  }

  return (
    <div className={styles['cursor-pointer']}>
      <Tooltip
        placement="top"
        title={(
          <div
            style={{ color: '#333333' }}
            dangerouslySetInnerHTML={{ __html: label }}
          >
          </div>
        )}
        color="#ffffff"
      >
        <div>{title}</div>
      </Tooltip>
    </div>
  )
}
