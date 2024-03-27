/*
 * @Author: Poison02 2069820192@qq.com
 * @Date: 2024-01-19 22:53:24
 * @LastEditors: Poison02 2069820192@qq.com
 * @LastEditTime: 2024-03-27 20:51:08
 * @FilePath: /geekedu-admin/src/components/day-week-month/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import styles from './index.module.scss'

interface PropInterface {
  active: boolean
  onChange: (start_at: any, end_at: any) => void
}

export function DayWeekMonth(props: PropInterface) {
  const [loading, setLoading] = useState<boolean>(false)
  const [current, setCurrent] = useState(0)
  const [tabs, setTabs] = useState<any>([])

  useEffect(() => {
    let tabs = []
    if (props.active) {
      tabs = [
        { id: 7, name: '周' },
        { id: 30, name: '月' },
      ]
    }
    else {
      tabs = [
        { id: 1, name: '日' },
        { id: 7, name: '周' },
        { id: 30, name: '月' },
      ]
    }
    setTabs(tabs)
  }, [props.active])

  const change = (key: number, index: number) => {
    setCurrent(index)
    let start_at = null
    const end_at = moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
    if (key === 1)
      start_at = moment().format('YYYY-MM-DD HH:mm:ss')
    else if (key === 7)
      start_at = moment().subtract(6, 'days').format('YYYY-MM-DD HH:mm:ss')
    else if (key === 30)
      start_at = moment().subtract(29, 'days').format('YYYY-MM-DD HH:mm:ss')

    props.onChange(start_at, end_at)
  }

  return (
    <>
      <div
        className={
          props.active ? styles['controls-act-box'] : styles['controls-box']
        }
      >
        {tabs.length > 0
        && tabs.map((item: any, index: number) => (
          <div
            key={index}
            id={item.id}
            className={
                current === index ? styles['act-item'] : styles.item
              }
            onClick={() => change(item.id, index)}
          >
            {item.name}
          </div>
        ))}
      </div>
    </>
  )
}
