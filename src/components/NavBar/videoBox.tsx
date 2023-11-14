import { useState } from 'react'
import { Modal } from 'antd'
import closeIcon from '@/assets/img/home/close-icon.png'
import styles from './history-pc.scss'

const VideoBox = (props) => {
  const { handleClose } = props;
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const hClose = () => {
    handleClose()
  }
  const handleLookVideo = (e) => {
    e.preventDefault()
    setIsModalOpen(true)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
    document.getElementById("instructional").pause()
  }
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const videoUrl = 'https://img.optionworld.com/group1/M00/00/14/CirOc2UwyoKAdWb-AjK93RQBOIE658.mp4'
  return (
    <div className={styles['history-box']}>
      <div className={styles['title']}>
        <span>Video Tutorials</span>
        <img onClick={() => hClose()} src={closeIcon} alt="close" />
      </div>
      <div className={styles['video-list']}>
        <ul>
          <li><h2>Instructional video</h2></li>
          <li onClick={handleLookVideo} className={styles['lookVideo']}>
            <video src={videoUrl} controls >
            </video>
          </li>
        </ul>
      </div>
      <Modal className={styles['video-modal']} title="Instructional video" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null} width={800}>
        <video id='instructional' className={styles['lookVideo']} poster={videoUrl} src={videoUrl} autoPlay controls loop ></video>
      </Modal>
    </div>
  )
}

export default VideoBox
