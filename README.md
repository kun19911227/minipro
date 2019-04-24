# minipro
微信小程序提交带图片的表单

代码中的测试接口地址http://tieqiao.zzzpsj.com/，需要把开发者工具的合法域名校验去掉勾，用手机测试需要打开小程序的调试模式

### 目录说明

```
upload_images
├── pages
│   ├── upload_info 提交表单
│   └── display_info 信息展示  
├── utils 
│   └── util.js 工具 
├── cmf_banana.sql MySQL数据库表
├── app.js 小程序人口
└── config.js 配置项

后端PHP代码BananaController.class.php

<?php

namespace Api\Controller;
use Common\Controller\AppframeController;

/**
 * @author Banana
 * 小程序提交带图片的form表单
 */
class BananaController extends AppframeController{

	private $banana_model;

	public function _initialize() {
		parent::_initialize();
		$this->banana_model=D("Banana");
	}

	/**
	 * 上传信息api
	 */
	public function upload_info() {
		$data = array();
		$post = array();
		//接收参数
		$post['name'] = I('post.name');
		$post['phone'] = I('post.phone');
		$post['introduce'] = I('post.introduce');//非必填
		$post['photo'] = I('post.photo');//非必填
		$post['create_time'] = time();

		if ((empty($post['name']) && isset($post['name'])) ||
			(empty($post['phone']) && isset($post['phone'])) ) {
			$data['code'] = 0;
			$data['msg'] = "有必填参数为空";
		} else {

			$result = $this->banana_model->add($post);

			if ($result !== false) {
				$data['id'] = $result;
				$data['code'] = 1;
				$data['msg'] = "提交成功";
			} else {
				$data['code'] = 2;
				$data['msg'] = "提交失败";
			}

		}
		return $this->ajaxReturn($data);
	}

	/**
	 * 上传文件
	 */
	public function upload_img() {
		$data = array();
		$uploadConfig = array(
			'FILE_UPLOAD_TYPE' => sp_is_sae() ? 'Sae' : 'Local',
			'rootPath' => './'.C( 'UPLOADPATH' ),
			'savePath' => './minipro/',
			'saveName' => array( 'uniqid', '' ),
			'exts' => array( 'jpg', 'jpeg', 'png','gif' ),
			'autoSub' => false
		);
		$upload = new \Think\Upload( $uploadConfig );
		$info = $upload->upload();
		if($info) {
			$save_name = $info['photo']['savepath'].$info['photo']['savename'];
			$save_name = substr($save_name,1);
			$url = "http://".$_SERVER['HTTP_HOST']."/data/upload".$save_name;
			$data['url'] = $url;
			return $this->ajaxReturn($data);
		}
	}

	/**
	 * 信息展示api
	 */
	public function detail() {
		$data = array();
		$id = I('get.id');
		if (empty($id) && isset($id)) {
			$data['code'] = 0;
			$data['msg'] = "参数为空";
		} else {
			//信息
			$banana = $this->banana_model->find($id);

			if ($banana) {

				$data['banana'] = $banana;
				$data['code'] = 1;
				$data['msg'] = "请求成功";
			} else {
				$data['code'] = 2;
				$data['msg'] = "未获取到详细信息";
			}
		}
		return $this->ajaxReturn($data);
	}

}
