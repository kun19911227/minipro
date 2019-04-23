Page({
  data: {
    height: 40,
    primarySize: 'mini', //按钮的尺寸为小尺寸
   
    // 背景图片
    background1: "/images/user1.png",
    background2: "/images/iphone.png",
    name: '', //姓名
    phone: '', //手机号
    describe: '', //个人简介
    images: [] //存放图片的数组
  },
  
  // 个人简介
  bindTextAreaBlur(e) {
    this.setData({
      describe: e.detail.value
    })
  },
  //点击添加按钮上传图片
  chooseImage: function(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        if (this.data.images.length <= 1) {
          const images = this.data.images.concat(res.tempFilePaths)
          // 限制最多只能留下2张照片
          this.setData({
            images: images
          })
        } else {
          wx.showToast({
            title: '最多只能选择两张照片',
            icon: 'none',
            duration: 2000,
            mask: true
          })
        }
      }
    })

  },
  removeImage(e) {
    const idx = e.target.dataset.idx;
    console.log(e.target.dataset.idx);
    this.data.images.splice(idx, 1);
    var del_image = this.data.images;
    this.setData({
      images: del_image
    })
  },
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 转换背景图片格式
    let base641 = wx.getFileSystemManager().readFileSync(this.data.background1, 'base64');
    let base642 = wx.getFileSystemManager().readFileSync(this.data.background2, 'base64');
    this.setData({
      background1: 'data:image/jpg;base64,' + base641,
      background2: 'data:image/jpg;base64,' + base642,
    });
  },
  upload_info: function() {
    var images_list = []; //设置了一个空数组进行储存服务器端图片路径
    var phone_reg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/; //手机正则

    var that = this;
    //验证表单信息
    if (that.data.name == '') {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 2000,
        mask: true
      })
    } else if (that.data.phone == '' || phone_reg.test(that.data.phone) == false) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 2000,
        mask: true
      })
    } else if (that.data.describe == '') {
      wx.showToast({
        title: '个人简介不能为空',
        icon: 'none',
        duration: 2000,
        mask: true
      })
    } else {
      if (that.data.images.length == 0) {//当上传图片为0时，只提交表单的文字信息
        wx.request({
          url: 'http://tieqiao.zzzpsj.com/index.php?g=api&m=banana&a=upload_info',
          method: 'POST',
          data: {
            name: that.data.name,
            phone: that.data.phone,
            introduce: that.data.describe,
            photo: ''
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded" // 默认值
          },
          success(res) {
            //console.log(res.data)
            if (res.data.code == 0) {
              console.log(res.data.msg)
            } else if (res.data.code == 1) {
              wx.showToast({
                title: '上传成功',
                icon: 'none',
                duration: 2000,
                mask: true
              })
            } else {
              console.log(res.data.msg)
            }

          }
        })
      } else {
        for (var i = 0; i < that.data.images.length; i++) {//由于微信小程序一次只能上传一张图片，上传两张图片就要执行2次wx.uploadFile
          wx.uploadFile({
            url: 'http://tieqiao.zzzpsj.com/index.php?g=api&m=banana&a=upload_img',
            filePath: that.data.images[i],
            name: 'photo',
            formData: null,
            success: function (res) {
              //console.log(res.data)
              //后端返回图片上传到服务器上边的地址的json
              //图片json转换数组
              var jsonObj = JSON.parse(res.data)
              console.log(jsonObj.url)
              images_list.push(jsonObj.url);
              if (that.data.images.length == images_list.length) {//只有当图片全部上传成功才能提交表单，因为表单只需要提交一次
                var images_str = images_list.join(",")//把存放图片地址的数组转化为以逗号分隔的字符串
                console.log(images_str)
                wx.request({
                  url: 'http://tieqiao.zzzpsj.com/index.php?g=api&m=banana&a=upload_info',
                  method: 'POST',
                  data: {
                    name: that.data.name,
                    phone: that.data.phone,
                    introduce: that.data.describe,
                    photo: images_str,
                  },
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded" // 默认值
                  },
                  success(res) {//success只能说明接口调取并返回成功，并不是代表信息上传成功，还需要判断返回的code码
                    if (res.data.code == 0) {//code=0有参数为空
                      console.log(res.data.msg)
                    } else if (res.data.code == 1) {//code=1请求成功跳转
                      wx.showToast({
                        title: '上传成功',
                        icon: 'none',
                        duration: 2000,
                        mask: true
                      })
                    } else {
                      console.log(res.data.msg)
                    }

                  }
                })
              }
            },
            fail: function (error) { }
          })
        }
      }
    }
  },
  // 姓名
  name: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 电话
  phone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})