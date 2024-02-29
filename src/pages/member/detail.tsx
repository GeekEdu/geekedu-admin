import { useEffect, useState } from 'react'
import { Button, Modal, Radio, Space, Tag, message } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { member } from '../../api/index'
import { BackBartment, PerButton } from '../../components'
import { titleAction } from '../../store/user/loginUserSlice'
import { dateFormat } from '../../utils/index'
import styles from './detail.module.scss'
import { MemberUpdateDialog } from './components/update'
import { CreditDialog } from './components/credit-dialog'
import { IOSDialog } from './components/iOS-dialog'
import { TagsDialog } from './components/tags-dialog'
import { RemarkDialog } from './components/remark-dailog'
import { UserOrdersComp } from './detail/orders'
import { UserVodWatchRecordsComp } from './detail/vod-watch-records'
import { UserVideoWatchRecordsComp } from './detail/video-watch-records'
import { UserInviteComp } from './detail/invite'
import { UserCredit1Comp } from './detail/credit1'
import { UserBalanceRecordsComp } from './detail/balance-records'
import { UserIOSRecordsComp } from './detail/iOS-records'

const { confirm } = Modal

function MemberDetailPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()
  const [loading, setLoading] = useState<boolean>(false)
  const [userData, setUserData] = useState<any>({})
  const [showUpdateWin, setShowUpdateWin] = useState<boolean>(false)
  const [showCreditWin, setShowCreditWin] = useState<boolean>(false)
  const [showRemarkWin, setShowRemarkWin] = useState<boolean>(false)
  const [showTagsWin, setShowTagsWin] = useState<boolean>(false)
  const [showIOSWin, setShowIOSWin] = useState<boolean>(false)
  const [roles, setRoles] = useState<any>([])
  const [tags, setTags] = useState<any>([])
  const [courseTabActive, setCourseTabActive] = useState<string>('order')
  const [courseTypes, setCourseTypes] = useState<any>([])
  const user = useSelector((state: any) => state.loginUser.value.user)
  const enabledAddons = useSelector(
    (state: any) => state.enabledAddonsConfig.value.enabledAddons,
  )

  useEffect(() => {
    document.title = '学员详情'
    dispatch(titleAction('学员详情'))
  }, [])

  useEffect(() => {
    getUser()
    getParams()
  }, [params.memberId])

  useEffect(() => {
    const types = [
      {
        name: '订单明细',
        key: 'order',
      },
    ]
    if (checkPermission('v2.member.courses')) {
      types.push({
        name: '录播课学习',
        key: 'vod-watch-records',
      })
    }
    if (checkPermission('v2.member.videos')) {
      types.push({
        name: '单独订阅课时',
        key: 'video-watch-records',
      })
    }
    types.push(
      ...[
        {
          name: '邀请明细',
          key: 'invite',
        },
        {
          name: '积分明细',
          key: 'credit1',
        },
      ],
    )
    if (
      enabledAddons.MultiLevelShare
      && checkPermission('addons.MultiLevelShare.member.balanceRecords')
    ) {
      types.push({
        name: '邀请余额明细',
        key: 'balanceRecords',
      })
    }
    // if (
    //   enabledAddons.TemplateOne
    //   && checkPermission('addons.TemplateOne.memberCredit2Records.list')
    // ) {
    //   types.push({
    //     name: 'iOS余额明细',
    //     key: 'iOSRecords',
    //   })
    // }
    setCourseTypes(types)
  }, [enabledAddons, user])

  const checkPermission = (val: string) => {
    return typeof user.permissions[val] !== 'undefined'
  }

  const getUser = () => {
    if (loading)
      return

    setLoading(true)
    member
      .detail(params.memberId)
      .then((res: any) => {
        setUserData(res.data)
        setLoading(false)
      })
      .catch((e) => {
        setLoading(false)
      })
  }

  const getParams = () => {
    member.create({}).then((res: any) => {
      const roles = res.data.vip
      const arr: any = []
      roles.map((item: any) => {
        arr.push({
          label: item.name,
          value: item.id,
        })
      })
      setRoles(arr)
      const tags = res.data.tag
      const arr2: any = []
      tags.map((item: any) => {
        arr2.push({
          label: item.name,
          value: item.id,
        })
      })
      setTags(arr2)
    })
  }

  const lockMember = () => {
    let text = '冻结后此账号将无法登录，确认冻结？'
    let value = 1
    if (userData.is_lock === 1) {
      text = '解冻后此账号将正常登录，确认解冻？'
      value = 0
    }
    confirm({
      title: '警告',
      icon: <ExclamationCircleFilled />,
      content: text,
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        member
          .editMulti({
            user_ids: [params.memberId],
            field: 'is_lock',
            value,
          })
          .then(() => {
            message.success('成功')
            getUser()
          })
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const changeCredit = () => {
    setShowCreditWin(true)
  }

  const changeTags = () => {
    setShowTagsWin(true)
  }

  const changeRemark = () => {
    setShowRemarkWin(true)
  }

  const rechargeIOSCredit = () => {
    setShowIOSWin(true)
  }

  return (
    <div className={styles['user-main-body']}>
      <MemberUpdateDialog
        id={params.memberId}
        open={showUpdateWin}
        roles={roles}
        onCancel={() => setShowUpdateWin(false)}
        onSuccess={() => {
          setShowUpdateWin(false)
          getUser()
        }}
      >
      </MemberUpdateDialog>
      <CreditDialog
        id={params.memberId}
        open={showCreditWin}
        onCancel={() => setShowCreditWin(false)}
        onSuccess={() => {
          setShowCreditWin(false)
          getUser()
        }}
      >
      </CreditDialog>
      <IOSDialog
        id={params.memberId}
        open={showIOSWin}
        onCancel={() => setShowIOSWin(false)}
        onSuccess={() => {
          setShowIOSWin(false)
          getUser()
        }}
      >
      </IOSDialog>
      <TagsDialog
        tags={tags}
        id={params.memberId}
        open={showTagsWin}
        onCancel={() => setShowTagsWin(false)}
        onSuccess={() => {
          setShowTagsWin(false)
          getUser()
        }}
      >
      </TagsDialog>
      <RemarkDialog
        id={params.memberId}
        open={showRemarkWin}
        onCancel={() => setShowRemarkWin(false)}
        onSuccess={() => {
          setShowRemarkWin(false)
          getUser()
        }}
      >
      </RemarkDialog>
      <div className="float-left bg-white br-15 p-30">
        <BackBartment title="学员详情" />
        <div className={styles['user-info-box']}>
          <div className={styles['user-base-info-box']}>
            <div className={styles['user-avatar']}>
              <img src={userData.avatar} width={80} height={80} />
            </div>
            <div className={styles['user-info']}>
              <div className={styles['user-nickname']}>
                {userData.nick_name}
              </div>
              <div className={styles.buttons}>
                <Button
                  type="link"
                  className={styles['real-profile']}
                  onClick={() => setShowUpdateWin(true)}
                >
                  修改资料
                </Button>
                <Button
                  type="link"
                  className={styles['edit-profile']}
                  onClick={() => navigate(`/member/profile/${params.memberId}`)}
                >
                  实名信息
                </Button>
                <PerButton
                  type="link"
                  text={userData.is_lock === 1 ? '解冻账号' : '冻结账号'}
                  class={styles['edit-profile']}
                  icon={null}
                  p="member.update"
                  onClick={() => {
                    lockMember()
                  }}
                  disabled={null}
                />
                <PerButton
                  type="link"
                  text="变动积分"
                  class={styles['edit-profile']}
                  icon={null}
                  p="member.credit1.change"
                  onClick={() => {
                    changeCredit()
                  }}
                  disabled={null}
                />
                <PerButton
                  type="link"
                  text="修改标签"
                  class={styles['edit-profile']}
                  icon={null}
                  p="member.tags"
                  onClick={() => {
                    changeTags()
                  }}
                  disabled={null}
                />
                <PerButton
                  type="link"
                  text="修改备注"
                  class={styles['edit-profile']}
                  icon={null}
                  p="member.remark.update"
                  onClick={() => {
                    changeRemark()
                  }}
                  disabled={null}
                />
                {/* {enabledAddons.TemplateOne && (
                  <PerButton
                    type="link"
                    text="变动iOS余额"
                    class={styles['edit-profile']}
                    icon={null}
                    p="addons.TemplateOne.memberCredit2.recharge"
                    onClick={() => {
                      rechargeIOSCredit()
                    }}
                    disabled={null}
                  />
                )} */}
              </div>
            </div>
          </div>
          <div className={styles['panel-info-box']}>
            <div className={styles['panel-info-item']}>
              ID：
              {userData.id}
            </div>
            <div className={styles['panel-info-item']}>
              手机号：
              {userData.phone}
            </div>
            <div className={styles['panel-info-item']}>
              VIP：
              {' '}
              {userData.vip ? userData.vip.name : ''}
            </div>
            {
              userData.vipId !== 3 && (
                <div className={styles['panel-info-item']}>
                  VIP到期：
                  {dateFormat(userData.vipExpireTime)}
                </div>
              )
            }
            <div className={styles['panel-info-item']}>
              账号状态：
              {userData.isFrozen && <span className="c-red">已冻结</span>}
              {!userData.isFrozen && <span className="c-green">正常</span>}
            </div>
            <div className={styles['panel-info-item']}>
              注册区域：
              {userData?.address}
            </div>
            <div className={styles['panel-info-item']}>
              最近登录：
              {dateFormat(userData?.updatedTime)}
            </div>
            <div className={styles['panel-info-item']}>
              注册IP：
              {userData?.ipAddress}
            </div>
            <div className={styles['panel-info-item']}>
              邀请人：
              {userData.invitor ? userData.invitor.name : ''}
              {userData.invito && (
                <div className="item">
                  (截
                  {dateFormat(userData.invite_user_expired_at)}
                  )
                </div>
              )}
            </div>
            <div className={styles['panel-info-item']}>
              推广分销余额：
              {userData.invite_balance}
            </div>
            <div className={styles['panel-info-item']}>
              积分：
              <span>{userData.points}</span>
            </div>
            {/* <div className={styles['panel-info-item']}>
              iOS余额：
              <span>{userData.credit2}</span>
            </div> */}
            <div className={styles['panel-info-item']}>
              用户标签：
              {userData.tag
              && userData.tag.length > 0
              && userData.tag.map((item: any) => (
                <Tag key={item.id} color="processing" className="ml-5 mb-5">
                  {item.name}
                </Tag>
              ))}
            </div>
            <div className={styles['panel-info-item']}>
              备注：
              {userData.remark && (
                <div
                  className={styles['remark-text']}
                  dangerouslySetInnerHTML={{ __html: userData.remark.remark }}
                >
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className="float-left bg-white br-15 p-30 mt-30"
        style={{ textAlign: 'left' }}
      >
        <Radio.Group
          size="large"
          defaultValue={courseTabActive}
          buttonStyle="solid"
          onChange={(e) => {
            setCourseTabActive(e.target.value)
          }}
        >
          {courseTypes.length > 0
          && courseTypes.map((item: any) => (
            <Radio.Button key={item.key} value={item.key}>
              {item.name}
            </Radio.Button>
          ))}
        </Radio.Group>
        <div className="float-left mt-30">
          {courseTabActive === 'order' && (
            <UserOrdersComp id={params.memberId}></UserOrdersComp>
          )}
          {courseTabActive === 'vod-watch-records' && (
            <UserVodWatchRecordsComp
              id={params.memberId}
            >
            </UserVodWatchRecordsComp>
          )}
          {courseTabActive === 'video-watch-records' && (
            <UserVideoWatchRecordsComp
              id={params.memberId}
            >
            </UserVideoWatchRecordsComp>
          )}
          {courseTabActive === 'invite' && (
            <UserInviteComp id={params.memberId}></UserInviteComp>
          )}
          {courseTabActive === 'credit1' && (
            <UserCredit1Comp id={params.memberId}></UserCredit1Comp>
          )}
          {courseTabActive === 'balanceRecords' && (
            <UserBalanceRecordsComp
              id={params.memberId}
            >
            </UserBalanceRecordsComp>
          )}
          {courseTabActive === 'iOSRecords' && (
            <UserIOSRecordsComp
              id={params.memberId}
            >
            </UserIOSRecordsComp>
          )}
        </div>
      </div>
    </div>
  )
}

export default MemberDetailPage
