import { useEffect, useState } from 'react'
import { Button, Image, Modal, Select, message } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { titleAction } from '../../../store/user/loginUserSlice'
import { BackBartment, PerButton, QuestionRender } from '../../../components'
import { paper } from '../../../api/index'
import styles from './marking.module.scss'

const { confirm } = Modal

function PaperMarkingPage() {
  const result = new URLSearchParams(useLocation().search)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const [userPaper, setUserPaper] = useState<any>({})
  const [questions, setQuestions] = useState<any>([])
  const [score, setScore] = useState<any>([])
  const [list, setList] = useState<any>([])
  const [optionLength, setOptionLength] = useState(10)
  const [id, setId] = useState(Number(result.get('id')))
  const [pid, setPid] = useState(Number(result.get('user_paper_id')))

  useEffect(() => {
    document.title = '阅卷'
    dispatch(titleAction('阅卷'))
    getParams()
  }, [id, pid])

  useEffect(() => {
    setId(Number(result.get('id')))
    setPid(Number(result.get('user_paper_id')))
  }, [result.get('id'), result.get('user_paper_id')])

  useEffect(() => {
    if (questions.length === 0) {
      setList([])
      return
    }
    const arr = []
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]
      if (question.question === null)
        continue

      if (question.question.type === 4) {
        // 问答题
        arr.push({
          id: question.id,
          score: question.question.score,
          header: null,
          content: question.question.content,
          remark: question.question.remark,
          answer: question.answer_content,
          thumbs: question.thumbs ? JSON.parse(question.thumbs) : [],
        })
        continue
      }
      if (question.question.type === 6) {
        // 题帽题
        const questionContent = JSON.parse(question.question.content)
        const answerContent = question.answer_contents_rows
        for (let j = 0; j < questionContent.questions.length; j++) {
          const childrenQuestion = questionContent.questions[j]
          const childrenAnswer
            = typeof answerContent[j] === 'undefined' ? null : answerContent[j]
          if (childrenQuestion.type === 4) {
            // 题帽题中含有问答题
            arr.push({
              id: `${question.id}-cap-${j}`,
              score: childrenQuestion.score,
              header: questionContent.header,
              content: childrenQuestion.content,
              remark: question.question.remark,
              answer: childrenAnswer ? childrenAnswer.answer : '',
              thumbs:
                childrenAnswer && childrenAnswer.thumbs !== ''
                  ? JSON.parse(childrenAnswer.thumbs)
                  : [],
            })
          }
        }

        continue
      }
    }
    setList(arr)
  }, [questions])

  const getParams = () => {
    paper
      .marking(id, pid, {
        id,
        user_paper_id: pid,
      })
      .then((res: any) => {
        setUserPaper(res.data.userPaper)
        setQuestions(res.data.questions)
      })
  }

  const scoreList = (max: number) => {
    const rows = []
    for (let i = 0; i <= max; i++) {
      rows.push({
        value: i,
        label: `${i}分`,
      })
    }
    return rows
  }

  const selectIsActive = (val: string, answer: string) => {
    const answers = answer.split(',')
    return answers.includes(val)
  }

  const userAnswer = (item: any) => {
    if (item.question.type === 1) {
      return item.question[item.answer_content]
    }
    else if (item.question.type === 2) {
      const rows: any = []
      item.answer_content.split(',').forEach((i: any) => {
        rows.push(item.question[i])
      })
      return rows.join(',')
    }
    else if (item.question.type === 5) {
      return Number.parseInt(item.answer_content) === 1 ? '正确' : '错误'
    }
    else {
      return item.answer_content
    }
  }

  const formValidate = () => {
    confirm()
  }

  const confirm = () => {
    if (loading)
      return

    if (score.length === 0) {
      message.error('请打分后再提交')
      return
    }
    setLoading(true)
    const data: any = {}
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      data[item.id] = {
        score: score[item.id],
      }
    }
    paper
      .submitScore({
        id,
        user_paper_id: pid,
        data,
      })
      .then((res: any) => {
        setLoading(false)
        message.success('保存成功！')
        navigate(-1)
      })
      .catch((e) => {
        setLoading(false)
      })
  }

  return (
    <div className="geekedu-main-body">
      <BackBartment title="阅卷"></BackBartment>
      <div className="float-left mt-30">
        <div className="float-left">
          <div className="h-panel-body">
            <div className="float-box mb-10">
              <h2>
                {userPaper?.status_text}
                {userPaper.status === 2 && (
                  <span>
                    -
                    {userPaper?.score}
                    分
                  </span>
                )}
              </h2>
            </div>
            <div className="float-box mb-10">
              {list.length > 0
              && list.map((item: any) => (
                <div className={styles['question-item']} key={item.id}>
                  <div className={styles.content}>
                    {item.header && (
                      <div
                        className={styles.header}
                        dangerouslySetInnerHTML={{ __html: item.header }}
                      >
                      </div>
                    )}
                    <div
                      className="mb-10"
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    >
                    </div>
                    <div className={styles.answer}>
                      <p className={styles.p}>
                        回答：
                        {item.answer}
                      </p>
                      {item.thumbs
                      && item.thumbs.length > 0
                      && item.thumbs.map((img: any, index: number) => (
                        <Image
                            key={index}
                            width={70}
                            height={70}
                            src={img}
                          >
                          </Image>
                      ))}
                    </div>
                    <div className={styles.score}>
                      <p className={styles.p}>请打分：</p>
                      <div>
                        <Select
                          style={{ width: 200 }}
                          value={score[item.id]}
                          onChange={(e) => {
                            const arr = [...score]
                            arr[item.id] = e
                            setScore(arr)
                          }}
                          allowClear
                          placeholder="请打分"
                          options={scoreList(item.score)}
                        >
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bottom-menus">
          <div className="bottom-menus-box">
            <div>
              {userPaper.status === 3 && (
                <Button
                  loading={loading}
                  type="primary"
                  onClick={() => formValidate()}
                >
                  保存
                </Button>
              )}
            </div>
            <div className="ml-24">
              <Button type="default" onClick={() => navigate(-1)}>
                取消
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaperMarkingPage
