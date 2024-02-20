import { useEffect, useState } from 'react'
import MDEditor, { commands } from '@uiw/react-md-editor'
import { SelectImage } from '../../components'
import styles from './index.module.scss'

interface PropInterface {
  height: number
  defaultValue: string
  setContent: (value: string, renderValue: string) => void
}

// 这是 markdown 编辑器，将其魔改后为一个组件
export const MdEditor: React.FC<PropInterface> = (props) => {
  const { height, defaultValue, setContent } = props
  const [value, setValue] = useState('')
  const [showUploadImage, setShowUploadImage] = useState<boolean>(false)

  useEffect(() => {
    if (defaultValue)
      setValue(defaultValue)
  }, [defaultValue])

  useEffect(() => {
    // 拿到渲染后的值
    const div: any = document.getElementById('render-content')
    const uselessA = div
      .getElementsByTagName('div')[0]
      .querySelectorAll('.anchor')
    for (let i = 0; i < uselessA.length; i++)
      uselessA[i].remove()

    const renderValue = div.getElementsByTagName('div')[0].innerHTML // 拿到渲染后的内容
    setContent(value, renderValue)
  }, [value])

  return (
    <>
      <div style={{ height: height || 300 }}>
        <MDEditor
          className="gooooooooo"
          height={height || 300}
          value={value}
          onChange={(newValue = '') => {
            setValue(newValue)
          }}
          // 自定义 toolBar
          components={{
            toolbar: (command, disabled, executeCommand) => {
              // console.log(command.keyCommand);
              // 图片上传
              if (command.keyCommand === 'image') {
                return (
                  <button
                    aria-label="Insert image"
                    disabled={disabled}
                    onClick={(evn) => {
                      evn.stopPropagation()
                      setShowUploadImage(true)
                      executeCommand(command, command.groupName)
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 20 20">
                      <path
                        fill="currentColor"
                        d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"
                      >
                      </path>
                    </svg>
                  </button>
                )
              }
            },
          }}
        />
        {/* 将预览内容隐藏起来，只需要得到预览内容即可 */}
        <div id="render-content" style={{ display: 'none' }}>
          <MDEditor.Markdown
            source={value}
            style={{ whiteSpace: 'pre-wrap' }}
          />
        </div>
        <SelectImage
          open={showUploadImage}
          from={0}
          onCancel={() => {
            let newValue = value
            if (
              newValue.includes('![image](https://example.com/your-image.png)')
            ) {
              newValue = newValue.replace(
                '![image](https://example.com/your-image.png)',
                '',
              )
              setValue(newValue)
            }
            setShowUploadImage(false)
          }}
          onSelected={(url) => {
            let newValue = value
            if (
              newValue.includes('![image](https://example.com/your-image.png)')
            ) {
              newValue = newValue.replace(
                '![image](https://example.com/your-image.png)',
                `![image](${url})`,
              )
              setValue(newValue)
            }
            setShowUploadImage(false)
          }}
        >
        </SelectImage>
      </div>
    </>
  )
}
