import { useEffect, useState } from 'react'

interface PropInterface {
  question: any
}

export function QuestionRender(props: PropInterface) {
  const [title, setTitle] = useState('')

  useEffect(() => {
    if (!props.question) {
      setTitle('')
      return
    }
    const defaultTypes: any = {
      1: 1, // 单选题
      2: 1, // 多选题
      3: 1, // 判断题
      4: 1, // 填空题
      5: 1, // 问答题
    }
    if (defaultTypes[props.question.types]) {
      setTitle(props.question.content)
      return
    }
    const content = JSON.parse(props.question.content)
    setTitle(content.header)
  }, [props.question])

  return (
    <div
      className="question-list-render"
      dangerouslySetInnerHTML={{
        __html: title.length > 130 ? `${title.slice(0, 130)}...` : title,
      }}
    >
    </div>
  )
}
