import DraggableModal, {IDraggableModalProps} from "../../../../components/draggable-modal";
import React, {useEffect, useRef, useState} from "react";
import ButtonSecond from "../../../../components/ButtonSecond";
import ButtonMain from "../../../../components/ButtonMain";
import Cropper from "cropperjs";
import {message} from "antd";

export default function ImageEditorModal(props:IDraggableModalProps) {
	// state
	const {title, show, data, onOk, onCancel} = props;
	const [imageFile, setImageFile] = useState(null)
	const imageRef = useRef(null)
	const [imageCropper,setImageCropper] = useState(null)
	// mounted
	useEffect(()=>{
		if (show) {
			console.log('into show')
			const {imageFile} = data
			setImageFile(imageFile)
		}
		return () => {
			if (imageCropper) {
				imageCropper.destroy()
			}
		}
	},[show])
	useEffect(() => {
		if (imageRef.current) {
			const cropper = new Cropper(imageRef.current, {
				aspectRatio: 16/9,
				viewMode: 1,
				center: false,
				background: false,
				// zoomOnWheel: false,
				// cropend(_event) {
				// 	console.log(_event)
				// 	console.log(cropper.getCropBoxData())
				// 	const {width,height,left,top} = cropper.getCropBoxData()
				// 	cropper.setCropBoxData({
				// 		width: Math.round(width),
				// 		height: Math.round(height),
				// 		left: Math.round(left),
				// 		top: Math.round(top),
				// 	})
				// },
			});
			setImageCropper(cropper);
		}
	}, [imageFile])
	// methods
	const onOkInner = () => {
		const canvas = imageCropper.getCroppedCanvas(
			{
				imageSmoothingQuality: 'high',
				imageSmoothingEnabled: true,
			}
		);
		canvas.toBlob((blob) => {
			const file = new File([blob], 'model-cover.png', { type: 'image/png' });
			// 如果文件太大，就不上传了
			if (file.size > 1024 * 1024 * 2) {
				message.error('图片大小不能超过2M');
				return;
			}
			const params = {
				imageFile: file,
			}
			onOk(params)
		});
	}
	const onCancelInner = (e) => {
		e.preventDefault()
		onCancel()
	}
	// const changeImage = (value) => {
	// 	console.log(imageCropper.getImageData())
	// 	const {naturalWidth,naturalHeight} = imageCropper.getImageData();
	// 	imageCropper.zoomTo(value,{
	// 		x: naturalWidth/2,
	// 		y: naturalHeight/2,
	// 	})
	// }
	return (
		<DraggableModal title={title}
		                wrapClassName='my-model-edit-image'
		                show={show}
		                onCancel={onCancel}>
			<div className={"w-full flex flex-col items-center"}>
				{/*编辑图片*/}
				<div className={"mt-7 w-[448px] h-[252px]"}>
					{
						<img ref={imageRef}
								 className={"w-full h-full"}
								 style={{ display: 'none' }}
								 src={imageFile && URL.createObjectURL(imageFile)}
								 alt="cover" />
					}
				</div>
				{/*选择缩放*/}
				{/*按钮*/}
				<div className={"mt-9 mb-9 flex"}>
					<ButtonSecond text={'取消'} click={onCancelInner} style={{width:'61px',height:'34px'}}/>
					<ButtonMain text={'确定'} className={"ml-4"} click={onOkInner} style={{width:'61px',height:'34px'}}/>
				</div>
			</div>
		</DraggableModal>
	)
}
