import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { loginAction } from '../../store/user/loginUserSlice'
import type {
  SystemConfigStoreInterface,
} from '../../store/system/systemConfigSlice'
import {
  saveConfigAction,
} from '../../store/system/systemConfigSlice'

import { setEnabledAddonsAction } from '../../store/enabledAddons/enabledAddonsConfigSlice'

interface Props {
  loginData?: any
  configData?: any
  addonsData?: any
}

function InitPage(props: Props) {
  const dispatch = useDispatch()
  const [init, setInit] = useState<boolean>(false)

  // 组件刚开始的useEffect钩子初始化
  useEffect(() => {
    // 配置用户信息
    if (props.loginData)
      dispatch(loginAction(props.loginData))

    // 配置 系统配置
    if (props.configData) {
      const config: SystemConfigStoreInterface = {
        system: {
          logo: props.configData.system.logo,
          url: {
            api: props.configData.system.url.api,
            wx: props.configData.system.url.wx,
            pc: props.configData.system.url.pc,
          },
        },
        video: {
          default_service: props.configData.video.default_service,
        },
      }
      dispatch(saveConfigAction(config))
    }

    // 配置权限信息
    if (props.addonsData) {
      const enabledAddons: any = {}
      let count = 0
      for (let i = 0; i < props.addonsData.length; i++) {
        if (props.addonsData[i].enabled) {
          count += 1
          enabledAddons[props.addonsData[i].sign] = 1
        }
      }
      dispatch(setEnabledAddonsAction({ addons: enabledAddons, count }))
    }
    setInit(true)
  }, [props])

  return (
    <>
      {init && (
        <div>
          <Outlet />
        </div>
      )}
    </>
  )
}

export default InitPage
